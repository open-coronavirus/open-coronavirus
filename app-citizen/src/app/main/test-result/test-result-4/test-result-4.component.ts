import { Component, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { NavController } from '@ionic/angular';



@Component({
    selector: 'test-result-4',
    templateUrl: 'test-result-4.component.html',
    styleUrls: ['test-result-4.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TestResult4Component {


    constructor(
        protected location: Location,
        protected navCtrl: NavController) {


    }

    public goBack() {
        this.location.back();
    }

    public backToHome() {
        this.navCtrl.navigateBack(['/app/home']);
    }

}
