import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'privacity-conditions.component.html',
    styleUrls: ['privacity-conditions.component.scss'],
})
export class PrivacityConditionsComponent {

    typeAddress: string;

    constructor(
        public modalCtrl: ModalController
    ) {

    }


    dismissModal() {
        this.modalCtrl.dismiss({});
    }


}
