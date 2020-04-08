import * as tslib_1 from "tslib";
import { bindLifecycleEvents } from '../../providers/angular-delegate';
import { computeStackId, destroyView, getUrl, insertView, isTabSwitch, toSegments } from './stack-utils';
var StackController = /** @class */ (function () {
    function StackController(tabsPrefix, containerEl, router, navCtrl, zone, location) {
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
    StackController.prototype.createView = function (ref, activatedRoute) {
        var url = getUrl(this.router, activatedRoute);
        var element = (ref && ref.location && ref.location.nativeElement);
        var unlistenEvents = bindLifecycleEvents(this.zone, ref.instance, element);
        return {
            id: this.nextId++,
            stackId: computeStackId(this.tabsPrefix, url),
            unlistenEvents: unlistenEvents,
            element: element,
            ref: ref,
            url: url,
        };
    };
    StackController.prototype.getExistingView = function (activatedRoute) {
        var activatedUrlKey = getUrl(this.router, activatedRoute);
        var view = this.views.find(function (vw) { return vw.url === activatedUrlKey; });
        if (view) {
            view.ref.changeDetectorRef.reattach();
        }
        return view;
    };
    StackController.prototype.setActive = function (enteringView) {
        var _this = this;
        var _a = this.navCtrl.consumeTransition(), direction = _a.direction, animation = _a.animation;
        var leavingView = this.activeView;
        var tabSwitch = isTabSwitch(enteringView, leavingView);
        if (tabSwitch) {
            direction = 'back';
            animation = undefined;
        }
        var viewsSnapshot = this.views.slice();
        var currentNavigation;
        var router = this.router;
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
        var reused = this.views.includes(enteringView);
        var views = this.insertView(enteringView, direction);
        // Trigger change detection before transition starts
        // This will call ngOnInit() the first time too, just after the view
        // was attached to the dom, but BEFORE the transition starts
        if (!reused) {
            enteringView.ref.changeDetectorRef.detectChanges();
        }
        // Wait until previous transitions finish
        return this.zone.runOutsideAngular(function () {
            return _this.wait(function () {
                // disconnect leaving page from change detection to
                // reduce jank during the page transition
                if (leavingView) {
                    leavingView.ref.changeDetectorRef.detach();
                }
                // In case the enteringView is the same as the leavingPage we need to reattach()
                enteringView.ref.changeDetectorRef.reattach();
                return _this.transition(enteringView, leavingView, animation, _this.canGoBack(1), false)
                    .then(function () { return cleanupAsync(enteringView, views, viewsSnapshot, _this.location); })
                    .then(function () { return ({
                    enteringView: enteringView,
                    direction: direction,
                    animation: animation,
                    tabSwitch: tabSwitch
                }); });
            });
        });
    };
    StackController.prototype.canGoBack = function (deep, stackId) {
        if (stackId === void 0) { stackId = this.getActiveStackId(); }
        return this.getStack(stackId).length > deep;
    };
    StackController.prototype.pop = function (deep, stackId) {
        var _this = this;
        if (stackId === void 0) { stackId = this.getActiveStackId(); }
        return this.zone.run(function () {
            var views = _this.getStack(stackId);
            if (views.length <= deep) {
                return Promise.resolve(false);
            }
            var view = views[views.length - deep - 1];
            var url = view.url;
            var viewSavedData = view.savedData;
            if (viewSavedData) {
                var primaryOutlet = viewSavedData.get('primary');
                if (primaryOutlet &&
                    primaryOutlet.route &&
                    primaryOutlet.route._routerState &&
                    primaryOutlet.route._routerState.snapshot &&
                    primaryOutlet.route._routerState.snapshot.url) {
                    url = primaryOutlet.route._routerState.snapshot.url;
                }
            }
            return _this.navCtrl.navigateBack(url, view.savedExtras).then(function () { return true; });
        });
    };
    StackController.prototype.startBackTransition = function () {
        var _this = this;
        var leavingView = this.activeView;
        if (leavingView) {
            var views = this.getStack(leavingView.stackId);
            var enteringView_1 = views[views.length - 2];
            return this.wait(function () {
                return _this.transition(enteringView_1, // entering view
                leavingView, // leaving view
                'back', _this.canGoBack(2), true);
            });
        }
        return Promise.resolve();
    };
    StackController.prototype.endBackTransition = function (shouldComplete) {
        if (shouldComplete) {
            this.skipTransition = true;
            this.pop(1);
        }
        else if (this.activeView) {
            cleanup(this.activeView, this.views, this.views, this.location);
        }
    };
    StackController.prototype.getLastUrl = function (stackId) {
        var views = this.getStack(stackId);
        return views.length > 0 ? views[views.length - 1] : undefined;
    };
    /**
     * @internal
     */
    StackController.prototype.getRootUrl = function (stackId) {
        var views = this.getStack(stackId);
        return views.length > 0 ? views[0] : undefined;
    };
    StackController.prototype.getActiveStackId = function () {
        return this.activeView ? this.activeView.stackId : undefined;
    };
    StackController.prototype.destroy = function () {
        this.containerEl = undefined;
        this.views.forEach(destroyView);
        this.activeView = undefined;
        this.views = [];
    };
    StackController.prototype.getStack = function (stackId) {
        return this.views.filter(function (v) { return v.stackId === stackId; });
    };
    StackController.prototype.insertView = function (enteringView, direction) {
        this.activeView = enteringView;
        this.views = insertView(this.views, enteringView, direction);
        return this.views.slice();
    };
    StackController.prototype.transition = function (enteringView, leavingView, direction, showGoBack, progressAnimation) {
        if (this.skipTransition) {
            this.skipTransition = false;
            return Promise.resolve(false);
        }
        if (leavingView === enteringView) {
            return Promise.resolve(false);
        }
        var enteringEl = enteringView ? enteringView.element : undefined;
        var leavingEl = leavingView ? leavingView.element : undefined;
        var containerEl = this.containerEl;
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
                    direction: direction,
                    showGoBack: showGoBack,
                    progressAnimation: progressAnimation
                });
            }
        }
        return Promise.resolve(false);
    };
    StackController.prototype.wait = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promise;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.runningTask !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.runningTask];
                    case 1:
                        _a.sent();
                        this.runningTask = undefined;
                        _a.label = 2;
                    case 2:
                        promise = this.runningTask = task();
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    return StackController;
}());
export { StackController };
var cleanupAsync = function (activeRoute, views, viewsSnapshot, location) {
    if (typeof requestAnimationFrame === 'function') {
        return new Promise(function (resolve) {
            requestAnimationFrame(function () {
                cleanup(activeRoute, views, viewsSnapshot, location);
                resolve();
            });
        });
    }
    return Promise.resolve();
};
var ɵ0 = cleanupAsync;
var cleanup = function (activeRoute, views, viewsSnapshot, location) {
    viewsSnapshot
        .filter(function (view) { return !views.includes(view); })
        .forEach(destroyView);
    views.forEach(function (view) {
        /**
         * In the event that a user navigated multiple
         * times in rapid succession, we want to make sure
         * we don't pre-emptively detach a view while
         * it is in mid-transition.
         *
         * In this instance we also do not care about query
         * params or fragments as it will be the same view regardless
         */
        var locationWithoutParams = location.path().split('?')[0];
        var locationWithoutFragment = locationWithoutParams.split('#')[0];
        if (view !== activeRoute && view.url !== locationWithoutFragment) {
            var element = view.element;
            element.setAttribute('aria-hidden', 'true');
            element.classList.add('ion-page-hidden');
            view.ref.changeDetectorRef.detach();
        }
    });
};
var ɵ1 = cleanup;
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL3N0YWNrLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUtBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR3ZFLE9BQU8sRUFBeUIsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEk7SUFTRSx5QkFDRSxVQUE4QixFQUN0QixXQUF1QyxFQUN2QyxNQUFjLEVBQ2QsT0FBc0IsRUFDdEIsSUFBWSxFQUNaLFFBQWtCO1FBSmxCLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtRQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWJwQixVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUV4QixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUd2QixXQUFNLEdBQUcsQ0FBQyxDQUFDO1FBVWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDbEYsQ0FBQztJQUVELG9DQUFVLEdBQVYsVUFBVyxHQUFzQixFQUFFLGNBQThCO1FBQy9ELElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2hELElBQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQWdCLENBQUM7UUFDbkYsSUFB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QUMsQ0FBQztRQUM1RCxJQUFNLHVCQUF1QixHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRSxJQUFJLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyx1QkFBdUIsRUFBRTtZQUNoRSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ29tcG9uZW50UmVmLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUm91dGVyRGlyZWN0aW9uIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuXG5pbXBvcnQgeyBiaW5kTGlmZWN5Y2xlRXZlbnRzIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL2FuZ3VsYXItZGVsZWdhdGUnO1xuaW1wb3J0IHsgTmF2Q29udHJvbGxlciB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9uYXYtY29udHJvbGxlcic7XG5cbmltcG9ydCB7IFJvdXRlVmlldywgU3RhY2tFdmVudCwgY29tcHV0ZVN0YWNrSWQsIGRlc3Ryb3lWaWV3LCBnZXRVcmwsIGluc2VydFZpZXcsIGlzVGFiU3dpdGNoLCB0b1NlZ21lbnRzIH0gZnJvbSAnLi9zdGFjay11dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBTdGFja0NvbnRyb2xsZXIge1xuXG4gIHByaXZhdGUgdmlld3M6IFJvdXRlVmlld1tdID0gW107XG4gIHByaXZhdGUgcnVubmluZ1Rhc2s/OiBQcm9taXNlPGFueT47XG4gIHByaXZhdGUgc2tpcFRyYW5zaXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0YWJzUHJlZml4OiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBhY3RpdmVWaWV3OiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgbmV4dElkID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0YWJzUHJlZml4OiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgcHJpdmF0ZSBjb250YWluZXJFbDogSFRNTElvblJvdXRlck91dGxldEVsZW1lbnQsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIG5hdkN0cmw6IE5hdkNvbnRyb2xsZXIsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb25cbiAgKSB7XG4gICAgdGhpcy50YWJzUHJlZml4ID0gdGFic1ByZWZpeCAhPT0gdW5kZWZpbmVkID8gdG9TZWdtZW50cyh0YWJzUHJlZml4KSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNyZWF0ZVZpZXcocmVmOiBDb21wb25lbnRSZWY8YW55PiwgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKTogUm91dGVWaWV3IHtcbiAgICBjb25zdCB1cmwgPSBnZXRVcmwodGhpcy5yb3V0ZXIsIGFjdGl2YXRlZFJvdXRlKTtcbiAgICBjb25zdCBlbGVtZW50ID0gKHJlZiAmJiByZWYubG9jYXRpb24gJiYgcmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IHVubGlzdGVuRXZlbnRzID0gYmluZExpZmVjeWNsZUV2ZW50cyh0aGlzLnpvbmUsIHJlZi5pbnN0YW5jZSwgZWxlbWVudCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLm5leHRJZCsrLFxuICAgICAgc3RhY2tJZDogY29tcHV0ZVN0YWNrSWQodGhpcy50YWJzUHJlZml4LCB1cmwpLFxuICAgICAgdW5saXN0ZW5FdmVudHMsXG4gICAgICBlbGVtZW50LFxuICAgICAgcmVmLFxuICAgICAgdXJsLFxuICAgIH07XG4gIH1cblxuICBnZXRFeGlzdGluZ1ZpZXcoYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKTogUm91dGVWaWV3IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBhY3RpdmF0ZWRVcmxLZXkgPSBnZXRVcmwodGhpcy5yb3V0ZXIsIGFjdGl2YXRlZFJvdXRlKTtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy52aWV3cy5maW5kKHZ3ID0+IHZ3LnVybCA9PT0gYWN0aXZhdGVkVXJsS2V5KTtcbiAgICBpZiAodmlldykge1xuICAgICAgdmlldy5yZWYuY2hhbmdlRGV0ZWN0b3JSZWYucmVhdHRhY2goKTtcbiAgICB9XG4gICAgcmV0dXJuIHZpZXc7XG4gIH1cblxuICBzZXRBY3RpdmUoZW50ZXJpbmdWaWV3OiBSb3V0ZVZpZXcpOiBQcm9taXNlPFN0YWNrRXZlbnQ+IHtcbiAgICBsZXQgeyBkaXJlY3Rpb24sIGFuaW1hdGlvbiB9ID0gdGhpcy5uYXZDdHJsLmNvbnN1bWVUcmFuc2l0aW9uKCk7XG4gICAgY29uc3QgbGVhdmluZ1ZpZXcgPSB0aGlzLmFjdGl2ZVZpZXc7XG4gICAgY29uc3QgdGFiU3dpdGNoID0gaXNUYWJTd2l0Y2goZW50ZXJpbmdWaWV3LCBsZWF2aW5nVmlldyk7XG4gICAgaWYgKHRhYlN3aXRjaCkge1xuICAgICAgZGlyZWN0aW9uID0gJ2JhY2snO1xuICAgICAgYW5pbWF0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHZpZXdzU25hcHNob3QgPSB0aGlzLnZpZXdzLnNsaWNlKCk7XG5cbiAgICBsZXQgY3VycmVudE5hdmlnYXRpb247XG5cbiAgICBjb25zdCByb3V0ZXIgPSAodGhpcy5yb3V0ZXIgYXMgYW55KTtcblxuICAgIC8vIEFuZ3VsYXIgPj0gNy4yLjBcbiAgICBpZiAocm91dGVyLmdldEN1cnJlbnROYXZpZ2F0aW9uKSB7XG4gICAgICBjdXJyZW50TmF2aWdhdGlvbiA9IHJvdXRlci5nZXRDdXJyZW50TmF2aWdhdGlvbigpO1xuXG4gICAgICAvLyBBbmd1bGFyIDwgNy4yLjBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcm91dGVyLm5hdmlnYXRpb25zICYmXG4gICAgICByb3V0ZXIubmF2aWdhdGlvbnMudmFsdWVcbiAgICApIHtcbiAgICAgIGN1cnJlbnROYXZpZ2F0aW9uID0gcm91dGVyLm5hdmlnYXRpb25zLnZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBuYXZpZ2F0aW9uIGFjdGlvblxuICAgICAqIHNldHMgYHJlcGxhY2VVcmw6IHRydWVgXG4gICAgICogdGhlbiB3ZSBuZWVkIHRvIG1ha2Ugc3VyZVxuICAgICAqIHdlIHJlbW92ZSB0aGUgbGFzdCBpdGVtXG4gICAgICogZnJvbSBvdXIgdmlld3Mgc3RhY2tcbiAgICAgKi9cbiAgICBpZiAoXG4gICAgICBjdXJyZW50TmF2aWdhdGlvbiAmJlxuICAgICAgY3VycmVudE5hdmlnYXRpb24uZXh0cmFzICYmXG4gICAgICBjdXJyZW50TmF2aWdhdGlvbi5leHRyYXMucmVwbGFjZVVybFxuICAgICkge1xuICAgICAgaWYgKHRoaXMudmlld3MubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnZpZXdzLnNwbGljZSgtMSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmV1c2VkID0gdGhpcy52aWV3cy5pbmNsdWRlcyhlbnRlcmluZ1ZpZXcpO1xuICAgIGNvbnN0IHZpZXdzID0gdGhpcy5pbnNlcnRWaWV3KGVudGVyaW5nVmlldywgZGlyZWN0aW9uKTtcblxuICAgIC8vIFRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBiZWZvcmUgdHJhbnNpdGlvbiBzdGFydHNcbiAgICAvLyBUaGlzIHdpbGwgY2FsbCBuZ09uSW5pdCgpIHRoZSBmaXJzdCB0aW1lIHRvbywganVzdCBhZnRlciB0aGUgdmlld1xuICAgIC8vIHdhcyBhdHRhY2hlZCB0byB0aGUgZG9tLCBidXQgQkVGT1JFIHRoZSB0cmFuc2l0aW9uIHN0YXJ0c1xuICAgIGlmICghcmV1c2VkKSB7XG4gICAgICBlbnRlcmluZ1ZpZXcucmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHVudGlsIHByZXZpb3VzIHRyYW5zaXRpb25zIGZpbmlzaFxuICAgIHJldHVybiB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMud2FpdCgoKSA9PiB7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgbGVhdmluZyBwYWdlIGZyb20gY2hhbmdlIGRldGVjdGlvbiB0b1xuICAgICAgICAvLyByZWR1Y2UgamFuayBkdXJpbmcgdGhlIHBhZ2UgdHJhbnNpdGlvblxuICAgICAgICBpZiAobGVhdmluZ1ZpZXcpIHtcbiAgICAgICAgICBsZWF2aW5nVmlldy5yZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgZW50ZXJpbmdWaWV3IGlzIHRoZSBzYW1lIGFzIHRoZSBsZWF2aW5nUGFnZSB3ZSBuZWVkIHRvIHJlYXR0YWNoKClcbiAgICAgICAgZW50ZXJpbmdWaWV3LnJlZi5jaGFuZ2VEZXRlY3RvclJlZi5yZWF0dGFjaCgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24oZW50ZXJpbmdWaWV3LCBsZWF2aW5nVmlldywgYW5pbWF0aW9uLCB0aGlzLmNhbkdvQmFjaygxKSwgZmFsc2UpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gY2xlYW51cEFzeW5jKGVudGVyaW5nVmlldywgdmlld3MsIHZpZXdzU25hcHNob3QsIHRoaXMubG9jYXRpb24pKVxuICAgICAgICAgIC50aGVuKCgpID0+ICh7XG4gICAgICAgICAgICBlbnRlcmluZ1ZpZXcsXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICBhbmltYXRpb24sXG4gICAgICAgICAgICB0YWJTd2l0Y2hcbiAgICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNhbkdvQmFjayhkZWVwOiBudW1iZXIsIHN0YWNrSWQgPSB0aGlzLmdldEFjdGl2ZVN0YWNrSWQoKSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldFN0YWNrKHN0YWNrSWQpLmxlbmd0aCA+IGRlZXA7XG4gIH1cblxuICBwb3AoZGVlcDogbnVtYmVyLCBzdGFja0lkID0gdGhpcy5nZXRBY3RpdmVTdGFja0lkKCkpIHtcbiAgICByZXR1cm4gdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMuZ2V0U3RhY2soc3RhY2tJZCk7XG4gICAgICBpZiAodmlld3MubGVuZ3RoIDw9IGRlZXApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgICB9XG4gICAgICBjb25zdCB2aWV3ID0gdmlld3Nbdmlld3MubGVuZ3RoIC0gZGVlcCAtIDFdO1xuICAgICAgbGV0IHVybCA9IHZpZXcudXJsO1xuXG4gICAgICBjb25zdCB2aWV3U2F2ZWREYXRhID0gdmlldy5zYXZlZERhdGE7XG4gICAgICBpZiAodmlld1NhdmVkRGF0YSkge1xuICAgICAgICBjb25zdCBwcmltYXJ5T3V0bGV0ID0gdmlld1NhdmVkRGF0YS5nZXQoJ3ByaW1hcnknKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByaW1hcnlPdXRsZXQgJiZcbiAgICAgICAgICBwcmltYXJ5T3V0bGV0LnJvdXRlICYmXG4gICAgICAgICAgcHJpbWFyeU91dGxldC5yb3V0ZS5fcm91dGVyU3RhdGUgJiZcbiAgICAgICAgICBwcmltYXJ5T3V0bGV0LnJvdXRlLl9yb3V0ZXJTdGF0ZS5zbmFwc2hvdCAmJlxuICAgICAgICAgIHByaW1hcnlPdXRsZXQucm91dGUuX3JvdXRlclN0YXRlLnNuYXBzaG90LnVybFxuICAgICAgICApIHtcbiAgICAgICAgICB1cmwgPSBwcmltYXJ5T3V0bGV0LnJvdXRlLl9yb3V0ZXJTdGF0ZS5zbmFwc2hvdC51cmw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMubmF2Q3RybC5uYXZpZ2F0ZUJhY2sodXJsLCB2aWV3LnNhdmVkRXh0cmFzKS50aGVuKCgpID0+IHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnRCYWNrVHJhbnNpdGlvbigpIHtcbiAgICBjb25zdCBsZWF2aW5nVmlldyA9IHRoaXMuYWN0aXZlVmlldztcbiAgICBpZiAobGVhdmluZ1ZpZXcpIHtcbiAgICAgIGNvbnN0IHZpZXdzID0gdGhpcy5nZXRTdGFjayhsZWF2aW5nVmlldy5zdGFja0lkKTtcbiAgICAgIGNvbnN0IGVudGVyaW5nVmlldyA9IHZpZXdzW3ZpZXdzLmxlbmd0aCAtIDJdO1xuICAgICAgcmV0dXJuIHRoaXMud2FpdCgoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24oXG4gICAgICAgICAgZW50ZXJpbmdWaWV3LCAvLyBlbnRlcmluZyB2aWV3XG4gICAgICAgICAgbGVhdmluZ1ZpZXcsIC8vIGxlYXZpbmcgdmlld1xuICAgICAgICAgICdiYWNrJyxcbiAgICAgICAgICB0aGlzLmNhbkdvQmFjaygyKSxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgZW5kQmFja1RyYW5zaXRpb24oc2hvdWxkQ29tcGxldGU6IGJvb2xlYW4pIHtcbiAgICBpZiAoc2hvdWxkQ29tcGxldGUpIHtcbiAgICAgIHRoaXMuc2tpcFRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5wb3AoMSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjdGl2ZVZpZXcpIHtcbiAgICAgIGNsZWFudXAodGhpcy5hY3RpdmVWaWV3LCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdzLCB0aGlzLmxvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBnZXRMYXN0VXJsKHN0YWNrSWQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCB2aWV3cyA9IHRoaXMuZ2V0U3RhY2soc3RhY2tJZCk7XG4gICAgcmV0dXJuIHZpZXdzLmxlbmd0aCA+IDAgPyB2aWV3c1t2aWV3cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdldFJvb3RVcmwoc3RhY2tJZD86IHN0cmluZykge1xuICAgIGNvbnN0IHZpZXdzID0gdGhpcy5nZXRTdGFjayhzdGFja0lkKTtcbiAgICByZXR1cm4gdmlld3MubGVuZ3RoID4gMCA/IHZpZXdzWzBdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0QWN0aXZlU3RhY2tJZCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVZpZXcgPyB0aGlzLmFjdGl2ZVZpZXcuc3RhY2tJZCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jb250YWluZXJFbCA9IHVuZGVmaW5lZCE7XG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKGRlc3Ryb3lWaWV3KTtcbiAgICB0aGlzLmFjdGl2ZVZpZXcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdGFjayhzdGFja0lkOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3cy5maWx0ZXIodiA9PiB2LnN0YWNrSWQgPT09IHN0YWNrSWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnNlcnRWaWV3KGVudGVyaW5nVmlldzogUm91dGVWaWV3LCBkaXJlY3Rpb246IFJvdXRlckRpcmVjdGlvbikge1xuICAgIHRoaXMuYWN0aXZlVmlldyA9IGVudGVyaW5nVmlldztcbiAgICB0aGlzLnZpZXdzID0gaW5zZXJ0Vmlldyh0aGlzLnZpZXdzLCBlbnRlcmluZ1ZpZXcsIGRpcmVjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMudmlld3Muc2xpY2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNpdGlvbihcbiAgICBlbnRlcmluZ1ZpZXc6IFJvdXRlVmlldyB8IHVuZGVmaW5lZCxcbiAgICBsZWF2aW5nVmlldzogUm91dGVWaWV3IHwgdW5kZWZpbmVkLFxuICAgIGRpcmVjdGlvbjogJ2ZvcndhcmQnIHwgJ2JhY2snIHwgdW5kZWZpbmVkLFxuICAgIHNob3dHb0JhY2s6IGJvb2xlYW4sXG4gICAgcHJvZ3Jlc3NBbmltYXRpb246IGJvb2xlYW5cbiAgKSB7XG4gICAgaWYgKHRoaXMuc2tpcFRyYW5zaXRpb24pIHtcbiAgICAgIHRoaXMuc2tpcFRyYW5zaXRpb24gPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICAgIH1cbiAgICBpZiAobGVhdmluZ1ZpZXcgPT09IGVudGVyaW5nVmlldykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuICAgIGNvbnN0IGVudGVyaW5nRWwgPSBlbnRlcmluZ1ZpZXcgPyBlbnRlcmluZ1ZpZXcuZWxlbWVudCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBsZWF2aW5nRWwgPSBsZWF2aW5nVmlldyA/IGxlYXZpbmdWaWV3LmVsZW1lbnQgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLmNvbnRhaW5lckVsO1xuICAgIGlmIChlbnRlcmluZ0VsICYmIGVudGVyaW5nRWwgIT09IGxlYXZpbmdFbCkge1xuICAgICAgZW50ZXJpbmdFbC5jbGFzc0xpc3QuYWRkKCdpb24tcGFnZScpO1xuICAgICAgZW50ZXJpbmdFbC5jbGFzc0xpc3QuYWRkKCdpb24tcGFnZS1pbnZpc2libGUnKTtcbiAgICAgIGlmIChlbnRlcmluZ0VsLnBhcmVudEVsZW1lbnQgIT09IGNvbnRhaW5lckVsKSB7XG4gICAgICAgIGNvbnRhaW5lckVsLmFwcGVuZENoaWxkKGVudGVyaW5nRWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGNvbnRhaW5lckVsIGFzIGFueSkuY29tbWl0KSB7XG4gICAgICAgIHJldHVybiBjb250YWluZXJFbC5jb21taXQoZW50ZXJpbmdFbCwgbGVhdmluZ0VsLCB7XG4gICAgICAgICAgZGVlcFdhaXQ6IHRydWUsXG4gICAgICAgICAgZHVyYXRpb246IGRpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gMCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgc2hvd0dvQmFjayxcbiAgICAgICAgICBwcm9ncmVzc0FuaW1hdGlvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHdhaXQ8VD4odGFzazogKCkgPT4gUHJvbWlzZTxUPik6IFByb21pc2U8VD4ge1xuICAgIGlmICh0aGlzLnJ1bm5pbmdUYXNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMucnVubmluZ1Rhc2s7XG4gICAgICB0aGlzLnJ1bm5pbmdUYXNrID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBwcm9taXNlID0gdGhpcy5ydW5uaW5nVGFzayA9IHRhc2soKTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuXG5jb25zdCBjbGVhbnVwQXN5bmMgPSAoYWN0aXZlUm91dGU6IFJvdXRlVmlldywgdmlld3M6IFJvdXRlVmlld1tdLCB2aWV3c1NuYXBzaG90OiBSb3V0ZVZpZXdbXSwgbG9jYXRpb246IExvY2F0aW9uKSA9PiB7XG4gIGlmICh0eXBlb2YgKHJlcXVlc3RBbmltYXRpb25GcmFtZSBhcyBhbnkpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4ocmVzb2x2ZSA9PiB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjbGVhbnVwKGFjdGl2ZVJvdXRlLCB2aWV3cywgdmlld3NTbmFwc2hvdCwgbG9jYXRpb24pO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59O1xuXG5jb25zdCBjbGVhbnVwID0gKGFjdGl2ZVJvdXRlOiBSb3V0ZVZpZXcsIHZpZXdzOiBSb3V0ZVZpZXdbXSwgdmlld3NTbmFwc2hvdDogUm91dGVWaWV3W10sIGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICB2aWV3c1NuYXBzaG90XG4gICAgLmZpbHRlcih2aWV3ID0+ICF2aWV3cy5pbmNsdWRlcyh2aWV3KSlcbiAgICAuZm9yRWFjaChkZXN0cm95Vmlldyk7XG5cbiAgdmlld3MuZm9yRWFjaCh2aWV3ID0+IHtcbiAgICAvKipcbiAgICAgKiBJbiB0aGUgZXZlbnQgdGhhdCBhIHVzZXIgbmF2aWdhdGVkIG11bHRpcGxlXG4gICAgICogdGltZXMgaW4gcmFwaWQgc3VjY2Vzc2lvbiwgd2Ugd2FudCB0byBtYWtlIHN1cmVcbiAgICAgKiB3ZSBkb24ndCBwcmUtZW1wdGl2ZWx5IGRldGFjaCBhIHZpZXcgd2hpbGVcbiAgICAgKiBpdCBpcyBpbiBtaWQtdHJhbnNpdGlvbi5cbiAgICAgKlxuICAgICAqIEluIHRoaXMgaW5zdGFuY2Ugd2UgYWxzbyBkbyBub3QgY2FyZSBhYm91dCBxdWVyeVxuICAgICAqIHBhcmFtcyBvciBmcmFnbWVudHMgYXMgaXQgd2lsbCBiZSB0aGUgc2FtZSB2aWV3IHJlZ2FyZGxlc3NcbiAgICAgKi9cbiAgICBjb25zdCBsb2NhdGlvbldpdGhvdXRQYXJhbXMgPSBsb2NhdGlvbi5wYXRoKCkuc3BsaXQoJz8nKVswXTtcbiAgICBjb25zdCBsb2NhdGlvbldpdGhvdXRGcmFnbWVudCA9IGxvY2F0aW9uV2l0aG91dFBhcmFtcy5zcGxpdCgnIycpWzBdO1xuXG4gICAgaWYgKHZpZXcgIT09IGFjdGl2ZVJvdXRlICYmIHZpZXcudXJsICE9PSBsb2NhdGlvbldpdGhvdXRGcmFnbWVudCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHZpZXcuZWxlbWVudDtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lvbi1wYWdlLWhpZGRlbicpO1xuICAgICAgdmlldy5yZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0YWNoKCk7XG4gICAgfVxuICB9KTtcbn07XG4iXX0=