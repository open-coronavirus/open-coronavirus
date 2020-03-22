import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppointmentAtHomeComponent} from "./appointment-at-home.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: AppointmentAtHomeComponent}]),
    ],
    declarations: [AppointmentAtHomeComponent]
})
export class AppointmentAtHomeModule {}
