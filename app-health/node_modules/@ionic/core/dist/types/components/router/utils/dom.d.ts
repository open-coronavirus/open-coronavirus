import { NavOutletElement, RouteChain, RouteID, RouterDirection } from '../../../interface';
export declare const writeNavState: (root: HTMLElement | undefined, chain: RouteChain, direction: RouterDirection, index: number, changed?: boolean) => Promise<boolean>;
export declare const readNavState: (root: HTMLElement | undefined) => Promise<{
    ids: RouteID[];
    outlet: NavOutletElement | undefined;
}>;
export declare const waitUntilNavNode: () => Promise<unknown>;
