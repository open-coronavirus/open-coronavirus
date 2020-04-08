import { ComponentInterface } from '../../stencil.core';
import { ComponentProps, NavComponent, RouterDirection } from '../../interface';
export declare class NavLink implements ComponentInterface {
    el: HTMLElement;
    /**
     * Component to navigate to. Only used if the `routerDirection` is `"forward"` or `"root"`.
     */
    component?: NavComponent;
    /**
     * Data you want to pass to the component as props. Only used if the `"routerDirection"` is `"forward"` or `"root"`.
     */
    componentProps?: ComponentProps;
    /**
     * The transition direction when navigating to another page.
     */
    routerDirection: RouterDirection;
    private onClick;
    render(): any;
}
