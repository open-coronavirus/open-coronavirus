import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { Color, StyleEventDetail, TextareaChangeEventDetail } from '../../interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export declare class Textarea implements ComponentInterface {
    private nativeInput?;
    private inputId;
    private didBlurAfterEdit;
    el: HTMLElement;
    hasFocus: boolean;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
     */
    autocapitalize: string;
    /**
     * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
     */
    autofocus: boolean;
    /**
     * If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
     */
    clearOnEdit: boolean;
    /**
     * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
     */
    debounce: number;
    protected debounceChanged(): void;
    /**
     * If `true`, the user cannot interact with the textarea.
     */
    disabled: boolean;
    protected disabledChanged(): void;
    /**
     * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
     */
    maxlength?: number;
    /**
     * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
     */
    minlength?: number;
    /**
     * The name of the control, which is submitted with the form data.
     */
    name: string;
    /**
     * Instructional text that shows before the input has a value.
     */
    placeholder?: string | null;
    /**
     * If `true`, the user cannot modify the value.
     */
    readonly: boolean;
    /**
     * If `true`, the user must fill in a value before submitting a form.
     */
    required: boolean;
    /**
     * If `true`, the element will have its spelling and grammar checked.
     */
    spellcheck: boolean;
    /**
     * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
     */
    cols?: number;
    /**
     * The number of visible text lines for the control.
     */
    rows?: number;
    /**
     * Indicates how the control wraps text.
     */
    wrap?: 'hard' | 'soft' | 'off';
    /**
     * If `true`, the element height will increase based on the value.
     */
    autoGrow: boolean;
    /**
     * The value of the textarea.
     */
    value?: string | null;
    /**
     * Update the native input element when the value changes
     */
    protected valueChanged(): void;
    /**
     * Emitted when the input value has changed.
     */
    ionChange: EventEmitter<TextareaChangeEventDetail>;
    /**
     * Emitted when a keyboard input occurred.
     */
    ionInput: EventEmitter<KeyboardEvent>;
    /**
     * Emitted when the styles change.
     * @internal
     */
    ionStyle: EventEmitter<StyleEventDetail>;
    /**
     * Emitted when the input loses focus.
     */
    ionBlur: EventEmitter<void>;
    /**
     * Emitted when the input has focus.
     */
    ionFocus: EventEmitter<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    componentDidLoad(): void;
    private runAutoGrow;
    /**
     * Sets focus on the specified `ion-textarea`. Use this method instead of the global
     * `input.focus()`.
     */
    setFocus(): Promise<void>;
    /**
     * Returns the native `<textarea>` element used under the hood.
     */
    getInputElement(): Promise<HTMLTextAreaElement>;
    private emitStyle;
    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     */
    private checkClearOnEdit;
    private focusChange;
    private hasValue;
    private getValue;
    private onInput;
    private onFocus;
    private onBlur;
    private onKeyDown;
    render(): any;
}
