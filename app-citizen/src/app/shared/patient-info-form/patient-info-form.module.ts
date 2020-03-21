import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PatientInfoFormComponent} from './patient-info-form.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [PatientInfoFormComponent],
    exports: [PatientInfoFormComponent]
})
export class PatientInfoFormModule {}
