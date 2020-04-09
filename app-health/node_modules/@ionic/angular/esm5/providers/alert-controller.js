import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { alertController } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import * as i0 from "@angular/core";
var AlertController = /** @class */ (function (_super) {
    tslib_1.__extends(AlertController, _super);
    function AlertController() {
        return _super.call(this, alertController) || this;
    }
    AlertController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AlertController_Factory() { return new AlertController(); }, token: AlertController, providedIn: "root" });
    AlertController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], AlertController);
    return AlertController;
}(OverlayBaseController));
export { AlertController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQtY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsicHJvdmlkZXJzL2FsZXJ0LWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFnQixlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBS3hEO0lBQXFDLDJDQUF3RDtJQUMzRjtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDOztJQUhVLGVBQWU7UUFIM0IsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLGVBQWUsQ0FJM0I7MEJBWkQ7Q0FZQyxBQUpELENBQXFDLHFCQUFxQixHQUl6RDtTQUpZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbGVydE9wdGlvbnMsIGFsZXJ0Q29udHJvbGxlciB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgT3ZlcmxheUJhc2VDb250cm9sbGVyIH0gZnJvbSAnLi4vdXRpbC9vdmVybGF5JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEFsZXJ0Q29udHJvbGxlciBleHRlbmRzIE92ZXJsYXlCYXNlQ29udHJvbGxlcjxBbGVydE9wdGlvbnMsIEhUTUxJb25BbGVydEVsZW1lbnQ+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWxlcnRDb250cm9sbGVyKTtcbiAgfVxufVxuIl19