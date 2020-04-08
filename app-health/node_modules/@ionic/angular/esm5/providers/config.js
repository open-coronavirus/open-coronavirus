import * as tslib_1 from "tslib";
import { Injectable, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.prototype.get = function (key, fallback) {
        var c = getConfig();
        if (c) {
            return c.get(key, fallback);
        }
        return null;
    };
    Config.prototype.getBoolean = function (key, fallback) {
        var c = getConfig();
        if (c) {
            return c.getBoolean(key, fallback);
        }
        return false;
    };
    Config.prototype.getNumber = function (key, fallback) {
        var c = getConfig();
        if (c) {
            return c.getNumber(key, fallback);
        }
        return 0;
    };
    Config.prototype.set = function (key, value) {
        console.warn("[DEPRECATION][Config]: The Config.set() method is deprecated and will be removed in Ionic Framework 6.0. Please see https://ionicframework.com/docs/angular/config for alternatives.");
        var c = getConfig();
        if (c) {
            c.set(key, value);
        }
    };
    Config.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Config_Factory() { return new Config(); }, token: Config, providedIn: "root" });
    Config = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        })
    ], Config);
    return Config;
}());
export { Config };
export var ConfigToken = new InjectionToken('USERCONFIG');
var getConfig = function () {
    if (typeof window !== 'undefined') {
        var Ionic = window.Ionic;
        if (Ionic && Ionic.config) {
            return Ionic.config;
        }
    }
    return null;
};
var ɵ0 = getConfig;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJwcm92aWRlcnMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFRM0Q7SUFBQTtLQWlDQztJQS9CQyxvQkFBRyxHQUFILFVBQUksR0FBc0IsRUFBRSxRQUFjO1FBQ3hDLElBQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDJCQUFVLEdBQVYsVUFBVyxHQUFzQixFQUFFLFFBQWtCO1FBQ25ELElBQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELDBCQUFTLEdBQVQsVUFBVSxHQUFzQixFQUFFLFFBQWlCO1FBQ2pELElBQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELG9CQUFHLEdBQUgsVUFBSSxHQUFzQixFQUFFLEtBQVc7UUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxzTEFBc0wsQ0FBQyxDQUFDO1FBQ3JNLElBQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkI7SUFDSCxDQUFDOztJQWhDVSxNQUFNO1FBSGxCLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7T0FDVyxNQUFNLENBaUNsQjtpQkF6Q0Q7Q0F5Q0MsQUFqQ0QsSUFpQ0M7U0FqQ1ksTUFBTTtBQW1DbkIsTUFBTSxDQUFDLElBQU0sV0FBVyxHQUFHLElBQUksY0FBYyxDQUFNLFlBQVksQ0FBQyxDQUFDO0FBRWpFLElBQU0sU0FBUyxHQUFHO0lBQ2hCLElBQUksT0FBUSxNQUFjLEtBQUssV0FBVyxFQUFFO1FBQzFDLElBQU0sS0FBSyxHQUFJLE1BQTZCLENBQUMsS0FBSyxDQUFDO1FBQ25ELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDekIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3JCO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb25maWcgYXMgQ29yZUNvbmZpZywgSW9uaWNDb25maWcgfSBmcm9tICdAaW9uaWMvY29yZSc7XG5cbmltcG9ydCB7IElvbmljV2luZG93IH0gZnJvbSAnLi4vdHlwZXMvaW50ZXJmYWNlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENvbmZpZyB7XG5cbiAgZ2V0KGtleToga2V5b2YgSW9uaWNDb25maWcsIGZhbGxiYWNrPzogYW55KTogYW55IHtcbiAgICBjb25zdCBjID0gZ2V0Q29uZmlnKCk7XG4gICAgaWYgKGMpIHtcbiAgICAgIHJldHVybiBjLmdldChrZXksIGZhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRCb29sZWFuKGtleToga2V5b2YgSW9uaWNDb25maWcsIGZhbGxiYWNrPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGMgPSBnZXRDb25maWcoKTtcbiAgICBpZiAoYykge1xuICAgICAgcmV0dXJuIGMuZ2V0Qm9vbGVhbihrZXksIGZhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0TnVtYmVyKGtleToga2V5b2YgSW9uaWNDb25maWcsIGZhbGxiYWNrPzogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBjID0gZ2V0Q29uZmlnKCk7XG4gICAgaWYgKGMpIHtcbiAgICAgIHJldHVybiBjLmdldE51bWJlcihrZXksIGZhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBzZXQoa2V5OiBrZXlvZiBJb25pY0NvbmZpZywgdmFsdWU/OiBhbnkpIHtcbiAgICBjb25zb2xlLndhcm4oYFtERVBSRUNBVElPTl1bQ29uZmlnXTogVGhlIENvbmZpZy5zZXQoKSBtZXRob2QgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIElvbmljIEZyYW1ld29yayA2LjAuIFBsZWFzZSBzZWUgaHR0cHM6Ly9pb25pY2ZyYW1ld29yay5jb20vZG9jcy9hbmd1bGFyL2NvbmZpZyBmb3IgYWx0ZXJuYXRpdmVzLmApO1xuICAgIGNvbnN0IGMgPSBnZXRDb25maWcoKTtcbiAgICBpZiAoYykge1xuICAgICAgYy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBDb25maWdUb2tlbiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdVU0VSQ09ORklHJyk7XG5cbmNvbnN0IGdldENvbmZpZyA9ICgpOiBDb3JlQ29uZmlnIHwgbnVsbCA9PiB7XG4gIGlmICh0eXBlb2YgKHdpbmRvdyBhcyBhbnkpICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IElvbmljID0gKHdpbmRvdyBhcyBhbnkgYXMgSW9uaWNXaW5kb3cpLklvbmljO1xuICAgIGlmIChJb25pYyAmJiBJb25pYy5jb25maWcpIHtcbiAgICAgIHJldHVybiBJb25pYy5jb25maWc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcbiJdfQ==