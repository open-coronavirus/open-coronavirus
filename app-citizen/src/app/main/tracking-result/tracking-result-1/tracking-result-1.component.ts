import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
    selector: 'tracking-result-1',
    templateUrl: 'tracking-result-1.component.html',
    styleUrls: ['tracking-result-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrackingResult1Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
