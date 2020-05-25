import {Component, Inject} from '@angular/core';

import {Platform, NavController, ModalController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {PatientService} from './shared/services/patient.service';
import {StorageService} from './shared/services/storage.service';
import {Router, NavigationEnd} from '@angular/router';
import {TestQuestionService} from './shared/services/test-question.service';
import {MinVersionControllerService} from './shared/sdk/api/minVersionController.service';
import {GetMinVersion} from './shared/sdk/model/getMinVersion';
import {versionCompare} from '../../../app-health/src/app/shared/utils/utils';
import {BackgroundFetchService} from "./shared/services/background-fetch.service";


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    version: GetMinVersion;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        protected nativeStorage: NativeStorage,
        protected router: Router,
        private patientService: PatientService,
        private storageService: StorageService,
        protected backgroundFetchService: BackgroundFetchService,
        protected testQuestionService: TestQuestionService,
        private minVersionControllerService: MinVersionControllerService,
        private navCtrl: NavController,
        @Inject('settings') protected settings,
    ) {

        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.checkUpdateApp();
            this.onChangeDetect();
            //also start background fetch services:
            this.backgroundFetchService.startBackgroundFetchServices();
        });
    }

    onChangeDetect() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            this.setHeaderBgColor();
        });
    }

    setHeaderBgColor() {
        if (!this.settings.header.bgcolor) {
            return;
        }
        const elements: any = document.querySelectorAll('.header-app');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.setProperty('--background', this.settings.header.bgcolor);
        }
    }

    async checkUpdateApp() {
        this.minVersionControllerService.minVersionControllerFind().subscribe(
            version => {
                let versionRegExp = new RegExp('^\d+\.\d+\.\d+$');
                if (versionRegExp.test(this.settings.appVersion) && !versionCompare(version.minVersion, this.settings.appVersion)) {
                    // console.log('Por favor actualice la app');
                    this.navCtrl.navigateRoot(['update']);
                } else {
                    //  console.log('No se necesita update');
                    this.checkWelcome();
                }

            },
            err => {
                console.log('error obteniendo checkUpdateApp: ', err);
                this.checkWelcome();
            }
        );
    }

    checkWelcome() {
        this.storageService.getItem('WELCOME_VISIT').then(welcomeVisit => {
            if (welcomeVisit) {
                this.loadPatient();
            } else {
                this.navCtrl.navigateRoot(['welcome/0']);
            }
        });
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
