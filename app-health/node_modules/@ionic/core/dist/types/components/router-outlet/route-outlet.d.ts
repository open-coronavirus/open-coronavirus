import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { AnimationBuilder, ComponentProps, FrameworkDelegate, NavOutlet, RouteID, RouteWrite, RouterDirection, RouterOutletOptions, SwipeGestureHandler } from '../../interface';
export declare class RouterOutlet implements ComponentInterface, NavOutlet {
    private activeEl;
    private activeComponent;
    private waitPromise?;
    private gesture?;
    private ani?;
    private animationEnabled;
    el: HTMLElement;
    /**
     * The mode determines which platform styles to use.
     */
    mode: "ios" | "md";
    /** @internal */
    delegate?: FrameworkDelegate;
    /**
     * If `true`, the router-outlet should animate the transition of components.
     */
    animated: boolean;
    /**
     * By default `ion-nav` animates transition between pages based in the mode (ios or material design).
     * However, this property allows to create custom transition using `AnimateBuilder` functions.
     */
    animation?: AnimationBuilder;
    /** @internal */
    swipeHandler?: SwipeGestureHandler;
    swipeHandlerChanged(): void;
    /** @internal */
    ionNavWillLoad: EventEmitter<void>;
    /** @internal */
    ionNavWillChange: EventEmitter<void>;
    /** @internal */
    ionNavDidChange: EventEmitter<void>;
    connectedCallback(): Promise<void>;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    /** @internal */
    commit(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts?: RouterOutletOptions): Promise<boolean>;
    /** @internal */
    setRouteId(id: string, params: ComponentProps | undefined, direction: RouterDirection): Promise<RouteWrite>;
    /** @internal */
    getRouteId(): Promise<RouteID | undefined>;
    private setRoot;
    private transition;
    private lock;
    render(): any;
}
