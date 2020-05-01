import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register.component';
import {PatientInfoFormModule} from '../shared/patient-info-form/patient-info-form.module';
import { CoronaHeaderModule } from '../shared/corona-header/corona-header.module';
import { PrivacityConditionsComponent } from '../shared/privacity-conditions/privacity-conditions.component';
import { PrivacityConditionsModule } from '../shared/privacity-conditions/privacity-conditions.module';
import {TermsAndConditionsModule} from "../shared/terms-and-conditions/terms-and-conditions.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PatientInfoFormModule,
        FormsModule,
        ReactiveFormsModule,
        CoronaHeaderModule,
        PrivacityConditionsModule,
        TermsAndConditionsModule,
        RouterModule.forChild([{ path: '', component: RegisterComponent }])
    ],
    declarations: [RegisterComponent],
    entryComponents: [PrivacityConditionsComponent]
})
export class RegisterModule {}
