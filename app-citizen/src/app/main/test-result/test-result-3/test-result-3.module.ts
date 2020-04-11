import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { TestResult3Component } from './test-result-3.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: TestResult3Component}]),
    ],
    declarations: [TestResult3Component]
})
export class TestResult3Module {}
