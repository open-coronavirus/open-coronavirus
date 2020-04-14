import { Component, Inject } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from './shared/services/patient.service';
import { StorageService } from './shared/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    protected nativeStorage: NativeStorage,
    private patientService: PatientService,
    private storageService: StorageService,
    private navCtrl: NavController,
    private router: Router,
    @Inject('settings') protected settings,
  ) {
    this.initializeApp();

    this.subscribeLoadPatient();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.checkWelcome();
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

  subscribeLoadPatient() {
    this.patientService.patientLoaded$.subscribe(loaded => {
      if (loaded && (!loaded.hasOwnProperty('redirect') || loaded.redirect)) {
        this.navCtrl.navigateRoot(['app/home']);
      }
    });
  }

  checkWelcome() {
    this.storageService.getItem('WELCOME_VISIT').subscribe(welcomeVisit => {
      if (welcomeVisit) {
        this.navCtrl.navigateRoot(['register']);
      } else {
        this.navCtrl.navigateRoot(['welcome']);
      }
    });
  }

  // Metodo para llamar cuand se reciba push informando cambio de status
  onPushReceived() {
    this.patientService.loadLocalPatient();
  }


}
