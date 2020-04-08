import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DiagnosticSendComponent} from './diagnostic-send.component';
import {RouterModule} from '@angular/router';
import { CoronaHeaderModule } from '../../shared/header/header.module';
import { ConfirmSendDiagnosticModule } from '../../shared/confirmSendDiagnostic/confirm-send-diagnostic.module';
import { ConfirmSendDiagnosticComponent } from '../../shared/confirmSendDiagnostic/confirm-send-diagnostic.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        CoronaHeaderModule,
        ConfirmSendDiagnosticModule,
        RouterModule.forChild([{ path: '', component: DiagnosticSendComponent }])
    ],
    declarations: [DiagnosticSendComponent],
    entryComponents: [ConfirmSendDiagnosticComponent]
})
export class DiagnosticSendModule {}
