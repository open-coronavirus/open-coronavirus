import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

    public leaveStatus: number;

    public leaveReason: string;

    public patientName: string;

    constructor(protected router: Router,
                public userService: UserService,
                protected menu: MenuController,
                protected inAppBrowser: InAppBrowser) {
    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    public goToRequestLeaveHome() {
        this.router.navigate(['/app/request-leave-home'])
    }

    public goToAutotest() {
        this.router.navigate(['/app/autotest'])
    }

    public goToCoronavirusInfo() {
        window.open("https://coronavirus.epidemixs.org/#/opening", '_system');
    }

}
