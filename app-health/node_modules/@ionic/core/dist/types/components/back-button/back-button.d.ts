import { ComponentInterface } from '../../stencil.core';
import { Color } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export declare class BackButton implements ComponentInterface, ButtonInterface {
    mode: "ios" | "md";
    el: HTMLElement;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The url to navigate back to by default when there is no history.
     */
    defaultHref?: string;
    /**
     * If `true`, the user cannot interact with the button.
     */
    disabled: boolean;
    /**
     * The icon name to use for the back button.
     */
    icon?: string | null;
    /**
     * The text to display in the back button.
     */
    text?: string | null;
    /**
     * The type of the button.
     */
    type: 'submit' | 'reset' | 'button';
    get backButtonIcon(): any;
    get backButtonText(): any;
    get hasIconOnly(): boolean;
    get rippleType(): "bounded" | "unbounded";
    private onClick;
    render(): any;
}
