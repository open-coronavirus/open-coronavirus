import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { createAnimation, getTimeGivenProgression } from '@ionic/core';
import * as i0 from "@angular/core";
let AnimationController = class AnimationController {
    /**
     * Create a new animation
     */
    create(animationId) {
        return createAnimation(animationId);
    }
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
    easingTime(p0, p1, p2, p3, progression) {
        return getTimeGivenProgression(p0, p1, p2, p3, progression);
    }
};
AnimationController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AnimationController_Factory() { return new AnimationController(); }, token: AnimationController, providedIn: "root" });
AnimationController = tslib_1.__decorate([
    Injectable({
        providedIn: 'root',
    })
], AnimationController);
export { AnimationController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9hbmltYXRpb24tY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWEsZUFBZSxFQUFFLHVCQUF1QixFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUtsRixJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQUM5Qjs7T0FFRztJQUNILE1BQU0sQ0FBQyxXQUFvQjtRQUN6QixPQUFPLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFVBQVUsQ0FBQyxFQUFZLEVBQUUsRUFBWSxFQUFFLEVBQVksRUFBRSxFQUFZLEVBQUUsV0FBbUI7UUFDcEYsT0FBTyx1QkFBdUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDOUQsQ0FBQztDQUNGLENBQUE7O0FBekJZLG1CQUFtQjtJQUgvQixVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDO0dBQ1csbUJBQW1CLENBeUIvQjtTQXpCWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbmltYXRpb24sIGNyZWF0ZUFuaW1hdGlvbiwgZ2V0VGltZUdpdmVuUHJvZ3Jlc3Npb24gfSBmcm9tICdAaW9uaWMvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBBbmltYXRpb25Db250cm9sbGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBhbmltYXRpb25cbiAgICovXG4gIGNyZWF0ZShhbmltYXRpb25JZD86IHN0cmluZyk6IEFuaW1hdGlvbiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFuaW1hdGlvbihhbmltYXRpb25JZCk7XG4gIH1cblxuICAvKipcbiAgICogRVhQRVJJTUVOVEFMXG4gICAqXG4gICAqIEdpdmVuIGEgcHJvZ3Jlc3Npb24gYW5kIGEgY3ViaWMgYmV6aWVyIGZ1bmN0aW9uLFxuICAgKiB0aGlzIHV0aWxpdHkgcmV0dXJucyB0aGUgdGltZSB2YWx1ZShzKSBhdCB3aGljaCB0aGVcbiAgICogY3ViaWMgYmV6aWVyIHJlYWNoZXMgdGhlIGdpdmVuIHRpbWUgcHJvZ3Jlc3Npb24uXG4gICAqXG4gICAqIElmIHRoZSBjdWJpYyBiZXppZXIgbmV2ZXIgcmVhY2hlcyB0aGUgcHJvZ3Jlc3Npb25cbiAgICogdGhlIHJlc3VsdCB3aWxsIGJlIGFuIGVtcHR5IGFycmF5LlxuICAgKlxuICAgKiBUaGlzIGlzIG1vc3QgdXNlZnVsIGZvciBzd2l0Y2hpbmcgYmV0d2VlbiBlYXNpbmcgY3VydmVzXG4gICAqIHdoZW4gZG9pbmcgYSBnZXN0dXJlIGFuaW1hdGlvbiAoaS5lLiBnb2luZyBmcm9tIGxpbmVhciBlYXNpbmdcbiAgICogZHVyaW5nIGEgZHJhZywgdG8gYW5vdGhlciBlYXNpbmcgd2hlbiBgcHJvZ3Jlc3NFbmRgIGlzIGNhbGxlZClcbiAgICovXG4gIGVhc2luZ1RpbWUocDA6IG51bWJlcltdLCBwMTogbnVtYmVyW10sIHAyOiBudW1iZXJbXSwgcDM6IG51bWJlcltdLCBwcm9ncmVzc2lvbjogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHJldHVybiBnZXRUaW1lR2l2ZW5Qcm9ncmVzc2lvbihwMCwgcDEsIHAyLCBwMywgcHJvZ3Jlc3Npb24pO1xuICB9XG59XG4iXX0=