import * as tslib_1 from "tslib";
var IonicRouteStrategy = /** @class */ (function () {
    function IonicRouteStrategy() {
    }
    IonicRouteStrategy.prototype.shouldDetach = function (_route) {
        return false;
    };
    IonicRouteStrategy.prototype.shouldAttach = function (_route) {
        return false;
    };
    IonicRouteStrategy.prototype.store = function (_route, _detachedTree) {
        return;
    };
    IonicRouteStrategy.prototype.retrieve = function (_route) {
        return null;
    };
    IonicRouteStrategy.prototype.shouldReuseRoute = function (future, curr) {
        var e_1, _a;
        if (future.routeConfig !== curr.routeConfig) {
            return false;
        }
        // checking router params
        var futureParams = future.params;
        var currentParams = curr.params;
        var keysA = Object.keys(futureParams);
        var keysB = Object.keys(currentParams);
        if (keysA.length !== keysB.length) {
            return false;
        }
        try {
            // Test for A's keys different from B.
            for (var keysA_1 = tslib_1.__values(keysA), keysA_1_1 = keysA_1.next(); !keysA_1_1.done; keysA_1_1 = keysA_1.next()) {
                var key = keysA_1_1.value;
                if (currentParams[key] !== futureParams[key]) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keysA_1_1 && !keysA_1_1.done && (_a = keysA_1.return)) _a.call(keysA_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    return IonicRouteStrategy;
}());
export { IonicRouteStrategy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uaWMtcm91dGVyLXJldXNlLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJ1dGlsL2lvbmljLXJvdXRlci1yZXVzZS1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUE7SUFBQTtJQTRDQSxDQUFDO0lBMUNDLHlDQUFZLEdBQVosVUFBYSxNQUE4QjtRQUN6QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCx5Q0FBWSxHQUFaLFVBQWEsTUFBOEI7UUFDekMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsa0NBQUssR0FBTCxVQUFNLE1BQThCLEVBQUUsYUFBa0M7UUFDdEUsT0FBTztJQUNULENBQUM7SUFFRCxxQ0FBUSxHQUFSLFVBQVMsTUFBOEI7UUFDckMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsNkNBQWdCLEdBQWhCLFVBQ0UsTUFBOEIsRUFDOUIsSUFBNEI7O1FBRTVCLElBQUksTUFBTSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzNDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCx5QkFBeUI7UUFDekIsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2xDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV6QyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQyxPQUFPLEtBQUssQ0FBQztTQUNkOztZQUVELHNDQUFzQztZQUN0QyxLQUFrQixJQUFBLFVBQUEsaUJBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO2dCQUFwQixJQUFNLEdBQUcsa0JBQUE7Z0JBQ1osSUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM1QyxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGOzs7Ozs7Ozs7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUE1Q0QsSUE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBEZXRhY2hlZFJvdXRlSGFuZGxlLCBSb3V0ZVJldXNlU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5leHBvcnQgY2xhc3MgSW9uaWNSb3V0ZVN0cmF0ZWd5IGltcGxlbWVudHMgUm91dGVSZXVzZVN0cmF0ZWd5IHtcblxuICBzaG91bGREZXRhY2goX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2hvdWxkQXR0YWNoKF9yb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0b3JlKF9yb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgX2RldGFjaGVkVHJlZTogRGV0YWNoZWRSb3V0ZUhhbmRsZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHJpZXZlKF9yb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IERldGFjaGVkUm91dGVIYW5kbGUgfCBudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHNob3VsZFJldXNlUm91dGUoXG4gICAgZnV0dXJlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICAgIGN1cnI6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RcbiAgKTogYm9vbGVhbiB7XG4gICAgaWYgKGZ1dHVyZS5yb3V0ZUNvbmZpZyAhPT0gY3Vyci5yb3V0ZUNvbmZpZykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoZWNraW5nIHJvdXRlciBwYXJhbXNcbiAgICBjb25zdCBmdXR1cmVQYXJhbXMgPSBmdXR1cmUucGFyYW1zO1xuICAgIGNvbnN0IGN1cnJlbnRQYXJhbXMgPSBjdXJyLnBhcmFtcztcbiAgICBjb25zdCBrZXlzQSA9IE9iamVjdC5rZXlzKGZ1dHVyZVBhcmFtcyk7XG4gICAgY29uc3Qga2V5c0IgPSBPYmplY3Qua2V5cyhjdXJyZW50UGFyYW1zKTtcblxuICAgIGlmIChrZXlzQS5sZW5ndGggIT09IGtleXNCLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRlc3QgZm9yIEEncyBrZXlzIGRpZmZlcmVudCBmcm9tIEIuXG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5c0EpIHtcbiAgICAgIGlmIChjdXJyZW50UGFyYW1zW2tleV0gIT09IGZ1dHVyZVBhcmFtc1trZXldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==