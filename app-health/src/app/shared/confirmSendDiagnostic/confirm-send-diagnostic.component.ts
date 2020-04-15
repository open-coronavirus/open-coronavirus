import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataFormSendDiagnostic } from '../../app-container/diagnostic-send/diagnostic-send.component';
import { ActivatedRoute } from '@angular/router';
import { PatientWithRelations } from '../sdk/model/patientWithRelations';
import { getNameStatus } from '../utils/status-utils';
import { PatientStatus } from '../../../../../server/src/common/utils/enums';


@Component({
    selector: 'confirm-send-diagnostic',
    templateUrl: 'confirm-send-diagnostic.component.html',
    styleUrls: ['confirm-send-diagnostic.component.scss']
})
export class ConfirmSendDiagnosticComponent implements OnInit {

    dataForm: DataFormSendDiagnostic;

    public STATUS = PatientStatus;

    constructor(
        public modalCtrl: ModalController,
    ) {

    }

    ngOnInit() {

    }

    clickOK() {
        this.dismissModal(true);
    }

    clickKO() {
        this.dismissModal(false);
    }

    dismissModal(success: boolean) {
        this.modalCtrl.dismiss({ success });
    }


    getNameStatus(status: number) {
        return getNameStatus(status);
    }



}
