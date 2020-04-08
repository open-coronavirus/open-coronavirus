import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmSendDiagnosticComponent} from './confirm-send-diagnostic.component';
import {NgxQRCodeModule} from 'ngx-qrcode2';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxQRCodeModule
    ],
    declarations: [ConfirmSendDiagnosticComponent],
    exports: [ConfirmSendDiagnosticComponent]
})
export class ConfirmSendDiagnosticModule {}
