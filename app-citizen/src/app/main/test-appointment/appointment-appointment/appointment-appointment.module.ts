import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { AppointmentAppointmentComponent } from './appointment-appointment.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: AppointmentAppointmentComponent}]),
    ],
    declarations: [AppointmentAppointmentComponent]
})
export class AppointmentAppointmentModule {}
