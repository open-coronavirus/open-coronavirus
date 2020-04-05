import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/sdk/model/user';

@Component({
    selector: 'user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {

    user: User;

    constructor(
        public userService: UserService,
        public toastController: ToastController,
        protected navCtrl: NavController) { }


    ngOnInit() {
        this.user = this.userService.user;
        console.log("user profile: ", this.user);
    }



    public goBack() {
        this.navCtrl.back();
    }

}
