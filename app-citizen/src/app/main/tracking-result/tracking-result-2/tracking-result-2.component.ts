import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
    selector: 'tracking-result-2',
    templateUrl: 'tracking-result-2.component.html',
    styleUrls: ['tracking-result-2.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrackingResult2Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
