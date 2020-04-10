import { Inject, Injectable } from '@angular/core';
import {
    PatientControllerService,
    PatientWithRelations
} from '../sdk';
import { ApiFilter } from '../utils/apifilter';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StorageService } from "./storage.service";
import {BluetoothTrackingService} from "./tracking/bluetooth-tracking.service";
import {GeolocationTrackingService} from "./tracking/geolocation-tracking.service";


@Injectable()
export class PatientService {

    get patient(): PatientWithRelations {
        return this._patient;
    }

    set patient(value: PatientWithRelations) {
        this._patient = value;
    }


    protected patientToken: string = null;
    private _patient: PatientWithRelations = null;

    public patientLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    public static PATIENT_TOKEN_KEY = 'patientToken';

    constructor(protected patientController: PatientControllerService,
                @Inject('environment') protected environment,
                @Inject('settings') protected settings,
                protected router: Router,
                protected geolocationtrackingService: GeolocationTrackingService,
                protected blueToothTrackingService: BluetoothTrackingService,
                public platform: Platform,
                protected storageService: StorageService) {

        this.loadLocalPatient();
    }

    public loadLocalPatient() {
        this.storageService.getItem(PatientService.PATIENT_TOKEN_KEY).subscribe(data => {
            if(data != null) {
                this.loadPatient(data);
            }
        });
    }

    protected loadPatient(patientToken) {
        this.setPatientToken(patientToken).subscribe(success => {
            if (success) {
                this.patientLoaded$.next(true);
            } else {
                this.router.navigate(['register']);
            }
        });
    }

    public setPatientToken(patientToken: string) {

        let returnValue = new Subject();

        this.patientController.patientControllerFindById(patientToken).subscribe(existingPatient => {

            if (existingPatient != null) {
                this._patient = existingPatient;
                this.patientToken = patientToken;
                returnValue.next(true);
                this.startTracking(existingPatient);
            } else {
                returnValue.next(false);
            }

        });

        return returnValue;

    }

    protected startTracking(patient) {
        this.startGeoTracking(patient);
        this.startBluetoothTracking(patient);
    }

    public startGeoTracking(patient: PatientWithRelations) {
        if(this.settings.permissions.gps && !this.platform.is('desktop')) {
            this.geolocationtrackingService.activateBackgroundGeolocation(patient);
        }
    }

    public startBluetoothTracking(patient: PatientWithRelations) {
        if(this.settings.permissions.bluetooth && !this.platform.is('desktop')) {
            this.blueToothTrackingService.patientServiceUUID = patient.serviceAdvertisementUUID;
            this.blueToothTrackingService.startBluetooth();
        }
    }

    public changeStatus(newStatus: number) {
        // todo
    }

    public register(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        this.patientController.patientControllerCreate(patient).subscribe(newPatient => {
            this.storageService.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).subscribe(result => {
                this.loadPatient(newPatient.id);
                this.patientLoaded$.subscribe(loaded => {
                    if (loaded) {
                        returnValue.next(newPatient);
                    }
                });
            });
        });

        return returnValue;
    }

    public update(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        this.patientController.patientControllerUpdateById(patient.id, patient).subscribe(exitingPatient => {
            this._patient = patient;
            returnValue.next(true);
        });

        return returnValue;
    }




}
