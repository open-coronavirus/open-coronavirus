import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PatientInfoFormModule} from '../shared/patient-info-form/patient-info-form.module';
import {UpdateComponent} from './update.component';
import { CoronaHeaderModule } from '../shared/corona-header/corona-header.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PatientInfoFormModule,
        FormsModule,
        CoronaHeaderModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: UpdateComponent }])
    ],
    declarations: [UpdateComponent]
})
export class UpdateModule {}
