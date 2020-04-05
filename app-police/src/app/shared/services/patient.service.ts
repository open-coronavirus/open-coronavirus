import {Inject, Injectable} from '@angular/core';
import {ApiFilter} from '../utils/apifilter';
import {BehaviorSubject, Subject, Subscribable} from 'rxjs';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Router} from '@angular/router';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation';
import {Platform} from '@ionic/angular';
import { PatientWithRelations } from '../sdk/model/patientWithRelations';
import { PatientControllerService } from '../sdk/api/patientController.service';


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
                public platform: Platform,
                protected nativeStorage: NativeStorage) {

        platform.ready().then(() => {
            if (this.environment.production) {
                this.nativeStorage.getItem(PatientService.PATIENT_TOKEN_KEY)
                    .then(
                        data => {
                            this.loadPatient(data);
                        }
                    );
            } else {
                this.loadPatient('5e7497828d970a10056ef022');
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
                // this.activateBackgroundGeolocation();
            } else {
                returnValue.next(false);
            }

        });

        return returnValue;

    }

    public register(patient: PatientWithRelations): Subscribable<any> {

        let returnValue = new Subject();

        this.patientController.patientControllerFind(new ApiFilter({where: {documentNumber: {'eq': patient.documentNumber}}})).subscribe(existingPatient => {

            if (existingPatient != null) {
                returnValue.next(false);
            } else {

                this.patientController.patientControllerCreate(patient).subscribe(newPatient => {
                    this.nativeStorage.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).then(result => {
                    })
                    .finally(() => {
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

    public getCheckStatusUrl() {
        return 'https://api.coronapp.es/check-status/' + this.patientToken;
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
