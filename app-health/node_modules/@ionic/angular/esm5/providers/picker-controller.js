import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { pickerController } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import * as i0 from "@angular/core";
var PickerController = /** @class */ (function (_super) {
    tslib_1.__extends(PickerController, _super);
    function PickerController() {
        return _super.call(this, pickerController) || this;
    }
    PickerController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function PickerController_Factory() { return new PickerController(); }, token: PickerController, providedIn: "root" });
    PickerController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], PickerController);
    return PickerController;
}(OverlayBaseController));
export { PickerController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9waWNrZXItY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWlCLGdCQUFnQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUt4RDtJQUFzQyw0Q0FBMEQ7SUFDOUY7ZUFDRSxrQkFBTSxnQkFBZ0IsQ0FBQztJQUN6QixDQUFDOztJQUhVLGdCQUFnQjtRQUg1QixVQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO09BQ1csZ0JBQWdCLENBSTVCOzJCQVpEO0NBWUMsQUFKRCxDQUFzQyxxQkFBcUIsR0FJMUQ7U0FKWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQaWNrZXJPcHRpb25zLCBwaWNrZXJDb250cm9sbGVyIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuXG5pbXBvcnQgeyBPdmVybGF5QmFzZUNvbnRyb2xsZXIgfSBmcm9tICcuLi91dGlsL292ZXJsYXknO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgUGlja2VyQ29udHJvbGxlciBleHRlbmRzIE92ZXJsYXlCYXNlQ29udHJvbGxlcjxQaWNrZXJPcHRpb25zLCBIVE1MSW9uUGlja2VyRWxlbWVudD4ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihwaWNrZXJDb250cm9sbGVyKTtcbiAgfVxufVxuIl19