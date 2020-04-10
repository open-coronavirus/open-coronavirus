import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {sdkConfigurationProvider} from './shared/sdkconfiguration.provider';
import {environment} from '../environments/environment';
import {PatientService} from './shared/services/patient.service';
import {HttpClientModule} from '@angular/common/http';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {MainComponent} from './main/main.component';
import {ShareService} from './shared/services/share.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {LeaveRequestService} from './shared/services/leave-request.service';
import {PermissionsService} from './shared/services/permissionsService.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {AutotestAnswers} from './shared/services/autotest-answers.service';
import {TestAppointmentService} from "./shared/services/test-appointment.service";
import {TestResultService} from "./shared/services/test-result.service";
import {I18nStringsModule} from "./shared/i18n-strings/i18n-strings.module";
import {settings} from "../environments/settings";
import {StorageService} from "./shared/services/storage.service";
import { PrivacityConditionsService } from './shared/services/privacityConditions.service';
import { PrivacityConditionsComponent } from './shared/privacity-conditions/privacity-conditions.component';
import {BluetoothTrackingService} from "./shared/services/tracking/bluetooth-tracking.service";
import {GeolocationTrackingService} from "./shared/services/tracking/geolocation-tracking.service";
import {BluetoothLE} from '@ionic-native/bluetooth-le/ngx';
import {BLE} from "@ionic-native/ble/ngx";
import {SQLite} from "@ionic-native/sqlite/ngx";
import {ContactTrackerService} from "./shared/services/contacts/contact-tracker.service";

@NgModule({
    declarations: [AppComponent, MainComponent],
    entryComponents: [PrivacityConditionsComponent],
    imports: [BrowserModule,
        HttpClientModule,
        I18nStringsModule,
        IonicModule.forRoot({
            mode: 'ios'
        }),
        AppRoutingModule],
    providers: [
        StatusBar,
        SplashScreen,
        BluetoothLE,
        sdkConfigurationProvider,
        PatientService,
        LeaveRequestService,
        PermissionsService,
        StorageService,
        NativeStorage,
        SQLite,
        ShareService,
        ContactTrackerService,
        BluetoothTrackingService,
        BLE,
        GeolocationTrackingService,
        AutotestAnswers,
        TestAppointmentService,
        TestResultService,
        InAppBrowser,
        SocialSharing,
        PrivacityConditionsService,
        {provide: 'environment', useValue: environment},
        {provide: 'settings', useValue: settings},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent],

})
export class AppModule {
}
