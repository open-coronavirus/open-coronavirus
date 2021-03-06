import { Component, ViewEncapsulation, OnInit, Input, Inject } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
    selector: 'corona-header',
    templateUrl: 'corona-header.component.html',
    styleUrls: ['corona-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CoronaHeaderComponent implements OnInit {

    @Input() showMenu: any;

    constructor(
        protected menu: MenuController,
        @Inject('settings') public settings
    ) {

    }

    public ngOnInit() {

    }


    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }
}
