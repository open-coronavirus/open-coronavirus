import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { CheckboxChangeEventDetail, Color, StyleEventDetail } from '../../interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export declare class Checkbox implements ComponentInterface {
    private inputId;
    private buttonEl?;
    el: HTMLElement;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The name of the control, which is submitted with the form data.
     */
    name: string;
    /**
     * If `true`, the checkbox is selected.
     */
    checked: boolean;
    /**
     * If `true`, the checkbox will visually appear as indeterminate.
     */
    indeterminate: boolean;
    /**
     * If `true`, the user cannot interact with the checkbox.
     */
    disabled: boolean;
    /**
     * The value of the toggle does not mean if it's checked or not, use the `checked`
     * property for that.
     *
     * The value of a toggle is analogous to the value of a `<input type="checkbox">`,
     * it's only used when the toggle participates in a native `<form>`.
     */
    value: string;
    /**
     * Emitted when the checked property has changed.
     */
    ionChange: EventEmitter<CheckboxChangeEventDetail>;
    /**
     * Emitted when the toggle has focus.
     */
    ionFocus: EventEmitter<void>;
    /**
     * Emitted when the toggle loses focus.
     */
    ionBlur: EventEmitter<void>;
    /**
     * Emitted when the styles change.
     * @internal
     */
    ionStyle: EventEmitter<StyleEventDetail>;
    componentWillLoad(): void;
    checkedChanged(isChecked: boolean): void;
    disabledChanged(): void;
    private emitStyle;
    private setFocus;
    private onClick;
    private onFocus;
    private onBlur;
    render(): any;
}
