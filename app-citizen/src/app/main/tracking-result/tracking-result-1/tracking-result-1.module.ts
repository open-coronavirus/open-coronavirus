import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { TrackingResult1Component } from './tracking-result-1.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: TrackingResult1Component}]),
    ],
    declarations: [TrackingResult1Component]
})
export class TrackingResult1Module {}
