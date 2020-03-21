import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import {AutotestComponent} from './autotest.component';
import {GrayOptionModule} from '../../shared/gray-option/gray-option.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        GrayOptionModule,
        RouterModule.forChild([{ path: '', component: AutotestComponent }])
    ],
    declarations: [AutotestComponent]
})
export class AutotestModule {}
