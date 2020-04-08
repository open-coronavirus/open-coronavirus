import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { PatientControllerService } from '../sdk/api/patientController.service';


@Injectable()
export class PatientService {
    public patientLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    constructor(
        protected patientController: PatientControllerService,
        @Inject('environment') protected environment,
        protected router: Router,
        public platform: Platform,
        protected nativeStorage: NativeStorage) {

    }

    public getPatient(idPatient: string): Subscribable<any> {
        return  this.patientController.patientControllerFindById(idPatient);
    }

    public getPatientDetail(idPatient: string): Subscribable<any> {
        let returnValue = new Subject();

        this.patientController.patientControllerUpdateById(idPatient).subscribe(exitingPatient => {
            // this._patient = patient;
            returnValue.next(true);
        });

        return returnValue;
    }

}
