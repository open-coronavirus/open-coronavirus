import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { loadingController } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import * as i0 from "@angular/core";
let LoadingController = class LoadingController extends OverlayBaseController {
    constructor() {
        super(loadingController);
    }
};
LoadingController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LoadingController_Factory() { return new LoadingController(); }, token: LoadingController, providedIn: "root" });
LoadingController = tslib_1.__decorate([
    Injectable({
        providedIn: 'root',
    })
], LoadingController);
export { LoadingController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJwcm92aWRlcnMvbG9hZGluZy1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBa0IsaUJBQWlCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFaEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBS3hELElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEscUJBQTREO0lBQ2pHO1FBQ0UsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNGLENBQUE7O0FBSlksaUJBQWlCO0lBSDdCLFVBQVUsQ0FBQztRQUNWLFVBQVUsRUFBRSxNQUFNO0tBQ25CLENBQUM7R0FDVyxpQkFBaUIsQ0FJN0I7U0FKWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2FkaW5nT3B0aW9ucywgbG9hZGluZ0NvbnRyb2xsZXIgfSBmcm9tICdAaW9uaWMvY29yZSc7XG5cbmltcG9ydCB7IE92ZXJsYXlCYXNlQ29udHJvbGxlciB9IGZyb20gJy4uL3V0aWwvb3ZlcmxheSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBMb2FkaW5nQ29udHJvbGxlciBleHRlbmRzIE92ZXJsYXlCYXNlQ29udHJvbGxlcjxMb2FkaW5nT3B0aW9ucywgSFRNTElvbkxvYWRpbmdFbGVtZW50PiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGxvYWRpbmdDb250cm9sbGVyKTtcbiAgfVxufVxuIl19