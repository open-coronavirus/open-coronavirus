import {ApplicationRef, Inject, Injectable} from '@angular/core';
import { PatientControllerService, PatientWithRelations } from '../sdk';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import {AlertController, Platform} from '@ionic/angular';
import { StorageService } from "./storage.service";
import { InstallationService } from "./installation.service";
import {PatientStatus} from "../../../../../server/src/common/utils/enums";


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

    public static PATIENT_TOKEN_KEY = 'patientTokenV4';
    public static PATIENT_LAST_STATUS_KEY = 'patientLastStatusV4';

    constructor(protected patientController: PatientControllerService,
                @Inject('environment') protected environment,
                protected installationService: InstallationService,
                @Inject('settings') protected settings,
                private appRef: ApplicationRef,
                public alertController: AlertController,
                public platform: Platform,
                protected storageService: StorageService) {

    }

    public loadLocalPatient() {

        let returnValue = new Subject<boolean>();

        this.storageService.getItem(PatientService.PATIENT_TOKEN_KEY).then(token => {
            if (token != null) {
                this.patientController.patientControllerFindById(token).subscribe(existingPatient => {
                    if (existingPatient != null) {
                        this._patient = existingPatient;
                        this.patientToken = token;
                        this.checkIfPatientStatusHasChanged(this._patient).then(() => {
                            this.patientLoaded$.next(true);
                            this.patientDataChanged$.next(true);
                            returnValue.next(true);
                            this.appRef.tick(); //ensure refresh
                        });
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

    public checkIfPatientStatusHasChanged(patient) {
        return new Promise<void>((resolve, reject) => {
            this.storageService.getItem(PatientService.PATIENT_LAST_STATUS_KEY).then(async lastStatus => {
                if (lastStatus != null && patient.status != lastStatus) {
                    let text = null;
                    switch(patient.status) {
                        case PatientStatus.INFECTED:
                            text = "Has dado POSITIVO en COVID-19. Por favor, quédate en casa y contacta con tu médico o centro de salud.";
                            break;
                        case PatientStatus.UNINFECTED:
                        case PatientStatus.IMMUNE:
                            text = "Has dado NEGATIVO en COVID-19. Enhorabuena!";
                            break;
                        case PatientStatus.INFECTION_SUSPECTED:
                            text = "Has estado en contacto activamente con pacientes con riesgo de coronavirus en los últimos días. Por favor, quédate en casa y contacta con tu médico o centro de salud.";
                            break;
                    }
                    if(text != null) {
                        await this.showNotification("Atención", text);
                    }
                }
                this.storageService.setItem(PatientService.PATIENT_LAST_STATUS_KEY, patient.status).then(() => {
                    resolve();
                });
            });
        });
    }

    public refreshPatientData() {

        let returnValue = new Subject<boolean>();
        this.storageService.getItem(PatientService.PATIENT_TOKEN_KEY).then(token => {
            if (token != null) {
                this.patientController.patientControllerFindById(token).subscribe(existingPatient => {
                    if (existingPatient != null) {
                        this._patient = existingPatient;
                        this.checkIfPatientStatusHasChanged(this._patient).then(() => {
                            this.patientRefreshed$.next(true);
                            this.patientDataChanged$.next(true);
                            this.appRef.tick(); //ensure refresh
                            returnValue.next(true);
                        });
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
        console.log("Registering...");

        this.patientController.patientControllerCreate(patient).subscribe(newPatient => {
                console.log("received patient: " + newPatient);
                this.storageService.setItem(PatientService.PATIENT_TOKEN_KEY, newPatient.id).then(result => {
                    this.loadLocalPatient().subscribe(loaded => {
                        if (loaded) {
                            this.installationService.registerInstallation(this.patient.id).subscribe(installed => {
                                returnValue.next(newPatient);
                            });
                        } else {
                            console.error("Error trying to register the patient. The installation has not been registered as well :(");
                        }
                    });
                });
            },
            error => {
                console.error("Error trying to register: " + JSON.stringify(error));
                returnValue.error(error);
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

    async showNotification(title: string, message: string) {
        const alert = await this.alertController.create(
            {
                header: title,
                message: message,
                buttons: [{ text: 'OK' }],
                backdropDismiss: false
            }
        );
        await alert.present();
    }


}
