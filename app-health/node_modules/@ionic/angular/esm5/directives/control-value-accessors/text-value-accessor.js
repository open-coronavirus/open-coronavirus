import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var TextValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(TextValueAccessor, _super);
    function TextValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    TextValueAccessor_1 = TextValueAccessor;
    TextValueAccessor.prototype._handleInputEvent = function (el) {
        this.handleChangeEvent(el, el.value);
    };
    var TextValueAccessor_1;
    TextValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        HostListener('ionChange', ['$event.target'])
    ], TextValueAccessor.prototype, "_handleInputEvent", null);
    TextValueAccessor = TextValueAccessor_1 = tslib_1.__decorate([
        Directive({
            /* tslint:disable-next-line:directive-selector */
            selector: 'ion-input:not([type=number]),ion-textarea,ion-searchbar',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: TextValueAccessor_1,
                    multi: true
                }
            ]
        })
    ], TextValueAccessor);
    return TextValueAccessor;
}(ValueAccessor));
export { TextValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9jb250cm9sLXZhbHVlLWFjY2Vzc29ycy90ZXh0LXZhbHVlLWFjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBYWpEO0lBQXVDLDZDQUFhO0lBRWxELDJCQUFZLEVBQWM7ZUFDeEIsa0JBQU0sRUFBRSxDQUFDO0lBQ1gsQ0FBQzswQkFKVSxpQkFBaUI7SUFPNUIsNkNBQWlCLEdBQWpCLFVBQWtCLEVBQU87UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7O2dCQVBlLFVBQVU7O0lBSzFCO1FBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzhEQUc1QztJQVRVLGlCQUFpQjtRQVg3QixTQUFTLENBQUM7WUFDVCxpREFBaUQ7WUFDakQsUUFBUSxFQUFFLHlEQUF5RDtZQUNuRSxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLG1CQUFpQjtvQkFDOUIsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7T0FDVyxpQkFBaUIsQ0FVN0I7SUFBRCx3QkFBQztDQUFBLEFBVkQsQ0FBdUMsYUFBYSxHQVVuRDtTQVZZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgVmFsdWVBY2Nlc3NvciB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1pbnB1dDpub3QoW3R5cGU9bnVtYmVyXSksaW9uLXRleHRhcmVhLGlvbi1zZWFyY2hiYXInLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBUZXh0VmFsdWVBY2Nlc3NvcixcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFRleHRWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgVmFsdWVBY2Nlc3NvciB7XG5cbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBzdXBlcihlbCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpb25DaGFuZ2UnLCBbJyRldmVudC50YXJnZXQnXSlcbiAgX2hhbmRsZUlucHV0RXZlbnQoZWw6IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlRXZlbnQoZWwsIGVsLnZhbHVlKTtcbiAgfVxufVxuIl19