import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {RequestLeaveHomeComponent} from './request-leave-home.component';
import {GrayOptionModule} from '../../shared/gray-option/gray-option.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        GrayOptionModule,
        QrCodeModule,
        RouterModule.forChild([{ path: '', component: RequestLeaveHomeComponent }])
    ],
    declarations: [RequestLeaveHomeComponent]
})
export class RequestLeaveHomeModule {}
