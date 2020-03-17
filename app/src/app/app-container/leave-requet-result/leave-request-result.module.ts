import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {PatientInfoFormModule} from '../../shared/patient-info-form/patient-info-form.module';
import {LeaveRequestResultComponent} from './leave-request-result.component';
import {GrayOptionModule} from '../../shared/gray-option/gray-option.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        GrayOptionModule,
        RouterModule.forChild([{path: '', component: LeaveRequestResultComponent}]),
        PatientInfoFormModule
    ],
    declarations: [LeaveRequestResultComponent]
})
export class LeaveRequestResultModule {}
