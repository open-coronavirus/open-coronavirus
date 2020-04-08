import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from './value-accessor';
var BooleanValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(BooleanValueAccessor, _super);
    function BooleanValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    BooleanValueAccessor_1 = BooleanValueAccessor;
    BooleanValueAccessor.prototype.writeValue = function (value) {
        this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
        setIonicClasses(this.el);
    };
    BooleanValueAccessor.prototype._handleIonChange = function (el) {
        this.handleChangeEvent(el, el.checked);
    };
    var BooleanValueAccessor_1;
    BooleanValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        HostListener('ionChange', ['$event.target'])
    ], BooleanValueAccessor.prototype, "_handleIonChange", null);
    BooleanValueAccessor = BooleanValueAccessor_1 = tslib_1.__decorate([
        Directive({
            /* tslint:disable-next-line:directive-selector */
            selector: 'ion-checkbox,ion-toggle',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: BooleanValueAccessor_1,
                    multi: true
                }
            ]
        })
    ], BooleanValueAccessor);
    return BooleanValueAccessor;
}(ValueAccessor));
export { BooleanValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhbi12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9jb250cm9sLXZhbHVlLWFjY2Vzc29ycy9ib29sZWFuLXZhbHVlLWFjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQWFsRTtJQUEwQyxnREFBYTtJQUVyRCw4QkFBWSxFQUFjO2VBQ3hCLGtCQUFNLEVBQUUsQ0FBQztJQUNYLENBQUM7NkJBSlUsb0JBQW9CO0lBTS9CLHlDQUFVLEdBQVYsVUFBVyxLQUFVO1FBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQy9FLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUdELCtDQUFnQixHQUFoQixVQUFpQixFQUFPO1FBQ3RCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7OztnQkFaZSxVQUFVOztJQVUxQjtRQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnRUFHNUM7SUFkVSxvQkFBb0I7UUFYaEMsU0FBUyxDQUFDO1lBQ1QsaURBQWlEO1lBQ2pELFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxzQkFBb0I7b0JBQ2pDLEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO09BQ1csb0JBQW9CLENBZWhDO0lBQUQsMkJBQUM7Q0FBQSxBQWZELENBQTBDLGFBQWEsR0FldEQ7U0FmWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFZhbHVlQWNjZXNzb3IsIHNldElvbmljQ2xhc3NlcyB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1jaGVja2JveCxpb24tdG9nZ2xlJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogQm9vbGVhblZhbHVlQWNjZXNzb3IsXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBCb29sZWFuVmFsdWVBY2Nlc3NvciBleHRlbmRzIFZhbHVlQWNjZXNzb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoZWwpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoZWNrZWQgPSB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlID09IG51bGwgPyBmYWxzZSA6IHZhbHVlO1xuICAgIHNldElvbmljQ2xhc3Nlcyh0aGlzLmVsKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkNoYW5nZScsIFsnJGV2ZW50LnRhcmdldCddKVxuICBfaGFuZGxlSW9uQ2hhbmdlKGVsOiBhbnkpIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZUV2ZW50KGVsLCBlbC5jaGVja2VkKTtcbiAgfVxufVxuIl19