import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PatientInfoFormModule} from '../shared/patient-info-form/patient-info-form.module';
import {NoAccessComponent} from './no-access.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PatientInfoFormModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: NoAccessComponent }])
    ],
    declarations: [NoAccessComponent]
})
export class NoAccessModule {}
