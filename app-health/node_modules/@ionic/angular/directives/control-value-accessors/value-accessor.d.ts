import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class ValueAccessor implements ControlValueAccessor {
    protected el: ElementRef;
    private onChange;
    private onTouched;
    protected lastValue: any;
    constructor(el: ElementRef);
    writeValue(value: any): void;
    handleChangeEvent(el: HTMLElement, value: any): void;
    _handleBlurEvent(el: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
}
export declare const setIonicClasses: (element: ElementRef<any>) => void;
