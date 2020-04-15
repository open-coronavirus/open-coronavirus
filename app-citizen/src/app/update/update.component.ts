import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { PatientService } from '../shared/services/patient.service';

@Component({
    selector: 'update',
    templateUrl: 'update.component.html',
    styleUrls: ['update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UpdateComponent {


    public constructor(
        protected router: Router,
        private navCtrl: NavController,
        private patientService: PatientService,
        protected platform: Platform,
        @Inject('settings') protected settings) {

    }


    goUpdate() {
        let url;
        if (this.platform.is('android')) {
            url = this.settings.stores.urlGooglePlay;
        } else {
            url = this.settings.stores.urlAppStore;
        }
        window.open(url, '_system');
    }

    cancel() {
        this.loadPatient();
    }

    loadPatient() {
        this.patientService.loadLocalPatient().subscribe(loaded => {
            if (loaded) {
                this.navCtrl.navigateRoot(['app/home']);
            } else {
                this.router.navigate(['register']); // move to registration page if user is not loaded
            }
        });
    }

}
