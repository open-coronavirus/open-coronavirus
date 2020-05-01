import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PrivacityConditionsComponent } from '../privacity-conditions/privacity-conditions.component';
import {TermsAndConditionsComponent} from "../terms-and-conditions/terms-and-conditions.component";


@Injectable()
export class PrivacityConditionsService {

    constructor(
        private modalController: ModalController
    ) {
    }

    async showPrivacityConditions() {
        const modalPrivacityConditions = await this.modalController.create(
            {
                component: PrivacityConditionsComponent
            });

        modalPrivacityConditions.onDidDismiss()
            .then((data) => {
                console.log("cerrando popup modal Privacity Conditions: ", data);
            });
        return await modalPrivacityConditions.present();
    }

    async showTermsAndConditions() {
        const modalPrivacityConditions = await this.modalController.create(
            {
                component: TermsAndConditionsComponent
            });

        modalPrivacityConditions.onDidDismiss()
            .then((data) => {
                console.log("cerrando popup modal Privacity Conditions: ", data);
            });
        return await modalPrivacityConditions.present();
    }

}
