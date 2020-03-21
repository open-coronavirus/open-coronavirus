import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {RequestTestAppointmentComponent} from "./request-test-appointment.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: RequestTestAppointmentComponent}]),
    ],
    declarations: [RequestTestAppointmentComponent]
})
export class RequestTestAppointmentModule {}
