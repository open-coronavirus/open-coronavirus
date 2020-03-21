import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {LeaveCustomReasonFormComponent} from './leave-custom-reason-form.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        RouterModule.forChild([{path: '', component: LeaveCustomReasonFormComponent}]),
    ],
    declarations: [LeaveCustomReasonFormComponent]
})
export class LeaveCustomReasonFormModule {}
