import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register.component';
import {PatientInfoFormModule} from '../shared/patient-info-form/patient-info-form.module';
import { CoronaHeaderModule } from '../shared/corona-header/corona-header.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PatientInfoFormModule,
        FormsModule,
        ReactiveFormsModule,
        CoronaHeaderModule,
        RouterModule.forChild([{ path: '', component: RegisterComponent }])
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule {}
