import { ComponentInterface } from '../../stencil.core';
export declare class SelectOption implements ComponentInterface {
    private inputId;
    el: HTMLElement;
    /**
     * If `true`, the user cannot interact with the select option.
     */
    disabled: boolean;
    /**
     * The text value of the option.
     */
    value?: any | null;
    render(): any;
}
