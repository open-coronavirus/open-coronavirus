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
import {HttpClientModule} from '@angular/common/http';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {AppContainerComponent} from './app-container/app-container.component';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UserService } from './shared/services/user.service';
import { AvatarModule } from './shared/avatar/avatar.module';

@NgModule({
    declarations: [AppComponent, AppContainerComponent],
    entryComponents: [],
    imports: [BrowserModule,
        HttpClientModule,
        AvatarModule,
        IonicModule.forRoot({
            mode: 'ios'
        }),
        AppRoutingModule],
    providers: [
        StatusBar,
        SplashScreen,
        sdkConfigurationProvider,
        UserService,
        NativeStorage,
        InAppBrowser,
        BarcodeScanner,
        {provide: 'environment', useValue: environment},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
