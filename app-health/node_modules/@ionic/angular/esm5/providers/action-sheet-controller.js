import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { actionSheetController } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import * as i0 from "@angular/core";
var ActionSheetController = /** @class */ (function (_super) {
    tslib_1.__extends(ActionSheetController, _super);
    function ActionSheetController() {
        return _super.call(this, actionSheetController) || this;
    }
    ActionSheetController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ActionSheetController_Factory() { return new ActionSheetController(); }, token: ActionSheetController, providedIn: "root" });
    ActionSheetController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], ActionSheetController);
    return ActionSheetController;
}(OverlayBaseController));
export { ActionSheetController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLXNoZWV0LWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9hY3Rpb24tc2hlZXQtY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQXNCLHFCQUFxQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXhFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUt4RDtJQUEyQyxpREFBb0U7SUFDN0c7ZUFDRSxrQkFBTSxxQkFBcUIsQ0FBQztJQUM5QixDQUFDOztJQUhVLHFCQUFxQjtRQUhqQyxVQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO09BQ1cscUJBQXFCLENBSWpDO2dDQVpEO0NBWUMsQUFKRCxDQUEyQyxxQkFBcUIsR0FJL0Q7U0FKWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb25TaGVldE9wdGlvbnMsIGFjdGlvblNoZWV0Q29udHJvbGxlciB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgT3ZlcmxheUJhc2VDb250cm9sbGVyIH0gZnJvbSAnLi4vdXRpbC9vdmVybGF5JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEFjdGlvblNoZWV0Q29udHJvbGxlciBleHRlbmRzIE92ZXJsYXlCYXNlQ29udHJvbGxlcjxBY3Rpb25TaGVldE9wdGlvbnMsIEhUTUxJb25BY3Rpb25TaGVldEVsZW1lbnQ+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWN0aW9uU2hlZXRDb250cm9sbGVyKTtcbiAgfVxufVxuIl19