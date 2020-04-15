import { Component, Inject } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from './shared/services/patient.service';
import { StorageService } from './shared/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { TestQuestionService } from './shared/services/test-question.service';
import { versionCompare } from '../../../app-health/src/app/shared/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  configuration: any = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    protected nativeStorage: NativeStorage,
    protected router: Router,
    private patientService: PatientService,
    private storageService: StorageService,
    protected testQuestionService: TestQuestionService,
    private navCtrl: NavController,
    @Inject('settings') protected settings,
  ) {



    this.initializeApp();

    this.patientService.loadLocalPatient().subscribe(loaded => {
      if (loaded) {
        this.navCtrl.navigateRoot(['app/home']);
      } else {
        this.router.navigate(['register']); // move to registration page if user is not loaded
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.configuration = {};
      this.checkUpdateApp();
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


  checkUpdateApp() {
    if ((!this.configuration.app_version_required) || versionCompare(this.settings.version, this.configuration.app_version_required) >= 0) {
      // if (!this.configuration.app_version_required || versionCompare('7.13.0', '6.400.0') <= 0) {
      console.log('No se necesita update');

      // PRUEBAS
      // TODO: $fake PRUEBAS SALTAR LOGIN
      // this.nav.setRoot(Main, {});
      this.checkWelcome();
    } else {
      console.log('Por favor actualice la app');
      // this.openPopupUpdateApp();
    }
  }

  checkWelcome() {
    this.storageService.getItem('WELCOME_VISIT').subscribe(welcomeVisit => {
      if (welcomeVisit) {
        this.navCtrl.navigateRoot(['register']);
      } else {
        this.navCtrl.navigateRoot(['welcome/0']);
      }
    });
  }

}
