import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PrivacityConditionsComponent } from '../privacity-conditions/privacity-conditions.component';


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

}
