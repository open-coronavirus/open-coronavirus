import {Component, ViewEncapsulation} from '@angular/core';
import {PatientService} from '../services/patient.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'qr-code',
    templateUrl: 'qr-code.component.html',
    styleUrls: ['qr-code.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrCodeComponent {

    public value = null;

    protected subscription: Subscription = new Subscription();

    constructor(protected patientService: PatientService) {

        this.subscription = this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {
                this.value = patientService.patient.id;
            }
        });

    }


}
