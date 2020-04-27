import { Inject, Injectable } from '@angular/core';
import { PatientControllerService, PatientWithRelations } from '../sdk';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService } from "./storage.service";
import { InstallationService } from "./installation.service";


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

    //everytime the patient data is being changed
    public patientDataChanged$ = new BehaviorSubject<boolean>(false);

    //the very first time the patient is loaded
    public patientLoaded$ = new BehaviorSubject<boolean>(false);

    //everytime the patient is reloaded
    public patientRefreshed$ = new Subject();

    public static PATIENT_TOKEN_KEY = 'patientTokenV3';

    constructor(protected patientController: PatientControllerService,
        @Inject('environment') protected environment,
        protected installationService: InstallationService,
        @Inject('settings') protected settings,
        public platform: Platform,
        protected storageService: StorageService) {

    }

    public loadLocalPatient() {

        let returnValue = new Subject<boolean>();

        this.storageService.getItem(PatientService.PATIENT_TOKEN_KEY).subscribe(token => {
            if (token != null) {
                this.patientController.patientControllerFindById(token).subscribe(existingPatient => {
                    if (existingPatient != null) {
                        this._patient = existingPatient;
                        this.patientToken = token;
                        this.patientLoaded$.next(true);
                        this.patientDataChanged$.next(true);
                        returnValue.next(true);
                    } else {
                        returnValue.next(false);
                    }
                });
            } else {
                returnValue.next(false);
            }

        });

        return returnValue;
    }

    public refreshPatientData() {

        let returnValue = new Subject<boolean>();
        this.storageService.getItem(PatientService.PATIENT_TOKEN_KEY).subscribe(token => {
            if (token != null) {
                this.patientController.patientControllerFindById(token).subscribe(existingPatient => {
                    if (existingPatient != null) {
                        this._patient = existingPatient;
                        this.patientRefreshed$.next(true);
                        this.patientDataChanged$.next(true);
                        returnValue.next(true);
                    }
                });
            }
        });
        return returnValue;
    }

    public setAsQuarantine() {
        //todo ...
    }


    public register(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        //set the appId for test environment
        //in production this value will be ignored, but in test environment we use a
        //server handling multiple differnet app versions
        patient.appId = this.settings.appId;

        this.patientController.patientControllerCreate(patient).subscribe(newPatient => {
            this.storageService.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).subscribe(result => {
                this.loadLocalPatient().subscribe(loaded => {
                    if (loaded) {
                        this.installationService.registerInstallation(this.patient.id).subscribe(installed => {
                            returnValue.next(newPatient);
                        });
                    }
                    else {
                        console.error("Error trying to register the patient. The installation has not been registered as well :(");
                    }
                });
            });
        });

        return returnValue;
    }

    public update(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        console.log("Update patient info: " + JSON.stringify(patient));

        this.patientController.patientControllerUpdateById(patient.id, patient).subscribe(exitingPatient => {
            this.refreshPatientData().subscribe(loaded => {
                returnValue.next(true);
            });
        });

        return returnValue;
    }




}
