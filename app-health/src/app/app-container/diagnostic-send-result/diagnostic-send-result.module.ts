import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DiagnosticSendResultComponent} from './diagnostic-send-result.component';
import {RouterModule} from '@angular/router';
import { CoronaHeaderModule } from '../../shared/header/header.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        CoronaHeaderModule,
        RouterModule.forChild([{ path: '', component: DiagnosticSendResultComponent }])
    ],
    declarations: [DiagnosticSendResultComponent]
})
export class DiagnosticSendResultModule {}
