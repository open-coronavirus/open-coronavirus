import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {PatientInfoComponent} from './patient-info.component';
import {PatientInfoFormModule} from '../../shared/patient-info-form/patient-info-form.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        RouterModule.forChild([{path: '', component: PatientInfoComponent}]),
        PatientInfoFormModule
    ],
    declarations: [PatientInfoComponent]
})
export class PatientInfoModule {}
