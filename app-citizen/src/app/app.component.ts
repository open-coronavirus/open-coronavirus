import { Component, Inject } from '@angular/core';

import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from './shared/services/patient.service';
import { StorageService } from './shared/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { TestQuestionService } from './shared/services/test-question.service';
import { versionCompare } from '../../../app-health/src/app/shared/utils/utils';
import { MinVersionControllerService } from './shared/sdk/api/minVersionController.service';
import { GetMinVersion } from './shared/sdk/model/getMinVersion';


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
    protected testQuestionService: TestQuestionService,
    private minVersionControllerService: MinVersionControllerService,
    private navCtrl: NavController,
    @Inject('settings') protected settings,
  ) {

    this.initializeApp();

    // this.patientService.loadLocalPatient().subscribe(loaded => {
    //   if (loaded) {
    //     this.navCtrl.navigateRoot(['app/home']);
    //   } else {
    //     this.router.navigate(['register']); // move to registration page if user is not loaded
    //   }
    // });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      this.getConfig();
      this.onChangeDetect();

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


  async getConfig() {
    // TEST
    // this.checkUpdateApp();

    // REAL
    this.minVersionControllerService.minVersionControllerFind().subscribe(
      res => {
        this.version = res;
        console.log("version: ", this.version);
        this.checkUpdateApp();
      },
      err => {
        console.log('error obteniendo configuration: ', err);
        this.checkUpdateApp();
      }
    );
  }

  checkUpdateApp() {
    if (((!this.version || !this.version.minVersion) || versionCompare(this.settings.appVersion, this.version.minVersion) >= 0)) {
      console.log('No se necesita update');
      this.checkWelcome();
    } else {
      console.log('Por favor actualice la app');
      this.navCtrl.navigateRoot(['update']);
    }
  }


  checkWelcome() {
    this.storageService.getItem('WELCOME_VISIT').subscribe(welcomeVisit => {
      if (welcomeVisit && false) {
        // this.navCtrl.navigateRoot(['register']);
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
