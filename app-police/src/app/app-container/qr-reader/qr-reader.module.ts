import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrReaderComponent} from './qr-reader.component';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        RouterModule.forChild([{ path: '', component: QrReaderComponent }])
    ],
    declarations: [QrReaderComponent]
})
export class QrReaderModule {}
