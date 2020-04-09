import { CssClassMap, RouterDirection } from '../interface';
export declare const hostContext: (selector: string, el: HTMLElement) => boolean;
/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export declare const createColorClasses: (color: string | null | undefined) => CssClassMap | undefined;
export declare const getClassList: (classes: string | (string | null | undefined)[] | undefined) => string[];
export declare const getClassMap: (classes: string | string[] | undefined) => CssClassMap;
export declare const openURL: (url: string | null | undefined, ev: Event | null | undefined, direction: RouterDirection) => Promise<boolean>;
