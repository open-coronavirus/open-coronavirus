import * as tslib_1 from "tslib";
import { bindLifecycleEvents } from '../../providers/angular-delegate';
import { computeStackId, destroyView, getUrl, insertView, isTabSwitch, toSegments } from './stack-utils';
export class StackController {
    constructor(tabsPrefix, containerEl, router, navCtrl, zone, location) {
        this.containerEl = containerEl;
        this.router = router;
        this.navCtrl = navCtrl;
        this.zone = zone;
        this.location = location;
        this.views = [];
        this.skipTransition = false;
        this.nextId = 0;
        this.tabsPrefix = tabsPrefix !== undefined ? toSegments(tabsPrefix) : undefined;
    }
    createView(ref, activatedRoute) {
        const url = getUrl(this.router, activatedRoute);
        const element = (ref && ref.location && ref.location.nativeElement);
        const unlistenEvents = bindLifecycleEvents(this.zone, ref.instance, element);
        return {
            id: this.nextId++,
            stackId: computeStackId(this.tabsPrefix, url),
            unlistenEvents,
            element,
            ref,
            url,
        };
    }
    getExistingView(activatedRoute) {
        const activatedUrlKey = getUrl(this.router, activatedRoute);
        const view = this.views.find(vw => vw.url === activatedUrlKey);
        if (view) {
            view.ref.changeDetectorRef.reattach();
        }
        return view;
    }
    setActive(enteringView) {
        let { direction, animation } = this.navCtrl.consumeTransition();
        const leavingView = this.activeView;
        const tabSwitch = isTabSwitch(enteringView, leavingView);
        if (tabSwitch) {
            direction = 'back';
            animation = undefined;
        }
        const viewsSnapshot = this.views.slice();
        let currentNavigation;
        const router = this.router;
        // Angular >= 7.2.0
        if (router.getCurrentNavigation) {
            currentNavigation = router.getCurrentNavigation();
            // Angular < 7.2.0
        }
        else if (router.navigations &&
            router.navigations.value) {
            currentNavigation = router.navigations.value;
        }
        /**
         * If the navigation action
         * sets `replaceUrl: true`
         * then we need to make sure
         * we remove the last item
         * from our views stack
         */
        if (currentNavigation &&
            currentNavigation.extras &&
            currentNavigation.extras.replaceUrl) {
            if (this.views.length > 0) {
                this.views.splice(-1, 1);
            }
        }
        const reused = this.views.includes(enteringView);
        const views = this.insertView(enteringView, direction);
        // Trigger change detection before transition starts
        // This will call ngOnInit() the first time too, just after the view
        // was attached to the dom, but BEFORE the transition starts
        if (!reused) {
            enteringView.ref.changeDetectorRef.detectChanges();
        }
        // Wait until previous transitions finish
        return this.zone.runOutsideAngular(() => {
            return this.wait(() => {
                // disconnect leaving page from change detection to
                // reduce jank during the page transition
                if (leavingView) {
                    leavingView.ref.changeDetectorRef.detach();
                }
                // In case the enteringView is the same as the leavingPage we need to reattach()
                enteringView.ref.changeDetectorRef.reattach();
                return this.transition(enteringView, leavingView, animation, this.canGoBack(1), false)
                    .then(() => cleanupAsync(enteringView, views, viewsSnapshot, this.location))
                    .then(() => ({
                    enteringView,
                    direction,
                    animation,
                    tabSwitch
                }));
            });
        });
    }
    canGoBack(deep, stackId = this.getActiveStackId()) {
        return this.getStack(stackId).length > deep;
    }
    pop(deep, stackId = this.getActiveStackId()) {
        return this.zone.run(() => {
            const views = this.getStack(stackId);
            if (views.length <= deep) {
                return Promise.resolve(false);
            }
            const view = views[views.length - deep - 1];
            let url = view.url;
            const viewSavedData = view.savedData;
            if (viewSavedData) {
                const primaryOutlet = viewSavedData.get('primary');
                if (primaryOutlet &&
                    primaryOutlet.route &&
                    primaryOutlet.route._routerState &&
                    primaryOutlet.route._routerState.snapshot &&
                    primaryOutlet.route._routerState.snapshot.url) {
                    url = primaryOutlet.route._routerState.snapshot.url;
                }
            }
            return this.navCtrl.navigateBack(url, view.savedExtras).then(() => true);
        });
    }
    startBackTransition() {
        const leavingView = this.activeView;
        if (leavingView) {
            const views = this.getStack(leavingView.stackId);
            const enteringView = views[views.length - 2];
            return this.wait(() => {
                return this.transition(enteringView, // entering view
                leavingView, // leaving view
                'back', this.canGoBack(2), true);
            });
        }
        return Promise.resolve();
    }
    endBackTransition(shouldComplete) {
        if (shouldComplete) {
            this.skipTransition = true;
            this.pop(1);
        }
        else if (this.activeView) {
            cleanup(this.activeView, this.views, this.views, this.location);
        }
    }
    getLastUrl(stackId) {
        const views = this.getStack(stackId);
        return views.length > 0 ? views[views.length - 1] : undefined;
    }
    /**
     * @internal
     */
    getRootUrl(stackId) {
        const views = this.getStack(stackId);
        return views.length > 0 ? views[0] : undefined;
    }
    getActiveStackId() {
        return this.activeView ? this.activeView.stackId : undefined;
    }
    destroy() {
        this.containerEl = undefined;
        this.views.forEach(destroyView);
        this.activeView = undefined;
        this.views = [];
    }
    getStack(stackId) {
        return this.views.filter(v => v.stackId === stackId);
    }
    insertView(enteringView, direction) {
        this.activeView = enteringView;
        this.views = insertView(this.views, enteringView, direction);
        return this.views.slice();
    }
    transition(enteringView, leavingView, direction, showGoBack, progressAnimation) {
        if (this.skipTransition) {
            this.skipTransition = false;
            return Promise.resolve(false);
        }
        if (leavingView === enteringView) {
            return Promise.resolve(false);
        }
        const enteringEl = enteringView ? enteringView.element : undefined;
        const leavingEl = leavingView ? leavingView.element : undefined;
        const containerEl = this.containerEl;
        if (enteringEl && enteringEl !== leavingEl) {
            enteringEl.classList.add('ion-page');
            enteringEl.classList.add('ion-page-invisible');
            if (enteringEl.parentElement !== containerEl) {
                containerEl.appendChild(enteringEl);
            }
            if (containerEl.commit) {
                return containerEl.commit(enteringEl, leavingEl, {
                    deepWait: true,
                    duration: direction === undefined ? 0 : undefined,
                    direction,
                    showGoBack,
                    progressAnimation
                });
            }
        }
        return Promise.resolve(false);
    }
    wait(task) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.runningTask !== undefined) {
                yield this.runningTask;
                this.runningTask = undefined;
            }
            const promise = this.runningTask = task();
            return promise;
        });
    }
}
const cleanupAsync = (activeRoute, views, viewsSnapshot, location) => {
    if (typeof requestAnimationFrame === 'function') {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                cleanup(activeRoute, views, viewsSnapshot, location);
                resolve();
            });
        });
    }
    return Promise.resolve();
};
const ɵ0 = cleanupAsync;
const cleanup = (activeRoute, views, viewsSnapshot, location) => {
    viewsSnapshot
        .filter(view => !views.includes(view))
        .forEach(destroyView);
    views.forEach(view => {
        /**
         * In the event that a user navigated multiple
         * times in rapid succession, we want to make sure
         * we don't pre-emptively detach a view while
         * it is in mid-transition.
         *
         * In this instance we also do not care about query
         * params or fragments as it will be the same view regardless
         */
        const locationWithoutParams = location.path().split('?')[0];
        const locationWithoutFragment = locationWithoutParams.split('#')[0];
        if (view !== activeRoute && view.url !== locationWithoutFragment) {
            const element = view.element;
            element.setAttribute('aria-hidden', 'true');
            element.classList.add('ion-page-hidden');
            view.ref.changeDetectorRef.detach();
        }
    });
};
const ɵ1 = cleanup;
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL3N0YWNrLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUtBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR3ZFLE9BQU8sRUFBeUIsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEksTUFBTSxPQUFPLGVBQWU7SUFTMUIsWUFDRSxVQUE4QixFQUN0QixXQUF1QyxFQUN2QyxNQUFjLEVBQ2QsT0FBc0IsRUFDdEIsSUFBWSxFQUNaLFFBQWtCO1FBSmxCLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtRQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWJwQixVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUV4QixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUd2QixXQUFNLEdBQUcsQ0FBQyxDQUFDO1FBVWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDbEYsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFzQixFQUFFLGNBQThCO1FBQy9ELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQWdCLENBQUM7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QUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudFJlZiwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJvdXRlckRpcmVjdGlvbiB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgYmluZExpZmVjeWNsZUV2ZW50cyB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9hbmd1bGFyLWRlbGVnYXRlJztcbmltcG9ydCB7IE5hdkNvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvbmF2LWNvbnRyb2xsZXInO1xuXG5pbXBvcnQgeyBSb3V0ZVZpZXcsIFN0YWNrRXZlbnQsIGNvbXB1dGVTdGFja0lkLCBkZXN0cm95VmlldywgZ2V0VXJsLCBpbnNlcnRWaWV3LCBpc1RhYlN3aXRjaCwgdG9TZWdtZW50cyB9IGZyb20gJy4vc3RhY2stdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgU3RhY2tDb250cm9sbGVyIHtcblxuICBwcml2YXRlIHZpZXdzOiBSb3V0ZVZpZXdbXSA9IFtdO1xuICBwcml2YXRlIHJ1bm5pbmdUYXNrPzogUHJvbWlzZTxhbnk+O1xuICBwcml2YXRlIHNraXBUcmFuc2l0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdGFic1ByZWZpeDogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgYWN0aXZlVmlldzogUm91dGVWaWV3IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIG5leHRJZCA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdGFic1ByZWZpeDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIHByaXZhdGUgY29udGFpbmVyRWw6IEhUTUxJb25Sb3V0ZXJPdXRsZXRFbGVtZW50LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBuYXZDdHJsOiBOYXZDb250cm9sbGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uXG4gICkge1xuICAgIHRoaXMudGFic1ByZWZpeCA9IHRhYnNQcmVmaXggIT09IHVuZGVmaW5lZCA/IHRvU2VnbWVudHModGFic1ByZWZpeCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBjcmVhdGVWaWV3KHJlZjogQ29tcG9uZW50UmVmPGFueT4sIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IFJvdXRlVmlldyB7XG4gICAgY29uc3QgdXJsID0gZ2V0VXJsKHRoaXMucm91dGVyLCBhY3RpdmF0ZWRSb3V0ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IChyZWYgJiYgcmVmLmxvY2F0aW9uICYmIHJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCB1bmxpc3RlbkV2ZW50cyA9IGJpbmRMaWZlY3ljbGVFdmVudHModGhpcy56b25lLCByZWYuaW5zdGFuY2UsIGVsZW1lbnQpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5uZXh0SWQrKyxcbiAgICAgIHN0YWNrSWQ6IGNvbXB1dGVTdGFja0lkKHRoaXMudGFic1ByZWZpeCwgdXJsKSxcbiAgICAgIHVubGlzdGVuRXZlbnRzLFxuICAgICAgZWxlbWVudCxcbiAgICAgIHJlZixcbiAgICAgIHVybCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0RXhpc3RpbmdWaWV3KGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IFJvdXRlVmlldyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgYWN0aXZhdGVkVXJsS2V5ID0gZ2V0VXJsKHRoaXMucm91dGVyLCBhY3RpdmF0ZWRSb3V0ZSk7XG4gICAgY29uc3QgdmlldyA9IHRoaXMudmlld3MuZmluZCh2dyA9PiB2dy51cmwgPT09IGFjdGl2YXRlZFVybEtleSk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIHZpZXcucmVmLmNoYW5nZURldGVjdG9yUmVmLnJlYXR0YWNoKCk7XG4gICAgfVxuICAgIHJldHVybiB2aWV3O1xuICB9XG5cbiAgc2V0QWN0aXZlKGVudGVyaW5nVmlldzogUm91dGVWaWV3KTogUHJvbWlzZTxTdGFja0V2ZW50PiB7XG4gICAgbGV0IHsgZGlyZWN0aW9uLCBhbmltYXRpb24gfSA9IHRoaXMubmF2Q3RybC5jb25zdW1lVHJhbnNpdGlvbigpO1xuICAgIGNvbnN0IGxlYXZpbmdWaWV3ID0gdGhpcy5hY3RpdmVWaWV3O1xuICAgIGNvbnN0IHRhYlN3aXRjaCA9IGlzVGFiU3dpdGNoKGVudGVyaW5nVmlldywgbGVhdmluZ1ZpZXcpO1xuICAgIGlmICh0YWJTd2l0Y2gpIHtcbiAgICAgIGRpcmVjdGlvbiA9ICdiYWNrJztcbiAgICAgIGFuaW1hdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCB2aWV3c1NuYXBzaG90ID0gdGhpcy52aWV3cy5zbGljZSgpO1xuXG4gICAgbGV0IGN1cnJlbnROYXZpZ2F0aW9uO1xuXG4gICAgY29uc3Qgcm91dGVyID0gKHRoaXMucm91dGVyIGFzIGFueSk7XG5cbiAgICAvLyBBbmd1bGFyID49IDcuMi4wXG4gICAgaWYgKHJvdXRlci5nZXRDdXJyZW50TmF2aWdhdGlvbikge1xuICAgICAgY3VycmVudE5hdmlnYXRpb24gPSByb3V0ZXIuZ2V0Q3VycmVudE5hdmlnYXRpb24oKTtcblxuICAgICAgLy8gQW5ndWxhciA8IDcuMi4wXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHJvdXRlci5uYXZpZ2F0aW9ucyAmJlxuICAgICAgcm91dGVyLm5hdmlnYXRpb25zLnZhbHVlXG4gICAgKSB7XG4gICAgICBjdXJyZW50TmF2aWdhdGlvbiA9IHJvdXRlci5uYXZpZ2F0aW9ucy52YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgbmF2aWdhdGlvbiBhY3Rpb25cbiAgICAgKiBzZXRzIGByZXBsYWNlVXJsOiB0cnVlYFxuICAgICAqIHRoZW4gd2UgbmVlZCB0byBtYWtlIHN1cmVcbiAgICAgKiB3ZSByZW1vdmUgdGhlIGxhc3QgaXRlbVxuICAgICAqIGZyb20gb3VyIHZpZXdzIHN0YWNrXG4gICAgICovXG4gICAgaWYgKFxuICAgICAgY3VycmVudE5hdmlnYXRpb24gJiZcbiAgICAgIGN1cnJlbnROYXZpZ2F0aW9uLmV4dHJhcyAmJlxuICAgICAgY3VycmVudE5hdmlnYXRpb24uZXh0cmFzLnJlcGxhY2VVcmxcbiAgICApIHtcbiAgICAgIGlmICh0aGlzLnZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy52aWV3cy5zcGxpY2UoLTEsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJldXNlZCA9IHRoaXMudmlld3MuaW5jbHVkZXMoZW50ZXJpbmdWaWV3KTtcbiAgICBjb25zdCB2aWV3cyA9IHRoaXMuaW5zZXJ0VmlldyhlbnRlcmluZ1ZpZXcsIGRpcmVjdGlvbik7XG5cbiAgICAvLyBUcmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gYmVmb3JlIHRyYW5zaXRpb24gc3RhcnRzXG4gICAgLy8gVGhpcyB3aWxsIGNhbGwgbmdPbkluaXQoKSB0aGUgZmlyc3QgdGltZSB0b28sIGp1c3QgYWZ0ZXIgdGhlIHZpZXdcbiAgICAvLyB3YXMgYXR0YWNoZWQgdG8gdGhlIGRvbSwgYnV0IEJFRk9SRSB0aGUgdHJhbnNpdGlvbiBzdGFydHNcbiAgICBpZiAoIXJldXNlZCkge1xuICAgICAgZW50ZXJpbmdWaWV3LnJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCB1bnRpbCBwcmV2aW91cyB0cmFuc2l0aW9ucyBmaW5pc2hcbiAgICByZXR1cm4gdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLndhaXQoKCkgPT4ge1xuICAgICAgICAvLyBkaXNjb25uZWN0IGxlYXZpbmcgcGFnZSBmcm9tIGNoYW5nZSBkZXRlY3Rpb24gdG9cbiAgICAgICAgLy8gcmVkdWNlIGphbmsgZHVyaW5nIHRoZSBwYWdlIHRyYW5zaXRpb25cbiAgICAgICAgaWYgKGxlYXZpbmdWaWV3KSB7XG4gICAgICAgICAgbGVhdmluZ1ZpZXcucmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEluIGNhc2UgdGhlIGVudGVyaW5nVmlldyBpcyB0aGUgc2FtZSBhcyB0aGUgbGVhdmluZ1BhZ2Ugd2UgbmVlZCB0byByZWF0dGFjaCgpXG4gICAgICAgIGVudGVyaW5nVmlldy5yZWYuY2hhbmdlRGV0ZWN0b3JSZWYucmVhdHRhY2goKTtcblxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uKGVudGVyaW5nVmlldywgbGVhdmluZ1ZpZXcsIGFuaW1hdGlvbiwgdGhpcy5jYW5Hb0JhY2soMSksIGZhbHNlKVxuICAgICAgICAgIC50aGVuKCgpID0+IGNsZWFudXBBc3luYyhlbnRlcmluZ1ZpZXcsIHZpZXdzLCB2aWV3c1NuYXBzaG90LCB0aGlzLmxvY2F0aW9uKSlcbiAgICAgICAgICAudGhlbigoKSA9PiAoe1xuICAgICAgICAgICAgZW50ZXJpbmdWaWV3LFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uLFxuICAgICAgICAgICAgdGFiU3dpdGNoXG4gICAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYW5Hb0JhY2soZGVlcDogbnVtYmVyLCBzdGFja0lkID0gdGhpcy5nZXRBY3RpdmVTdGFja0lkKCkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGFjayhzdGFja0lkKS5sZW5ndGggPiBkZWVwO1xuICB9XG5cbiAgcG9wKGRlZXA6IG51bWJlciwgc3RhY2tJZCA9IHRoaXMuZ2V0QWN0aXZlU3RhY2tJZCgpKSB7XG4gICAgcmV0dXJuIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLmdldFN0YWNrKHN0YWNrSWQpO1xuICAgICAgaWYgKHZpZXdzLmxlbmd0aCA8PSBkZWVwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgICAgY29uc3QgdmlldyA9IHZpZXdzW3ZpZXdzLmxlbmd0aCAtIGRlZXAgLSAxXTtcbiAgICAgIGxldCB1cmwgPSB2aWV3LnVybDtcblxuICAgICAgY29uc3Qgdmlld1NhdmVkRGF0YSA9IHZpZXcuc2F2ZWREYXRhO1xuICAgICAgaWYgKHZpZXdTYXZlZERhdGEpIHtcbiAgICAgICAgY29uc3QgcHJpbWFyeU91dGxldCA9IHZpZXdTYXZlZERhdGEuZ2V0KCdwcmltYXJ5Jyk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwcmltYXJ5T3V0bGV0ICYmXG4gICAgICAgICAgcHJpbWFyeU91dGxldC5yb3V0ZSAmJlxuICAgICAgICAgIHByaW1hcnlPdXRsZXQucm91dGUuX3JvdXRlclN0YXRlICYmXG4gICAgICAgICAgcHJpbWFyeU91dGxldC5yb3V0ZS5fcm91dGVyU3RhdGUuc25hcHNob3QgJiZcbiAgICAgICAgICBwcmltYXJ5T3V0bGV0LnJvdXRlLl9yb3V0ZXJTdGF0ZS5zbmFwc2hvdC51cmxcbiAgICAgICAgKSB7XG4gICAgICAgICAgdXJsID0gcHJpbWFyeU91dGxldC5yb3V0ZS5fcm91dGVyU3RhdGUuc25hcHNob3QudXJsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm5hdkN0cmwubmF2aWdhdGVCYWNrKHVybCwgdmlldy5zYXZlZEV4dHJhcykudGhlbigoKSA9PiB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0QmFja1RyYW5zaXRpb24oKSB7XG4gICAgY29uc3QgbGVhdmluZ1ZpZXcgPSB0aGlzLmFjdGl2ZVZpZXc7XG4gICAgaWYgKGxlYXZpbmdWaWV3KSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMuZ2V0U3RhY2sobGVhdmluZ1ZpZXcuc3RhY2tJZCk7XG4gICAgICBjb25zdCBlbnRlcmluZ1ZpZXcgPSB2aWV3c1t2aWV3cy5sZW5ndGggLSAyXTtcbiAgICAgIHJldHVybiB0aGlzLndhaXQoKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uKFxuICAgICAgICAgIGVudGVyaW5nVmlldywgLy8gZW50ZXJpbmcgdmlld1xuICAgICAgICAgIGxlYXZpbmdWaWV3LCAvLyBsZWF2aW5nIHZpZXdcbiAgICAgICAgICAnYmFjaycsXG4gICAgICAgICAgdGhpcy5jYW5Hb0JhY2soMiksXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGVuZEJhY2tUcmFuc2l0aW9uKHNob3VsZENvbXBsZXRlOiBib29sZWFuKSB7XG4gICAgaWYgKHNob3VsZENvbXBsZXRlKSB7XG4gICAgICB0aGlzLnNraXBUcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMucG9wKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmVWaWV3KSB7XG4gICAgICBjbGVhbnVwKHRoaXMuYWN0aXZlVmlldywgdGhpcy52aWV3cywgdGhpcy52aWV3cywgdGhpcy5sb2NhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZ2V0TGFzdFVybChzdGFja0lkPzogc3RyaW5nKSB7XG4gICAgY29uc3Qgdmlld3MgPSB0aGlzLmdldFN0YWNrKHN0YWNrSWQpO1xuICAgIHJldHVybiB2aWV3cy5sZW5ndGggPiAwID8gdmlld3Nbdmlld3MubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRSb290VXJsKHN0YWNrSWQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCB2aWV3cyA9IHRoaXMuZ2V0U3RhY2soc3RhY2tJZCk7XG4gICAgcmV0dXJuIHZpZXdzLmxlbmd0aCA+IDAgPyB2aWV3c1swXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEFjdGl2ZVN0YWNrSWQoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVWaWV3ID8gdGhpcy5hY3RpdmVWaWV3LnN0YWNrSWQgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY29udGFpbmVyRWwgPSB1bmRlZmluZWQhO1xuICAgIHRoaXMudmlld3MuZm9yRWFjaChkZXN0cm95Vmlldyk7XG4gICAgdGhpcy5hY3RpdmVWaWV3ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U3RhY2soc3RhY2tJZDogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRoaXMudmlld3MuZmlsdGVyKHYgPT4gdi5zdGFja0lkID09PSBzdGFja0lkKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0VmlldyhlbnRlcmluZ1ZpZXc6IFJvdXRlVmlldywgZGlyZWN0aW9uOiBSb3V0ZXJEaXJlY3Rpb24pIHtcbiAgICB0aGlzLmFjdGl2ZVZpZXcgPSBlbnRlcmluZ1ZpZXc7XG4gICAgdGhpcy52aWV3cyA9IGluc2VydFZpZXcodGhpcy52aWV3cywgZW50ZXJpbmdWaWV3LCBkaXJlY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLnZpZXdzLnNsaWNlKCk7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zaXRpb24oXG4gICAgZW50ZXJpbmdWaWV3OiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQsXG4gICAgbGVhdmluZ1ZpZXc6IFJvdXRlVmlldyB8IHVuZGVmaW5lZCxcbiAgICBkaXJlY3Rpb246ICdmb3J3YXJkJyB8ICdiYWNrJyB8IHVuZGVmaW5lZCxcbiAgICBzaG93R29CYWNrOiBib29sZWFuLFxuICAgIHByb2dyZXNzQW5pbWF0aW9uOiBib29sZWFuXG4gICkge1xuICAgIGlmICh0aGlzLnNraXBUcmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLnNraXBUcmFuc2l0aW9uID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKGxlYXZpbmdWaWV3ID09PSBlbnRlcmluZ1ZpZXcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICAgIH1cbiAgICBjb25zdCBlbnRlcmluZ0VsID0gZW50ZXJpbmdWaWV3ID8gZW50ZXJpbmdWaWV3LmVsZW1lbnQgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgbGVhdmluZ0VsID0gbGVhdmluZ1ZpZXcgPyBsZWF2aW5nVmlldy5lbGVtZW50IDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRhaW5lckVsID0gdGhpcy5jb250YWluZXJFbDtcbiAgICBpZiAoZW50ZXJpbmdFbCAmJiBlbnRlcmluZ0VsICE9PSBsZWF2aW5nRWwpIHtcbiAgICAgIGVudGVyaW5nRWwuY2xhc3NMaXN0LmFkZCgnaW9uLXBhZ2UnKTtcbiAgICAgIGVudGVyaW5nRWwuY2xhc3NMaXN0LmFkZCgnaW9uLXBhZ2UtaW52aXNpYmxlJyk7XG4gICAgICBpZiAoZW50ZXJpbmdFbC5wYXJlbnRFbGVtZW50ICE9PSBjb250YWluZXJFbCkge1xuICAgICAgICBjb250YWluZXJFbC5hcHBlbmRDaGlsZChlbnRlcmluZ0VsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChjb250YWluZXJFbCBhcyBhbnkpLmNvbW1pdCkge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyRWwuY29tbWl0KGVudGVyaW5nRWwsIGxlYXZpbmdFbCwge1xuICAgICAgICAgIGRlZXBXYWl0OiB0cnVlLFxuICAgICAgICAgIGR1cmF0aW9uOiBkaXJlY3Rpb24gPT09IHVuZGVmaW5lZCA/IDAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgIHNob3dHb0JhY2ssXG4gICAgICAgICAgcHJvZ3Jlc3NBbmltYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB3YWl0PFQ+KHRhc2s6ICgpID0+IFByb21pc2U8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBpZiAodGhpcy5ydW5uaW5nVGFzayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhd2FpdCB0aGlzLnJ1bm5pbmdUYXNrO1xuICAgICAgdGhpcy5ydW5uaW5nVGFzayA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgcHJvbWlzZSA9IHRoaXMucnVubmluZ1Rhc2sgPSB0YXNrKCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cblxuY29uc3QgY2xlYW51cEFzeW5jID0gKGFjdGl2ZVJvdXRlOiBSb3V0ZVZpZXcsIHZpZXdzOiBSb3V0ZVZpZXdbXSwgdmlld3NTbmFwc2hvdDogUm91dGVWaWV3W10sIGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICBpZiAodHlwZW9mIChyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYXMgYW55KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KHJlc29sdmUgPT4ge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY2xlYW51cChhY3RpdmVSb3V0ZSwgdmlld3MsIHZpZXdzU25hcHNob3QsIGxvY2F0aW9uKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcblxuY29uc3QgY2xlYW51cCA9IChhY3RpdmVSb3V0ZTogUm91dGVWaWV3LCB2aWV3czogUm91dGVWaWV3W10sIHZpZXdzU25hcHNob3Q6IFJvdXRlVmlld1tdLCBsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgdmlld3NTbmFwc2hvdFxuICAgIC5maWx0ZXIodmlldyA9PiAhdmlld3MuaW5jbHVkZXModmlldykpXG4gICAgLmZvckVhY2goZGVzdHJveVZpZXcpO1xuXG4gIHZpZXdzLmZvckVhY2godmlldyA9PiB7XG4gICAgLyoqXG4gICAgICogSW4gdGhlIGV2ZW50IHRoYXQgYSB1c2VyIG5hdmlnYXRlZCBtdWx0aXBsZVxuICAgICAqIHRpbWVzIGluIHJhcGlkIHN1Y2Nlc3Npb24sIHdlIHdhbnQgdG8gbWFrZSBzdXJlXG4gICAgICogd2UgZG9uJ3QgcHJlLWVtcHRpdmVseSBkZXRhY2ggYSB2aWV3IHdoaWxlXG4gICAgICogaXQgaXMgaW4gbWlkLXRyYW5zaXRpb24uXG4gICAgICpcbiAgICAgKiBJbiB0aGlzIGluc3RhbmNlIHdlIGFsc28gZG8gbm90IGNhcmUgYWJvdXQgcXVlcnlcbiAgICAgKiBwYXJhbXMgb3IgZnJhZ21lbnRzIGFzIGl0IHdpbGwgYmUgdGhlIHNhbWUgdmlldyByZWdhcmRsZXNzXG4gICAgICovXG4gICAgY29uc3QgbG9jYXRpb25XaXRob3V0UGFyYW1zID0gbG9jYXRpb24ucGF0aCgpLnNwbGl0KCc/JylbMF07XG4gICAgY29uc3QgbG9jYXRpb25XaXRob3V0RnJhZ21lbnQgPSBsb2NhdGlvbldpdGhvdXRQYXJhbXMuc3BsaXQoJyMnKVswXTtcblxuICAgIGlmICh2aWV3ICE9PSBhY3RpdmVSb3V0ZSAmJiB2aWV3LnVybCAhPT0gbG9jYXRpb25XaXRob3V0RnJhZ21lbnQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB2aWV3LmVsZW1lbnQ7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpb24tcGFnZS1oaWRkZW4nKTtcbiAgICAgIHZpZXcucmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGFjaCgpO1xuICAgIH1cbiAgfSk7XG59O1xuIl19