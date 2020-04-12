import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { NavController } from '@ionic/angular';



@Component({
    selector: 'following-up-result-2',
    templateUrl: 'following-up-result-2.component.html',
    styleUrls: ['following-up-result-2.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FollowingUpResult2Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
