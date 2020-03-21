import {Component} from '@angular/core';
import {PatientService} from '../services/patient.service';

@Component({
    selector: 'qr-code',
    templateUrl: 'qr-code.component.html',
    styleUrls: ['qr-code.component.scss']
})
export class QrCodeComponent {

    public url = null;

    constructor(protected patientService: PatientService) {

        this.url = patientService.getCheckStatusUrl();

    }


}
