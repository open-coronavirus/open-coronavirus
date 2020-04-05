import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {  UserInfoComponent } from './user-info.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        RouterModule.forChild([{path: '', component: UserInfoComponent}])
    ],
    declarations: [UserInfoComponent]
})
export class UserInfoModule {}
