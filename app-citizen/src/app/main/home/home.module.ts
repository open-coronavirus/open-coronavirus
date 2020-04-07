import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './home.component';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { CoronaHeaderModule } from '../../shared/corona-header/corona-header.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        CoronaHeaderModule,
        RouterModule.forChild([{ path: '', component: HomeComponent }])
    ],
    declarations: [HomeComponent]
})
export class HomeModule {}
