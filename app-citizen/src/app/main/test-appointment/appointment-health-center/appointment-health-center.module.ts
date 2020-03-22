import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppointmentHealthCenterComponent} from "./appointment-health-center.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: AppointmentHealthCenterComponent}]),
    ],
    declarations: [AppointmentHealthCenterComponent]
})
export class AppointmentHealthCenterModule {}
