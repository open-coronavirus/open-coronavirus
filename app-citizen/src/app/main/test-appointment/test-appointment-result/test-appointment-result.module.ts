import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TestAppointmentResultComponent} from "./test-appointment-result.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: TestAppointmentResultComponent}]),
    ],
    declarations: [TestAppointmentResultComponent]
})
export class TestAppointmentResultModule {}
