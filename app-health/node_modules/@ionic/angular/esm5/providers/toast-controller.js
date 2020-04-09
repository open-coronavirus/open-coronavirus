import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { toastController } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import * as i0 from "@angular/core";
var ToastController = /** @class */ (function (_super) {
    tslib_1.__extends(ToastController, _super);
    function ToastController() {
        return _super.call(this, toastController) || this;
    }
    ToastController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ToastController_Factory() { return new ToastController(); }, token: ToastController, providedIn: "root" });
    ToastController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], ToastController);
    return ToastController;
}(OverlayBaseController));
export { ToastController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QtY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsicHJvdmlkZXJzL3RvYXN0LWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFnQixlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBS3hEO0lBQXFDLDJDQUF3RDtJQUMzRjtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDOztJQUhVLGVBQWU7UUFIM0IsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLGVBQWUsQ0FJM0I7MEJBWkQ7Q0FZQyxBQUpELENBQXFDLHFCQUFxQixHQUl6RDtTQUpZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUb2FzdE9wdGlvbnMsIHRvYXN0Q29udHJvbGxlciB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgT3ZlcmxheUJhc2VDb250cm9sbGVyIH0gZnJvbSAnLi4vdXRpbC9vdmVybGF5JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFRvYXN0Q29udHJvbGxlciBleHRlbmRzIE92ZXJsYXlCYXNlQ29udHJvbGxlcjxUb2FzdE9wdGlvbnMsIEhUTUxJb25Ub2FzdEVsZW1lbnQ+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIodG9hc3RDb250cm9sbGVyKTtcbiAgfVxufVxuIl19