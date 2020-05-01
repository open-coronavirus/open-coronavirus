import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'terms-and-conditions.component.html',
    styleUrls: ['terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent {

    typeAddress: string;

    constructor(
        public modalCtrl: ModalController
    ) {

    }


    dismissModal() {
        this.modalCtrl.dismiss({});
    }


}
