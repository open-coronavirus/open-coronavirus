import { EventEmitter } from '@angular/core';
import { NavController } from '../../providers/nav-controller';
import { IonTabBar } from '../proxies';
import { IonRouterOutlet } from './ion-router-outlet';
import { StackEvent } from './stack-utils';
export declare class IonTabs {
    private navCtrl;
    outlet: IonRouterOutlet;
    tabBar: IonTabBar | undefined;
    ionTabsWillChange: EventEmitter<{
        tab: string;
    }>;
    ionTabsDidChange: EventEmitter<{
        tab: string;
    }>;
    constructor(navCtrl: NavController);
    /**
     * @internal
     */
    onPageSelected(detail: StackEvent): void;
    /**
     * When a tab button is clicked, there are several scenarios:
     * 1. If the selected tab is currently active (the tab button has been clicked
     *    again), then it should go to the root view for that tab.
     *
     *   a. Get the saved root view from the router outlet. If the saved root view
     *      matches the tabRootUrl, set the route view to this view including the
     *      navigation extras.
     *   b. If the saved root view from the router outlet does
     *      not match, navigate to the tabRootUrl. No navigation extras are
     *      included.
     *
     * 2. If the current tab tab is not currently selected, get the last route
     *    view from the router outlet.
     *
     *   a. If the last route view exists, navigate to that view including any
     *      navigation extras
     *   b. If the last route view doesn't exist, then navigate
     *      to the default tabRootUrl
     */
    select(tab: string): Promise<boolean>;
    getSelected(): string | undefined;
}
