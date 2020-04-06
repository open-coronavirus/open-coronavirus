import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router, NavigationExtras } from '@angular/router';
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
        // protected router: Router,
        public navCtrl: NavController,
        public patientService: PatientService,
        public patientControllerService: PatientControllerService,
        protected barcodeScanner: BarcodeScanner,
        public loadingController: LoadingController,
        protected menu: MenuController,
        protected location: Location) { }

    scanQR() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data: ', barcodeData);
            if (barcodeData && barcodeData.text) {
                // this.idPatient = barcodeData.text;
                this.getPatient(barcodeData.text);
            }
        }).catch(err => {
            console.error('Error scanQR: ', err);
            // Test
            this.getPatient('33');
        });
    }

    async getPatient(idPatient: string) {
        const loading = await this.loadingController.create({
            message: $localize`:@@pleaseWait:Por favor, espere`
        });
        await loading.present();
        this.patientControllerService.patientControllerGetByQrCode(idPatient).subscribe(patient => {
            loading.dismiss();
            if (patient != null && patient != false) {
                this.goDetail(patient);
            } else {
                // no patient foundit
                // this.router.navigate(['/no-access']);
            }
        }, err => {
            console.log("getPatient errr: ", err);
            loading.dismiss();
            this.goDetail({ id: '33', name: 'federico' });
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

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    public goBack() {
        this.location.back();
    }

}
