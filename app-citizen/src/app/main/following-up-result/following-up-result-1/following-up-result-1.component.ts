import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
    selector: 'following-up-result-1',
    templateUrl: 'following-up-result-1.component.html',
    styleUrls: ['following-up-result-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FollowingUpResult1Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
