import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavigationExtras } from '@angular/router';
import { LoadingController, NavController, ModalController } from '@ionic/angular';
import { PatientControllerService } from 'src/app/shared/sdk/api/patientController.service';
import { ConfirmSendDiagnosticComponent } from '../../shared/confirmSendDiagnostic/confirm-send-diagnostic.component';
import { getNameStatus } from '../../shared/utils/status-utils';

export interface DataFormSendDiagnostic {
    identifier: string;
    status: number;

    error_identifier: boolean;
    error_status: boolean;

    intent_send: boolean;
}

@Component({
    selector: 'diagnostic-send',
    templateUrl: 'diagnostic-send.component.html',
    styleUrls: ['diagnostic-send.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DiagnosticSendComponent implements OnInit {

    dataForm: DataFormSendDiagnostic;
    patientError: boolean;

    constructor(
        public navCtrl: NavController,
        public patientControllerService: PatientControllerService,
        protected barcodeScanner: BarcodeScanner,
        public loadingController: LoadingController,
        public modalController: ModalController,
        protected location: Location) {

    }

    ngOnInit() {
        this.createDataForm();
    }

    createDataForm() {
        this.dataForm = {
            identifier: '',
            status: 1,

            error_identifier: false,
            error_status: false,

            intent_send: false
        };
        this.patientError = false;
    }

    setStatus(status) {
        this.dataForm.status = status;
    }

    onKeyPressed(event) {
        if (event.key === 'Enter' || event.keyCode === 'Enter') {
            this.clickSend();
        }
    }

    onKeyUp() {
        this.isValidForm();
    }

    clickSend() {
        this.dataForm.intent_send = true;
        if (this.isValidForm()) {
            this.showConfirmation();
        }
    }

    isValidForm(): boolean {
        this.dataForm.error_identifier = !this.dataForm.identifier;
        // this.dataForm.error_status = this.dataForm.status < 0;

        return !this.dataForm.error_identifier;
        // !this.dataForm.error_status;
    }


    async showConfirmation() {
        const modalConfirmSendDiagnostic = await this.modalController.create(
            {
                component: ConfirmSendDiagnosticComponent,
                componentProps: {
                    dataForm: this.dataForm
                }
            });

        modalConfirmSendDiagnostic.onDidDismiss()
            .then((res) => {
                console.log("cerrando popup send diagnostic confirm: ", res);
                if (res.data.success) {
                    this.sendDiagnostic();
                }
            });
        return await modalConfirmSendDiagnostic.present();
    }

    async sendDiagnostic() {
        const loading = await this.loadingController.create({
            message: $localize`:@@pleaseWait:Por favor, espere`
        });
        await loading.present();
        this.patientControllerService.patientControllerUpdateStatusByDocumentNumber(
            { documentNumber: this.dataForm.identifier, status: this.dataForm.status }).subscribe(patient => {
                loading.dismiss();
                // 2323232 numbertest
                if (patient != null && patient !== false) {
                    this.goResult(patient);
                } else {
                    // no patient foundit
                    this.patientError = true;
                }
            }, err => {
                loading.dismiss();
                this.patientError = true;
            });

        // this.goResult();
    }

    goResult(patient) {
        this.createDataForm();

        const navigationExtras: NavigationExtras = {
            queryParams: {
                patient: JSON.stringify(patient)
            }
        };
        this.navCtrl.navigateForward(['app/diagnostic-send-result'], navigationExtras);
    }

    getNameStatus(status: number) {
        return getNameStatus(status);
    }


    public goBack() {
        this.location.back();
    }

}
