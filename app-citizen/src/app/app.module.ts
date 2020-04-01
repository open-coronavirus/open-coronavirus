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
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {AutotestAnswers} from './shared/services/autotest-answers.service';
import {TestAppointmentService} from "./shared/services/test-appointment.service";
import {TestResultService} from "./shared/services/test-result.service";
import {I18nStringsModule} from "./shared/i18n-strings/i18n-strings.module";

@NgModule({
    declarations: [AppComponent, MainComponent],
    entryComponents: [],
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
        sdkConfigurationProvider,
        PatientService,
        LeaveRequestService,
        NativeStorage,
        ShareService,
        AutotestAnswers,
        TestAppointmentService,
        TestResultService,
        InAppBrowser,
        SocialSharing,
        {provide: 'environment', useValue: environment},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
