import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavigationExtras } from '@angular/router';
import { PatientService } from '../../shared/services/patient.service';
import { MenuController, LoadingController, NavController } from '@ionic/angular';
import { PatientControllerService } from 'src/app/shared/sdk/api/patientController.service';

@Component({
    selector: 'qr-reader',
    templateUrl: 'qr-reader.component.html',
    styleUrls: ['qr-reader.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderComponent {

    constructor(
        public navCtrl: NavController,
        public patientService: PatientService,
        public patientControllerService: PatientControllerService,
        protected barcodeScanner: BarcodeScanner,
        public loadingController: LoadingController,
        protected menu: MenuController,
        protected location: Location) {}

    scanQR() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data: ', barcodeData);
            if (barcodeData && barcodeData.text) {
                this.getPatient(barcodeData.text);
            }
        }).catch(err => {
            console.error('Error scanQR: ', err);
            // Test
            this.getPatient('5e8815c411000f36890151fd');
        });
    }

    async getPatient(idPatient: string) {
        const loading = await this.loadingController.create({
            message: $localize`:@@pleaseWait:Por favor, espere`
        });
        await loading.present();
        this.patientControllerService.patientControllerGetByQrCode(idPatient).subscribe(patient => {
            loading.dismiss();
            if (patient != null && patient !== false) {
                this.goDetail(patient);
            } else {
                // no patient foundit
                // this.router.navigate(['/no-access']);
            }
        }, err => {
            loading.dismiss();
        });
    }

    goDetail(patient) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                patient: JSON.stringify(patient)
            }
        };
        this.navCtrl.navigateForward(['app/qr-reader-result'], navigationExtras);
    }


    public goBack() {
        this.location.back();
    }

}
