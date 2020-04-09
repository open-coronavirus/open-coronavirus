import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var SelectValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(SelectValueAccessor, _super);
    function SelectValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    SelectValueAccessor_1 = SelectValueAccessor;
    SelectValueAccessor.prototype._handleChangeEvent = function (el) {
        this.handleChangeEvent(el, el.value);
    };
    var SelectValueAccessor_1;
    SelectValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        HostListener('ionChange', ['$event.target'])
    ], SelectValueAccessor.prototype, "_handleChangeEvent", null);
    SelectValueAccessor = SelectValueAccessor_1 = tslib_1.__decorate([
        Directive({
            /* tslint:disable-next-line:directive-selector */
            selector: 'ion-range, ion-select, ion-radio-group, ion-segment, ion-datetime',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: SelectValueAccessor_1,
                    multi: true
                }
            ]
        })
    ], SelectValueAccessor);
    return SelectValueAccessor;
}(ValueAccessor));
export { SelectValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXZhbHVlLWFjY2Vzc29yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3JzL3NlbGVjdC12YWx1ZS1hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQWFqRDtJQUF5QywrQ0FBYTtJQUVwRCw2QkFBWSxFQUFjO2VBQ3hCLGtCQUFNLEVBQUUsQ0FBQztJQUNYLENBQUM7NEJBSlUsbUJBQW1CO0lBTzlCLGdEQUFrQixHQUFsQixVQUFtQixFQUFPO1FBQ3hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7OztnQkFQZSxVQUFVOztJQUsxQjtRQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztpRUFHNUM7SUFUVSxtQkFBbUI7UUFYL0IsU0FBUyxDQUFDO1lBQ1QsaURBQWlEO1lBQ2pELFFBQVEsRUFBRSxtRUFBbUU7WUFDN0UsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxxQkFBbUI7b0JBQ2hDLEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO09BQ1csbUJBQW1CLENBVS9CO0lBQUQsMEJBQUM7Q0FBQSxBQVZELENBQXlDLGFBQWEsR0FVckQ7U0FWWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFZhbHVlQWNjZXNzb3IgfSBmcm9tICcuL3ZhbHVlLWFjY2Vzc29yJztcblxuQERpcmVjdGl2ZSh7XG4gIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3IgKi9cbiAgc2VsZWN0b3I6ICdpb24tcmFuZ2UsIGlvbi1zZWxlY3QsIGlvbi1yYWRpby1ncm91cCwgaW9uLXNlZ21lbnQsIGlvbi1kYXRldGltZScsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IFNlbGVjdFZhbHVlQWNjZXNzb3IsXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgVmFsdWVBY2Nlc3NvciB7XG5cbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBzdXBlcihlbCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpb25DaGFuZ2UnLCBbJyRldmVudC50YXJnZXQnXSlcbiAgX2hhbmRsZUNoYW5nZUV2ZW50KGVsOiBhbnkpIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZUV2ZW50KGVsLCBlbC52YWx1ZSk7XG4gIH1cbn1cbiJdfQ==