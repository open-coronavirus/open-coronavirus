import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QrCodeComponent} from './qr-code.component';
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        QRCodeModule
    ],
    declarations: [QrCodeComponent],
    exports: [QrCodeComponent]
})
export class QrCodeModule {}
