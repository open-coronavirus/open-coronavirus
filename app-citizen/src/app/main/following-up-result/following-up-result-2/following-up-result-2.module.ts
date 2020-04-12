import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { FollowingUpResult2Component } from './following-up-result-2.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: FollowingUpResult2Component}]),
    ],
    declarations: [FollowingUpResult2Component]
})
export class FollowingUpResult2Module {}
