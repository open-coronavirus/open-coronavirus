import { EventEmitter } from '../stencil.core';
import { Side } from '../interface';
/**
 * Patched version of requestAnimationFrame that avoids ngzone
 * Use only when you know ngzone should not run
 */
export declare const raf: (h: any) => any;
export declare const hasShadowDom: (el: HTMLElement) => boolean;
export declare const findItemLabel: (componentEl: HTMLElement) => HTMLIonLabelElement | null;
export declare const renderHiddenInput: (always: boolean, container: HTMLElement, name: string, value: string | null | undefined, disabled: boolean) => void;
export declare const clamp: (min: number, n: number, max: number) => number;
export declare const assert: (actual: any, reason: string) => void;
export declare const now: (ev: UIEvent) => number;
export declare const pointerCoord: (ev: any) => {
    x: number;
    y: number;
};
/**
 * @hidden
 * Given a side, return if it should be on the end
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 */
export declare const isEndSide: (side: Side) => boolean;
export declare const deferEvent: (event: EventEmitter<any>) => EventEmitter<any>;
export declare const debounceEvent: (event: EventEmitter<any>, wait: number) => EventEmitter<any>;
export declare const debounce: (func: (...args: any[]) => void, wait?: number) => (...args: any[]) => any;
