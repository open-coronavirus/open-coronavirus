import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
    selector: 'test-result-3',
    templateUrl: 'test-result-3.component.html',
    styleUrls: ['test-result-3.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TestResult3Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public requestTest() {
        this.navCtrl.navigateForward(['/app/test-appointment/at-health-center/confirm']);
    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
