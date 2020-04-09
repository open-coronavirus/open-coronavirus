import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var RadioValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(RadioValueAccessor, _super);
    function RadioValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    RadioValueAccessor_1 = RadioValueAccessor;
    RadioValueAccessor.prototype._handleIonSelect = function (el) {
        this.handleChangeEvent(el, el.checked);
    };
    var RadioValueAccessor_1;
    RadioValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        HostListener('ionSelect', ['$event.target'])
    ], RadioValueAccessor.prototype, "_handleIonSelect", null);
    RadioValueAccessor = RadioValueAccessor_1 = tslib_1.__decorate([
        Directive({
            /* tslint:disable-next-line:directive-selector */
            selector: 'ion-radio',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: RadioValueAccessor_1,
                    multi: true
                }
            ]
        })
    ], RadioValueAccessor);
    return RadioValueAccessor;
}(ValueAccessor));
export { RadioValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tdmFsdWUtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvcmFkaW8tdmFsdWUtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFhakQ7SUFBd0MsOENBQWE7SUFFbkQsNEJBQVksRUFBYztlQUN4QixrQkFBTSxFQUFFLENBQUM7SUFDWCxDQUFDOzJCQUpVLGtCQUFrQjtJQU83Qiw2Q0FBZ0IsR0FBaEIsVUFBaUIsRUFBTztRQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDOzs7Z0JBUGUsVUFBVTs7SUFLMUI7UUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7OERBRzVDO0lBVFUsa0JBQWtCO1FBWDlCLFNBQVMsQ0FBQztZQUNULGlEQUFpRDtZQUNqRCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLG9CQUFrQjtvQkFDL0IsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7T0FDVyxrQkFBa0IsQ0FVOUI7SUFBRCx5QkFBQztDQUFBLEFBVkQsQ0FBd0MsYUFBYSxHQVVwRDtTQVZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgVmFsdWVBY2Nlc3NvciB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1yYWRpbycsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IFJhZGlvVmFsdWVBY2Nlc3NvcixcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvVmFsdWVBY2Nlc3NvciBleHRlbmRzIFZhbHVlQWNjZXNzb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoZWwpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW9uU2VsZWN0JywgWyckZXZlbnQudGFyZ2V0J10pXG4gIF9oYW5kbGVJb25TZWxlY3QoZWw6IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlRXZlbnQoZWwsIGVsLmNoZWNrZWQpO1xuICB9XG59XG4iXX0=