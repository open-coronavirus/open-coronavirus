import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { PatientService } from '../../shared/services/patient.service';
import { Location } from '@angular/common';


@Component({
    selector: 'qr-reader-result',
    templateUrl: 'qr-reader-result.component.html',
    styleUrls: ['qr-reader-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderResultComponent {

    constructor(public patientService: PatientService,
                protected location: Location) { }


    public goBack() {
        this.location.back();
    }

}
