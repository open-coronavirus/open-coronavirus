import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { PatientService } from '../../shared/services/patient.service';
import { PatientInfoFormComponent } from '../../shared/patient-info-form/patient-info-form.component';
import { Location } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';


@Component({
    selector: 'qr-reader',
    templateUrl: 'qr-reader.component.html',
    styleUrls: ['qr-reader.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderComponent {

    constructor(protected router: Router,
                public patientService: PatientService,
                protected barcodeScanner: BarcodeScanner,
                protected location: Location) { }

    scanQR() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data: ', barcodeData);
            if (barcodeData && barcodeData.text) {
                // this.serialNumber = barcodeData.text;
            }
        }).catch(err => {
            console.error('Error scanQR: ', err);
            this.router.navigate(['app/qr-reader-result']);
        });
    }

    public goBack() {
        this.location.back();
    }

}
