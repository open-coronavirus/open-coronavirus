import * as tslib_1 from "tslib";
import { HostListener } from '@angular/core';
import { raf } from '../../util/util';
var ValueAccessor = /** @class */ (function () {
    function ValueAccessor(el) {
        this.el = el;
        this.onChange = function () { };
        this.onTouched = function () { };
    }
    ValueAccessor.prototype.writeValue = function (value) {
        /**
         * TODO for Ionic 6:
         * Change `value == null ? '' : value;`
         * to `value`. This was a fix for IE9, but IE9
         * is no longer supported; however, this change
         * is potentially a breaking change
         */
        this.el.nativeElement.value = this.lastValue = value == null ? '' : value;
        setIonicClasses(this.el);
    };
    ValueAccessor.prototype.handleChangeEvent = function (el, value) {
        if (el === this.el.nativeElement) {
            if (value !== this.lastValue) {
                this.lastValue = value;
                this.onChange(value);
            }
            setIonicClasses(this.el);
        }
    };
    ValueAccessor.prototype._handleBlurEvent = function (el) {
        if (el === this.el.nativeElement) {
            this.onTouched();
            setIonicClasses(this.el);
        }
    };
    ValueAccessor.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    ValueAccessor.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    ValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this.el.nativeElement.disabled = isDisabled;
    };
    tslib_1.__decorate([
        HostListener('ionBlur', ['$event.target'])
    ], ValueAccessor.prototype, "_handleBlurEvent", null);
    return ValueAccessor;
}());
export { ValueAccessor };
export var setIonicClasses = function (element) {
    raf(function () {
        var input = element.nativeElement;
        var classes = getClasses(input);
        setClasses(input, classes);
        var item = input.closest('ion-item');
        if (item) {
            setClasses(item, classes);
        }
    });
};
var getClasses = function (element) {
    var classList = element.classList;
    var classes = [];
    for (var i = 0; i < classList.length; i++) {
        var item = classList.item(i);
        if (item !== null && startsWith(item, 'ng-')) {
            classes.push("ion-" + item.substr(3));
        }
    }
    return classes;
};
var ɵ0 = getClasses;
var setClasses = function (element, classes) {
    var classList = element.classList;
    [
        'ion-valid',
        'ion-invalid',
        'ion-touched',
        'ion-untouched',
        'ion-dirty',
        'ion-pristine'
    ].forEach(function (c) { return classList.remove(c); });
    classes.forEach(function (c) { return classList.add(c); });
};
var ɵ1 = setClasses;
var startsWith = function (input, search) {
    return input.substr(0, search.length) === search;
};
var ɵ2 = startsWith;
export { ɵ0, ɵ1, ɵ2 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvdmFsdWUtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBYyxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXRDO0lBTUUsdUJBQXNCLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBSjVCLGFBQVEsR0FBeUIsY0FBVyxDQUFDLENBQUM7UUFDOUMsY0FBUyxHQUFlLGNBQVcsQ0FBQyxDQUFDO0lBR04sQ0FBQztJQUV4QyxrQ0FBVSxHQUFWLFVBQVcsS0FBVTtRQUNuQjs7Ozs7O1dBTUc7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMxRSxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCx5Q0FBaUIsR0FBakIsVUFBa0IsRUFBZSxFQUFFLEtBQVU7UUFDM0MsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7WUFDaEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7WUFDRCxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUdELHdDQUFnQixHQUFoQixVQUFpQixFQUFPO1FBQ3RCLElB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bmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IHJhZiB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4gey8qKi99O1xuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHsvKiovfTtcbiAgcHJvdGVjdGVkIGxhc3RWYWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbDogRWxlbWVudFJlZikge31cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAvKipcbiAgICAgKiBUT0RPIGZvciBJb25pYyA2OlxuICAgICAqIENoYW5nZSBgdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7YFxuICAgICAqIHRvIGB2YWx1ZWAuIFRoaXMgd2FzIGEgZml4IGZvciBJRTksIGJ1dCBJRTlcbiAgICAgKiBpcyBubyBsb25nZXIgc3VwcG9ydGVkOyBob3dldmVyLCB0aGlzIGNoYW5nZVxuICAgICAqIGlzIHBvdGVudGlhbGx5IGEgYnJlYWtpbmcgY2hhbmdlXG4gICAgICovXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICBzZXRJb25pY0NsYXNzZXModGhpcy5lbCk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2VFdmVudChlbDogSFRNTEVsZW1lbnQsIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAoZWwgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLmxhc3RWYWx1ZSkge1xuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHNldElvbmljQ2xhc3Nlcyh0aGlzLmVsKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpb25CbHVyJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIF9oYW5kbGVCbHVyRXZlbnQoZWw6IGFueSkge1xuICAgIGlmIChlbCA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgICAgc2V0SW9uaWNDbGFzc2VzKHRoaXMuZWwpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2V0SW9uaWNDbGFzc2VzID0gKGVsZW1lbnQ6IEVsZW1lbnRSZWYpID0+IHtcbiAgcmFmKCgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBjbGFzc2VzID0gZ2V0Q2xhc3NlcyhpbnB1dCk7XG4gICAgc2V0Q2xhc3NlcyhpbnB1dCwgY2xhc3Nlcyk7XG5cbiAgICBjb25zdCBpdGVtID0gaW5wdXQuY2xvc2VzdCgnaW9uLWl0ZW0nKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgc2V0Q2xhc3NlcyhpdGVtLCBjbGFzc2VzKTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0Q2xhc3NlcyA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICBjb25zdCBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgY29uc3QgY2xhc3NlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGl0ZW0gPSBjbGFzc0xpc3QuaXRlbShpKTtcbiAgICBpZiAoaXRlbSAhPT0gbnVsbCAmJiBzdGFydHNXaXRoKGl0ZW0sICduZy0nKSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKGBpb24tJHtpdGVtLnN1YnN0cigzKX1gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNsYXNzZXM7XG59O1xuXG5jb25zdCBzZXRDbGFzc2VzID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjbGFzc2VzOiBzdHJpbmdbXSkgPT4ge1xuICBjb25zdCBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgW1xuICAgICdpb24tdmFsaWQnLFxuICAgICdpb24taW52YWxpZCcsXG4gICAgJ2lvbi10b3VjaGVkJyxcbiAgICAnaW9uLXVudG91Y2hlZCcsXG4gICAgJ2lvbi1kaXJ0eScsXG4gICAgJ2lvbi1wcmlzdGluZSdcbiAgXS5mb3JFYWNoKGMgPT4gY2xhc3NMaXN0LnJlbW92ZShjKSk7XG5cbiAgY2xhc3Nlcy5mb3JFYWNoKGMgPT4gY2xhc3NMaXN0LmFkZChjKSk7XG59O1xuXG5jb25zdCBzdGFydHNXaXRoID0gKGlucHV0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpbnB1dC5zdWJzdHIoMCwgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbn07XG4iXX0=