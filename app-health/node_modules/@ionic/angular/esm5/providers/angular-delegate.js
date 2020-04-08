import * as tslib_1 from "tslib";
import { ApplicationRef, ComponentFactoryResolver, Injectable, InjectionToken, Injector, NgZone, ViewContainerRef } from '@angular/core';
import { LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE, LIFECYCLE_WILL_UNLOAD } from '@ionic/core';
import { NavParams } from '../directives/navigation/nav-params';
var AngularDelegate = /** @class */ (function () {
    function AngularDelegate(zone, appRef) {
        this.zone = zone;
        this.appRef = appRef;
    }
    AngularDelegate.prototype.create = function (resolver, injector, location) {
        return new AngularFrameworkDelegate(resolver, injector, location, this.appRef, this.zone);
    };
    AngularDelegate.ctorParameters = function () { return [
        { type: NgZone },
        { type: ApplicationRef }
    ]; };
    AngularDelegate = tslib_1.__decorate([
        Injectable()
    ], AngularDelegate);
    return AngularDelegate;
}());
export { AngularDelegate };
var AngularFrameworkDelegate = /** @class */ (function () {
    function AngularFrameworkDelegate(resolver, injector, location, appRef, zone) {
        this.resolver = resolver;
        this.injector = injector;
        this.location = location;
        this.appRef = appRef;
        this.zone = zone;
        this.elRefMap = new WeakMap();
        this.elEventsMap = new WeakMap();
    }
    AngularFrameworkDelegate.prototype.attachViewToDom = function (container, component, params, cssClasses) {
        var _this = this;
        return this.zone.run(function () {
            return new Promise(function (resolve) {
                var el = attachView(_this.zone, _this.resolver, _this.injector, _this.location, _this.appRef, _this.elRefMap, _this.elEventsMap, container, component, params, cssClasses);
                resolve(el);
            });
        });
    };
    AngularFrameworkDelegate.prototype.removeViewFromDom = function (_container, component) {
        var _this = this;
        return this.zone.run(function () {
            return new Promise(function (resolve) {
                var componentRef = _this.elRefMap.get(component);
                if (componentRef) {
                    componentRef.destroy();
                    _this.elRefMap.delete(component);
                    var unbindEvents = _this.elEventsMap.get(component);
                    if (unbindEvents) {
                        unbindEvents();
                        _this.elEventsMap.delete(component);
                    }
                }
                resolve();
            });
        });
    };
    return AngularFrameworkDelegate;
}());
export { AngularFrameworkDelegate };
export var attachView = function (zone, resolver, injector, location, appRef, elRefMap, elEventsMap, container, component, params, cssClasses) {
    var e_1, _a;
    var factory = resolver.resolveComponentFactory(component);
    var childInjector = Injector.create({
        providers: getProviders(params),
        parent: injector
    });
    var componentRef = (location)
        ? location.createComponent(factory, location.length, childInjector)
        : factory.create(childInjector);
    var instance = componentRef.instance;
    var hostElement = componentRef.location.nativeElement;
    if (params) {
        Object.assign(instance, params);
    }
    if (cssClasses) {
        try {
            for (var cssClasses_1 = tslib_1.__values(cssClasses), cssClasses_1_1 = cssClasses_1.next(); !cssClasses_1_1.done; cssClasses_1_1 = cssClasses_1.next()) {
                var clazz = cssClasses_1_1.value;
                hostElement.classList.add(clazz);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cssClasses_1_1 && !cssClasses_1_1.done && (_a = cssClasses_1.return)) _a.call(cssClasses_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    var unbindEvents = bindLifecycleEvents(zone, instance, hostElement);
    container.appendChild(hostElement);
    if (!location) {
        appRef.attachView(componentRef.hostView);
    }
    componentRef.changeDetectorRef.reattach();
    elRefMap.set(hostElement, componentRef);
    elEventsMap.set(hostElement, unbindEvents);
    return hostElement;
};
var LIFECYCLES = [
    LIFECYCLE_WILL_ENTER,
    LIFECYCLE_DID_ENTER,
    LIFECYCLE_WILL_LEAVE,
    LIFECYCLE_DID_LEAVE,
    LIFECYCLE_WILL_UNLOAD
];
export var bindLifecycleEvents = function (zone, instance, element) {
    return zone.run(function () {
        var unregisters = LIFECYCLES
            .filter(function (eventName) { return typeof instance[eventName] === 'function'; })
            .map(function (eventName) {
            var handler = function (ev) { return instance[eventName](ev.detail); };
            element.addEventListener(eventName, handler);
            return function () { return element.removeEventListener(eventName, handler); };
        });
        return function () { return unregisters.forEach(function (fn) { return fn(); }); };
    });
};
var NavParamsToken = new InjectionToken('NavParamsToken');
var getProviders = function (params) {
    return [
        {
            provide: NavParamsToken, useValue: params
        },
        {
            provide: NavParams, useFactory: provideNavParamsInjectable, deps: [NavParamsToken]
        }
    ];
};
var ɵ0 = getProviders;
var provideNavParamsInjectable = function (params) {
    return new NavParams(params);
};
var ɵ1 = provideNavParamsInjectable;
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kZWxlZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsicHJvdmlkZXJzL2FuZ3VsYXItZGVsZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pJLE9BQU8sRUFBcUIsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFN0osT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBR2hFO0lBRUUseUJBQ1UsSUFBWSxFQUNaLE1BQXNCO1FBRHRCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixXQUFNLEdBQU4sTUFBTSxDQUFnQjtJQUM3QixDQUFDO0lBRUosZ0NBQU0sR0FBTixVQUNFLFFBQWtDLEVBQ2xDLFFBQWtCLEVBQ2xCLFFBQTJCO1FBRTNCLE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RixDQUFDOztnQkFWZSxNQUFNO2dCQUNKLGNBQWM7O0lBSnJCLGVBQWU7UUFEM0IsVUFBVSxFQUFFO09BQ0EsZUFBZSxDQWMzQjtJQUFELHNCQUFDO0NBQUEsQUFkRCxJQWNDO1NBZFksZUFBZTtBQWdCNUI7SUFLRSxrQ0FDVSxRQUFrQyxFQUNsQyxRQUFrQixFQUNsQixRQUFzQyxFQUN0QyxNQUFzQixFQUN0QixJQUFZO1FBSlosYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFDbEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixhQUFRLEdBQVIsUUFBUSxDQUE4QjtR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TyxHQUFHLFVBQUMsRUFBTyxJQUFLLE9BQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQztZQUM1RCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE9BQU8sY0FBTSxPQUFBLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQS9DLENBQStDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxPQUFPLGNBQU0sT0FBQSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxFQUFFLEVBQUosQ0FBSSxDQUFDLEVBQS9CLENBQStCLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRixJQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBTSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRWpFLElBQU0sWUFBWSxHQUFHLFVBQUMsTUFBNEI7SUFDaEQsT0FBTztRQUNMO1lBQ0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTTtTQUMxQztRQUNEO1lBQ0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsMEJBQTBCLEVBQUUsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDO1NBQ25GO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQzs7QUFFRixJQUFNLDBCQUEwQixHQUFHLFVBQUMsTUFBNEI7SUFDOUQsT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBsaWNhdGlvblJlZiwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE5nWm9uZSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRnJhbWV3b3JrRGVsZWdhdGUsIExJRkVDWUNMRV9ESURfRU5URVIsIExJRkVDWUNMRV9ESURfTEVBVkUsIExJRkVDWUNMRV9XSUxMX0VOVEVSLCBMSUZFQ1lDTEVfV0lMTF9MRUFWRSwgTElGRUNZQ0xFX1dJTExfVU5MT0FEIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuXG5pbXBvcnQgeyBOYXZQYXJhbXMgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25hdmlnYXRpb24vbmF2LXBhcmFtcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRGVsZWdhdGUge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZlxuICApIHt9XG5cbiAgY3JlYXRlKFxuICAgIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGxvY2F0aW9uPzogVmlld0NvbnRhaW5lclJlZixcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyBBbmd1bGFyRnJhbWV3b3JrRGVsZWdhdGUocmVzb2x2ZXIsIGluamVjdG9yLCBsb2NhdGlvbiwgdGhpcy5hcHBSZWYsIHRoaXMuem9uZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGcmFtZXdvcmtEZWxlZ2F0ZSBpbXBsZW1lbnRzIEZyYW1ld29ya0RlbGVnYXRlIHtcblxuICBwcml2YXRlIGVsUmVmTWFwID0gbmV3IFdlYWtNYXA8SFRNTEVsZW1lbnQsIGFueT4oKTtcbiAgcHJpdmF0ZSBlbEV2ZW50c01hcCA9IG5ldyBXZWFrTWFwPEhUTUxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIGxvY2F0aW9uOiBWaWV3Q29udGFpbmVyUmVmIHwgdW5kZWZpbmVkLFxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIGF0dGFjaFZpZXdUb0RvbShjb250YWluZXI6IGFueSwgY29tcG9uZW50OiBhbnksIHBhcmFtcz86IGFueSwgY3NzQ2xhc3Nlcz86IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gYXR0YWNoVmlldyhcbiAgICAgICAgICB0aGlzLnpvbmUsIHRoaXMucmVzb2x2ZXIsIHRoaXMuaW5qZWN0b3IsIHRoaXMubG9jYXRpb24sIHRoaXMuYXBwUmVmLFxuICAgICAgICAgIHRoaXMuZWxSZWZNYXAsIHRoaXMuZWxFdmVudHNNYXAsXG4gICAgICAgICAgY29udGFpbmVyLCBjb21wb25lbnQsIHBhcmFtcywgY3NzQ2xhc3Nlc1xuICAgICAgICApO1xuICAgICAgICByZXNvbHZlKGVsKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlVmlld0Zyb21Eb20oX2NvbnRhaW5lcjogYW55LCBjb21wb25lbnQ6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy5lbFJlZk1hcC5nZXQoY29tcG9uZW50KTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFJlZikge1xuICAgICAgICAgIGNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICAgICAgdGhpcy5lbFJlZk1hcC5kZWxldGUoY29tcG9uZW50KTtcbiAgICAgICAgICBjb25zdCB1bmJpbmRFdmVudHMgPSB0aGlzLmVsRXZlbnRzTWFwLmdldChjb21wb25lbnQpO1xuICAgICAgICAgIGlmICh1bmJpbmRFdmVudHMpIHtcbiAgICAgICAgICAgIHVuYmluZEV2ZW50cygpO1xuICAgICAgICAgICAgdGhpcy5lbEV2ZW50c01hcC5kZWxldGUoY29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGF0dGFjaFZpZXcgPSAoXG4gIHpvbmU6IE5nWm9uZSxcbiAgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgaW5qZWN0b3I6IEluamVjdG9yLFxuICBsb2NhdGlvbjogVmlld0NvbnRhaW5lclJlZiB8IHVuZGVmaW5lZCxcbiAgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgZWxSZWZNYXA6IFdlYWtNYXA8SFRNTEVsZW1lbnQsIGFueT4sXG4gIGVsRXZlbnRzTWFwOiBXZWFrTWFwPEhUTUxFbGVtZW50LCAoKSA9PiB2b2lkPixcbiAgY29udGFpbmVyOiBhbnksIGNvbXBvbmVudDogYW55LCBwYXJhbXM6IGFueSwgY3NzQ2xhc3Nlczogc3RyaW5nW10gfCB1bmRlZmluZWRcbikgPT4ge1xuICBjb25zdCBmYWN0b3J5ID0gcmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgY29uc3QgY2hpbGRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgcHJvdmlkZXJzOiBnZXRQcm92aWRlcnMocGFyYW1zKSxcbiAgICBwYXJlbnQ6IGluamVjdG9yXG4gIH0pO1xuICBjb25zdCBjb21wb25lbnRSZWYgPSAobG9jYXRpb24pXG4gICAgPyBsb2NhdGlvbi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSwgbG9jYXRpb24ubGVuZ3RoLCBjaGlsZEluamVjdG9yKVxuICAgIDogZmFjdG9yeS5jcmVhdGUoY2hpbGRJbmplY3Rvcik7XG5cbiAgY29uc3QgaW5zdGFuY2UgPSBjb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gIGNvbnN0IGhvc3RFbGVtZW50ID0gY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBwYXJhbXMpO1xuICB9XG4gIGlmIChjc3NDbGFzc2VzKSB7XG4gICAgZm9yIChjb25zdCBjbGF6eiBvZiBjc3NDbGFzc2VzKSB7XG4gICAgICBob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXp6KTtcbiAgICB9XG4gIH1cbiAgY29uc3QgdW5iaW5kRXZlbnRzID0gYmluZExpZmVjeWNsZUV2ZW50cyh6b25lLCBpbnN0YW5jZSwgaG9zdEVsZW1lbnQpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaG9zdEVsZW1lbnQpO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICBhcHBSZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuICB9XG4gIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5yZWF0dGFjaCgpO1xuICBlbFJlZk1hcC5zZXQoaG9zdEVsZW1lbnQsIGNvbXBvbmVudFJlZik7XG4gIGVsRXZlbnRzTWFwLnNldChob3N0RWxlbWVudCwgdW5iaW5kRXZlbnRzKTtcbiAgcmV0dXJuIGhvc3RFbGVtZW50O1xufTtcblxuY29uc3QgTElGRUNZQ0xFUyA9IFtcbiAgTElGRUNZQ0xFX1dJTExfRU5URVIsXG4gIExJRkVDWUNMRV9ESURfRU5URVIsXG4gIExJRkVDWUNMRV9XSUxMX0xFQVZFLFxuICBMSUZFQ1lDTEVfRElEX0xFQVZFLFxuICBMSUZFQ1lDTEVfV0lMTF9VTkxPQURcbl07XG5cbmV4cG9ydCBjb25zdCBiaW5kTGlmZWN5Y2xlRXZlbnRzID0gKHpvbmU6IE5nWm9uZSwgaW5zdGFuY2U6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgcmV0dXJuIHpvbmUucnVuKCgpID0+IHtcbiAgICBjb25zdCB1bnJlZ2lzdGVycyA9IExJRkVDWUNMRVNcbiAgICAgIC5maWx0ZXIoZXZlbnROYW1lID0+IHR5cGVvZiBpbnN0YW5jZVtldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKVxuICAgICAgLm1hcChldmVudE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGV2OiBhbnkpID0+IGluc3RhbmNlW2V2ZW50TmFtZV0oZXYuZGV0YWlsKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB1bnJlZ2lzdGVycy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICB9KTtcbn07XG5cbmNvbnN0IE5hdlBhcmFtc1Rva2VuID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ05hdlBhcmFtc1Rva2VuJyk7XG5cbmNvbnN0IGdldFByb3ZpZGVycyA9IChwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTmF2UGFyYW1zVG9rZW4sIHVzZVZhbHVlOiBwYXJhbXNcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5hdlBhcmFtcywgdXNlRmFjdG9yeTogcHJvdmlkZU5hdlBhcmFtc0luamVjdGFibGUsIGRlcHM6IFtOYXZQYXJhbXNUb2tlbl1cbiAgICB9XG4gIF07XG59O1xuXG5jb25zdCBwcm92aWRlTmF2UGFyYW1zSW5qZWN0YWJsZSA9IChwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiB7XG4gIHJldHVybiBuZXcgTmF2UGFyYW1zKHBhcmFtcyk7XG59O1xuIl19