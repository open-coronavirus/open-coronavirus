import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var NumericValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(NumericValueAccessor, _super);
    function NumericValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    NumericValueAccessor_1 = NumericValueAccessor;
    NumericValueAccessor.prototype._handleIonChange = function (el) {
        this.handleChangeEvent(el, el.value);
    };
    NumericValueAccessor.prototype.registerOnChange = function (fn) {
        _super.prototype.registerOnChange.call(this, function (value) {
            fn(value === '' ? null : parseFloat(value));
        });
    };
    var NumericValueAccessor_1;
    NumericValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        HostListener('ionChange', ['$event.target'])
    ], NumericValueAccessor.prototype, "_handleIonChange", null);
    NumericValueAccessor = NumericValueAccessor_1 = tslib_1.__decorate([
        Directive({
            /* tslint:disable-next-line:directive-selector */
            selector: 'ion-input[type=number]',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: NumericValueAccessor_1,
                    multi: true
                }
            ]
        })
    ], NumericValueAccessor);
    return NumericValueAccessor;
}(ValueAccessor));
export { NumericValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtZXJpYy12YWx1ZS1hY2Nlc3Nzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvbnVtZXJpYy12YWx1ZS1hY2Nlc3Nzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFhakQ7SUFBMEMsZ0RBQWE7SUFFckQsOEJBQVksRUFBYztlQUN4QixrQkFBTSxFQUFFLENBQUM7SUFDWCxDQUFDOzZCQUpVLG9CQUFvQjtJQU8vQiwrQ0FBZ0IsR0FBaEIsVUFBaUIsRUFBTztRQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsK0NBQWdCLEdBQWhCLFVBQWlCLEVBQThCO1FBQzdDLGlCQUFNLGdCQUFnQixZQUFDLFVBQUEsS0FBSztZQUMxQixFQUFFLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OztnQkFiZSxVQUFVOztJQUsxQjtRQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnRUFHNUM7SUFUVSxvQkFBb0I7UUFYaEMsU0FBUyxDQUFDO1lBQ1QsaURBQWlEO1lBQ2pELFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxzQkFBb0I7b0JBQ2pDLEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO09BQ1csb0JBQW9CLENBZ0JoQztJQUFELDJCQUFDO0NBQUEsQUFoQkQsQ0FBMEMsYUFBYSxHQWdCdEQ7U0FoQlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi92YWx1ZS1hY2Nlc3Nvcic7XG5cbkBEaXJlY3RpdmUoe1xuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yICovXG4gIHNlbGVjdG9yOiAnaW9uLWlucHV0W3R5cGU9bnVtYmVyXScsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IE51bWVyaWNWYWx1ZUFjY2Vzc29yLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTnVtZXJpY1ZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBWYWx1ZUFjY2Vzc29yIHtcblxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKGVsKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkNoYW5nZScsIFsnJGV2ZW50LnRhcmdldCddKVxuICBfaGFuZGxlSW9uQ2hhbmdlKGVsOiBhbnkpIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZUV2ZW50KGVsLCBlbC52YWx1ZSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogbnVtYmVyIHwgbnVsbCkgPT4gdm9pZCkge1xuICAgIHN1cGVyLnJlZ2lzdGVyT25DaGFuZ2UodmFsdWUgPT4ge1xuICAgICAgZm4odmFsdWUgPT09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpKTtcbiAgICB9KTtcbiAgfVxufVxuIl19