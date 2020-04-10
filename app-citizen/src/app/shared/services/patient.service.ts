import {Inject, Injectable} from '@angular/core';
import {PatientControllerService, PatientWithRelations} from '../sdk';
import {BehaviorSubject, Subject, Subscribable} from 'rxjs';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {StorageService} from "./storage.service";
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
        //start geolocation tracking
        if(this.settings.enableGpsModule) {
            this.geolocationtrackingService.activateBackgroundGeolocation(patient);
        }
        //start bluetooth tracking
        if(this.settings.enableBluetoothModule) {
            this.blueToothTrackingService.patientServiceUUID = this.patient.serviceAdvertisementUUID;
            this.blueToothTrackingService.startBluetooth();
        }
    }

    public changeStatus(newStatus: number) {
        //todo
    }

    public register(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        this.patientController.patientControllerCreate(patient).subscribe(newPatient => {

            if(newPatient != null) {

                this.storageService.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).subscribe(result => {
                    this.loadPatient(newPatient.id);
                    this.patientLoaded$.subscribe(loaded => {
                        if (loaded) {
                            returnValue.next(newPatient);
                        }
                    })
                });
            }
            else {
                returnValue.next(false);
            }
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
