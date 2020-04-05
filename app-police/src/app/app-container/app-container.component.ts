import {Component, ViewEncapsulation} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { UserService } from '../shared/services/user.service';

@Component({
    selector: 'app-container',
    templateUrl: 'app-container.component.html',
    styleUrls: ['app-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppContainerComponent {

    public leaveStatus: number;

    public patientName;

    constructor(protected menu: MenuController,
                protected router: Router,
                protected userService: UserService,
                protected iab: InAppBrowser) {
    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    closeMenu() {
        this.menu.close('menu');
    }

    public goToHome() {
        this.closeMenu();
        this.router.navigate(['/app/home']);
    }

    public goToRequestLeaveHome() {
        this.closeMenu();
        this.router.navigate(['/app/request-leave-home']);
    }
    public goToAutotest() {
        this.closeMenu();
        this.router.navigate(['/app/autotest']);
    }

    public goToCoronavirusInfo() {
        this.closeMenu();
        window.open("https://coronavirus.epidemixs.org/#/opening", '_system');
    }

    public goToMyInfo() {
        this.closeMenu();
        this.router.navigate(['/app/my-info'])
    }

}
