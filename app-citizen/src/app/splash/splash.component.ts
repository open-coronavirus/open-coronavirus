import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from '../shared/services/patient.service';
import { NavController, Platform } from '@ionic/angular';
import {StorageService} from "../shared/services/storage.service";


@Component({
    selector: 'splash',
    templateUrl: 'splash.component.html',
    styleUrls: ['splash.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SplashComponent implements OnInit {

    constructor(
        protected router: Router,
        private navCtrl: NavController,
        protected patientService: PatientService,
        public platform: Platform,
        protected storageService: StorageService) {

    }

    public ngOnInit(): void {
        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.navCtrl.navigateRoot(['app/home']);
            }
        });
    }


    clickEnter() {
        console.log("this.platform.is('cordova'): ", this.platform.is('cordova'));

        this.storageService.getItem('WELCOME_VISIT').subscribe(welcomeVisit => {
            if (welcomeVisit) {
                this.navCtrl.navigateRoot(['register']);
            } else {
                this.navCtrl.navigateRoot(['welcome']);
            }
        });

    }

}
