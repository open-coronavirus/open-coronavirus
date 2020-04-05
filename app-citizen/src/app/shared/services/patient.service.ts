import {Inject, Injectable} from '@angular/core';
import {
    GeolocationControllerService,
    GeolocationWithRelations,
    PatientControllerService,
    PatientWithRelations
} from '../sdk';
import {ApiFilter} from '../utils/apifilter';
import {BehaviorSubject, Subject, Subscribable} from 'rxjs';
import {Router} from '@angular/router';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation';
import {BackgroundGeolocationEvents, BackgroundGeolocationResponse} from '@ionic-native/background-geolocation/ngx';
import {Platform} from '@ionic/angular';
import {StorageService} from "./storage.service";
import {BlueToothTrackingService} from "./tracking/bluetoothtracking.service";
import {GeolocationtrackingService} from "./tracking/geolocationtracking.service";


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
                protected router: Router,
                protected geolocationtrackingService: GeolocationtrackingService,
                protected blueToothTrackingService: BlueToothTrackingService,
                public platform: Platform,
                protected storageService: StorageService) {

        this.storageService.getItem(PatientService.PATIENT_TOKEN_KEY).subscribe(data => {
            this.loadPatient(data);
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
        this.geolocationtrackingService.activateBackgroundGeolocation(patient);
        //start bluetooth tracking
        this.blueToothTrackingService.btEnabled$.subscribe(enabled => {
            if(enabled) {
                this.blueToothTrackingService.startAdvertising(patient);
                this.blueToothTrackingService.startScan();
            }
        });
    }

    public changeStatus(newStatus: number) {
        //todo
    }

    public register(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        this.patientController.patientControllerFind(new ApiFilter({where: {documentNumber: {'eq': patient.documentNumber}}})).subscribe(existingPatient => {

            if (existingPatient.length > 0) {
                returnValue.next(false);
            } else {

                this.patientController.patientControllerCreate(patient).subscribe(newPatient => {
                    this.storageService.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).subscribe(result => {
                        this.loadPatient(newPatient.id);
                        this.patientLoaded$.subscribe(loaded => {
                            if(loaded) {
                                returnValue.next(newPatient);
                            }
                        })
                    })
                });
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
