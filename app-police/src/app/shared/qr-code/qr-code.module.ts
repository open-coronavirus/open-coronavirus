import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QrCodeComponent} from './qr-code.component';
import {NgxQRCodeModule} from 'ngx-qrcode2';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxQRCodeModule
    ],
    declarations: [QrCodeComponent],
    exports: [QrCodeComponent]
})
export class QrCodeModule {}
