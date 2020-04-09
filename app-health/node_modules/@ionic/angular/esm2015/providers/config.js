import * as tslib_1 from "tslib";
import { Injectable, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
let Config = class Config {
    get(key, fallback) {
        const c = getConfig();
        if (c) {
            return c.get(key, fallback);
        }
        return null;
    }
    getBoolean(key, fallback) {
        const c = getConfig();
        if (c) {
            return c.getBoolean(key, fallback);
        }
        return false;
    }
    getNumber(key, fallback) {
        const c = getConfig();
        if (c) {
            return c.getNumber(key, fallback);
        }
        return 0;
    }
    set(key, value) {
        console.warn(`[DEPRECATION][Config]: The Config.set() method is deprecated and will be removed in Ionic Framework 6.0. Please see https://ionicframework.com/docs/angular/config for alternatives.`);
        const c = getConfig();
        if (c) {
            c.set(key, value);
        }
    }
};
Config.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Config_Factory() { return new Config(); }, token: Config, providedIn: "root" });
Config = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], Config);
export { Config };
export const ConfigToken = new InjectionToken('USERCONFIG');
const getConfig = () => {
    if (typeof window !== 'undefined') {
        const Ionic = window.Ionic;
        if (Ionic && Ionic.config) {
            return Ionic.config;
        }
    }
    return null;
};
const ɵ0 = getConfig;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJwcm92aWRlcnMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFRM0QsSUFBYSxNQUFNLEdBQW5CLE1BQWEsTUFBTTtJQUVqQixHQUFHLENBQUMsR0FBc0IsRUFBRSxRQUFjO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFzQixFQUFFLFFBQWtCO1FBQ25ELE1BQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFzQixFQUFFLFFBQWlCO1FBQ2pELE1BQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELEdBQUcsQ0FBQyxHQUFzQixFQUFFLEtBQVc7UUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxzTEFBc0wsQ0FBQyxDQUFDO1FBQ3JNLE1BQU0sQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFO1lBQ0wsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkI7SUFDSCxDQUFDO0NBQ0YsQ0FBQTs7QUFqQ1ksTUFBTTtJQUhsQixVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDO0dBQ1csTUFBTSxDQWlDbEI7U0FqQ1ksTUFBTTtBQW1DbkIsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLElBQUksY0FBYyxDQUFNLFlBQVksQ0FBQyxDQUFDO0FBRWpFLE1BQU0sU0FBUyxHQUFHLEdBQXNCLEVBQUU7SUFDeEMsSUFBSSxPQUFRLE1BQWMsS0FBSyxXQUFXLEVBQUU7UUFDMUMsTUFBTSxLQUFLLEdBQUksTUFBNkIsQ0FBQyxLQUFLLENBQUM7UUFDbkQsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN6QixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDckI7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbmZpZyBhcyBDb3JlQ29uZmlnLCBJb25pY0NvbmZpZyB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgSW9uaWNXaW5kb3cgfSBmcm9tICcuLi90eXBlcy9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcblxuICBnZXQoa2V5OiBrZXlvZiBJb25pY0NvbmZpZywgZmFsbGJhY2s/OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IGMgPSBnZXRDb25maWcoKTtcbiAgICBpZiAoYykge1xuICAgICAgcmV0dXJuIGMuZ2V0KGtleSwgZmFsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldEJvb2xlYW4oa2V5OiBrZXlvZiBJb25pY0NvbmZpZywgZmFsbGJhY2s/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYyA9IGdldENvbmZpZygpO1xuICAgIGlmIChjKSB7XG4gICAgICByZXR1cm4gYy5nZXRCb29sZWFuKGtleSwgZmFsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXROdW1iZXIoa2V5OiBrZXlvZiBJb25pY0NvbmZpZywgZmFsbGJhY2s/OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGMgPSBnZXRDb25maWcoKTtcbiAgICBpZiAoYykge1xuICAgICAgcmV0dXJuIGMuZ2V0TnVtYmVyKGtleSwgZmFsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHNldChrZXk6IGtleW9mIElvbmljQ29uZmlnLCB2YWx1ZT86IGFueSkge1xuICAgIGNvbnNvbGUud2FybihgW0RFUFJFQ0FUSU9OXVtDb25maWddOiBUaGUgQ29uZmlnLnNldCgpIG1ldGhvZCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gSW9uaWMgRnJhbWV3b3JrIDYuMC4gUGxlYXNlIHNlZSBodHRwczovL2lvbmljZnJhbWV3b3JrLmNvbS9kb2NzL2FuZ3VsYXIvY29uZmlnIGZvciBhbHRlcm5hdGl2ZXMuYCk7XG4gICAgY29uc3QgYyA9IGdldENvbmZpZygpO1xuICAgIGlmIChjKSB7XG4gICAgICBjLnNldChrZXksIHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IENvbmZpZ1Rva2VuID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ1VTRVJDT05GSUcnKTtcblxuY29uc3QgZ2V0Q29uZmlnID0gKCk6IENvcmVDb25maWcgfCBudWxsID0+IHtcbiAgaWYgKHR5cGVvZiAod2luZG93IGFzIGFueSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3QgSW9uaWMgPSAod2luZG93IGFzIGFueSBhcyBJb25pY1dpbmRvdykuSW9uaWM7XG4gICAgaWYgKElvbmljICYmIElvbmljLmNvbmZpZykge1xuICAgICAgcmV0dXJuIElvbmljLmNvbmZpZztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuIl19