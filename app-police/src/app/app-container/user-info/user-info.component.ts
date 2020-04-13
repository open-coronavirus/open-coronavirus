import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {

    public user: any;
    public userName: string;

    constructor(
        public userService: UserService,
        public toastController: ToastController,
        protected navCtrl: NavController) { }


    ngOnInit() {
        this.user = this.userService.user;
        if (this.user) {
            this.userName = this.user.firstName + ' ' + this.user.lastName;
        }
    }

    public goBack() {
        this.navCtrl.back();
    }

    public goExit() {
        this.userService.user = null;
        this.navCtrl.navigateRoot(['login']);
    }

}
