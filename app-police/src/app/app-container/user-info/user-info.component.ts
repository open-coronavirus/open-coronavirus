import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent {

    constructor(
        public userService: UserService,
        public toastController: ToastController,
        protected navCtrl: NavController) { }




    public goBack() {
        this.navCtrl.back();
    }

}
