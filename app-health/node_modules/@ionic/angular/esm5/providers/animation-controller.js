import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { createAnimation, getTimeGivenProgression } from '@ionic/core';
import * as i0 from "@angular/core";
var AnimationController = /** @class */ (function () {
    function AnimationController() {
    }
    /**
     * Create a new animation
     */
    AnimationController.prototype.create = function (animationId) {
        return createAnimation(animationId);
    };
    /**
     * EXPERIMENTAL
     *
     * Given a progression and a cubic bezier function,
     * this utility returns the time value(s) at which the
     * cubic bezier reaches the given time progression.
     *
     * If the cubic bezier never reaches the progression
     * the result will be an empty array.
     *
     * This is most useful for switching between easing curves
     * when doing a gesture animation (i.e. going from linear easing
     * during a drag, to another easing when `progressEnd` is called)
     */
    AnimationController.prototype.easingTime = function (p0, p1, p2, p3, progression) {
        return getTimeGivenProgression(p0, p1, p2, p3, progression);
    };
    AnimationController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AnimationController_Factory() { return new AnimationController(); }, token: AnimationController, providedIn: "root" });
    AnimationController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], AnimationController);
    return AnimationController;
}());
export { AnimationController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9hbmltYXRpb24tY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWEsZUFBZSxFQUFFLHVCQUF1QixFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUtsRjtJQUFBO0tBeUJDO0lBeEJDOztPQUVHO0lBQ0gsb0NBQU0sR0FBTixVQUFPLFdBQW9CO1FBQ3pCLE9BQU8sZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsd0NBQVUsR0FBVixVQUFXLEVBQVksRUFBRSxFQUFZLEVBQUUsRUFBWSxFQUFFLEVBQVksRUFBRSxXQUFtQjtRQUNwRixPQUFPLHVCQUF1QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM5RCxDQUFDOztJQXhCVSxtQkFBbUI7UUFIL0IsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLG1CQUFtQixDQXlCL0I7OEJBL0JEO0NBK0JDLEFBekJELElBeUJDO1NBekJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFuaW1hdGlvbiwgY3JlYXRlQW5pbWF0aW9uLCBnZXRUaW1lR2l2ZW5Qcm9ncmVzc2lvbiB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkNvbnRyb2xsZXIge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGFuaW1hdGlvblxuICAgKi9cbiAgY3JlYXRlKGFuaW1hdGlvbklkPzogc3RyaW5nKTogQW5pbWF0aW9uIHtcbiAgICByZXR1cm4gY3JlYXRlQW5pbWF0aW9uKGFuaW1hdGlvbklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFWFBFUklNRU5UQUxcbiAgICpcbiAgICogR2l2ZW4gYSBwcm9ncmVzc2lvbiBhbmQgYSBjdWJpYyBiZXppZXIgZnVuY3Rpb24sXG4gICAqIHRoaXMgdXRpbGl0eSByZXR1cm5zIHRoZSB0aW1lIHZhbHVlKHMpIGF0IHdoaWNoIHRoZVxuICAgKiBjdWJpYyBiZXppZXIgcmVhY2hlcyB0aGUgZ2l2ZW4gdGltZSBwcm9ncmVzc2lvbi5cbiAgICpcbiAgICogSWYgdGhlIGN1YmljIGJlemllciBuZXZlciByZWFjaGVzIHRoZSBwcm9ncmVzc2lvblxuICAgKiB0aGUgcmVzdWx0IHdpbGwgYmUgYW4gZW1wdHkgYXJyYXkuXG4gICAqXG4gICAqIFRoaXMgaXMgbW9zdCB1c2VmdWwgZm9yIHN3aXRjaGluZyBiZXR3ZWVuIGVhc2luZyBjdXJ2ZXNcbiAgICogd2hlbiBkb2luZyBhIGdlc3R1cmUgYW5pbWF0aW9uIChpLmUuIGdvaW5nIGZyb20gbGluZWFyIGVhc2luZ1xuICAgKiBkdXJpbmcgYSBkcmFnLCB0byBhbm90aGVyIGVhc2luZyB3aGVuIGBwcm9ncmVzc0VuZGAgaXMgY2FsbGVkKVxuICAgKi9cbiAgZWFzaW5nVGltZShwMDogbnVtYmVyW10sIHAxOiBudW1iZXJbXSwgcDI6IG51bWJlcltdLCBwMzogbnVtYmVyW10sIHByb2dyZXNzaW9uOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIGdldFRpbWVHaXZlblByb2dyZXNzaW9uKHAwLCBwMSwgcDIsIHAzLCBwcm9ncmVzc2lvbik7XG4gIH1cbn1cbiJdfQ==