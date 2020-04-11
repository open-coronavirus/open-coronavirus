import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
    selector: 'test-result-1',
    templateUrl: 'test-result-1.component.html',
    styleUrls: ['test-result-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TestResult1Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
