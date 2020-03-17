import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {GrayOptionModule} from '../../shared/gray-option/gray-option.module';
import {RequestTestComponent} from './request-test.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        GrayOptionModule,
        QrCodeModule,
        RouterModule.forChild([{ path: '', component: RequestTestComponent }])
    ],
    declarations: [RequestTestComponent]
})
export class RequestTestModule {}
