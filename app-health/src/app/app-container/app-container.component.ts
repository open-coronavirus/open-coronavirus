import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UserService } from '../shared/services/user.service';
import { PoliceOfficerWithRelations } from '../shared/sdk/model/policeOfficerWithRelations';

@Component({
    selector: 'app-container',
    templateUrl: 'app-container.component.html',
    styleUrls: ['app-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppContainerComponent implements OnInit {

    public user: PoliceOfficerWithRelations;
    public userName: string;

    constructor(
        protected menu: MenuController,
        protected router: Router,
        private navCtrl: NavController,
        protected userService: UserService,
        protected iab: InAppBrowser) {
    }

    ngOnInit() {
        this.user = this.userService.user;
        if (this.user) {
            this.userName = this.user.firstName + ' ' + this.user.lastName;
        }
    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    closeMenu() {
        this.menu.close('menu');
    }

    public goToIdentity() {
        this.closeMenu();
        this.router.navigate(['/app/qr-reader']);
    }

    public goToMyInfo() {
        this.closeMenu();
        this.router.navigate(['/app/my-info']);
    }

    public goExit() {
        this.closeMenu();
        this.userService.user = null;
        this.navCtrl.navigateRoot(['login']);
    }

}
