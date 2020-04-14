import {Inject, Injectable} from '@angular/core';
import {PatientControllerService, PatientWithRelations} from '../sdk';
import {BehaviorSubject, Subject, Subscribable} from 'rxjs';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {StorageService} from "./storage.service";
import {InstallationService} from "./installation.service";


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

    public static PATIENT_TOKEN_KEY = 'patientTokenV2';

    constructor(protected patientController: PatientControllerService,
                @Inject('environment') protected environment,
                @Inject('settings') protected settings,
                protected installationService: InstallationService,
                protected router: Router,
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

    protected loadPatient(patientToken, redirect: boolean = true) {
        this.setPatientToken(patientToken).subscribe(success => {
            if (success) {
                this.patientLoaded$.next({redirect});
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
            } else {
                returnValue.next(false);
            }

        });

        return returnValue;

    }


    public changeStatus(newStatus: number) {
        // todo
    }

    public register(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        this.patientController.patientControllerCreate(patient).subscribe(newPatient => {
            this.storageService.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).subscribe(result => {
                this.loadPatient(newPatient.id, false);
                this.patientLoaded$.subscribe(loaded => {
                    if (loaded) {
                        this.installationService.registerInstallation(this.patient.id).subscribe(installed => {
                            returnValue.next(newPatient);
                        });
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
