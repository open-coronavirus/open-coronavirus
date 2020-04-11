import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { TrackingResult2Component } from './tracking-result-2.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: TrackingResult2Component}]),
    ],
    declarations: [TrackingResult2Component]
})
export class TrackingResult2Module {}
