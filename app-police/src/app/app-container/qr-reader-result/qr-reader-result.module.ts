import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QrReaderResultComponent} from './qr-reader-result.component';
import {QrCodeModule} from '../../shared/qr-code/qr-code.module';
import {RouterModule} from '@angular/router';
import { CoronaHeaderModule } from '../../shared/header/header.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        QrCodeModule,
        CoronaHeaderModule,
        RouterModule.forChild([{ path: '', component: QrReaderResultComponent }])
    ],
    declarations: [QrReaderResultComponent]
})
export class QrReaderResultModule {}
