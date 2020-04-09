import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from '../shared/services/patient.service';
import { NavController, Platform } from '@ionic/angular';


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
        protected nativeStorage: NativeStorage) {

    }

    public ngOnInit(): void {
        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.router.navigate(['app/home']);
            }
        });
    }


    clickEnter() {
        console.log("this.platform.is('cordova'): ", this.platform.is('cordova'));
        if (this.platform.is('cordova')) {
            this.nativeStorage.getItem('WELCOME_VISIT').then(welcomeVisit => {
                if (welcomeVisit) {
                    this.navCtrl.navigateRoot(['register']);
                } else {
                    this.navCtrl.navigateRoot(['welcome']);
                }
            });
        } else {
            this.navCtrl.navigateRoot(['welcome']);
        }

    }

}
