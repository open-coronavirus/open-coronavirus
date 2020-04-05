import { Inject, Injectable } from '@angular/core';
import { UserControllerService } from '../sdk';
import { ApiFilter } from '../utils/apifilter';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserCredentials } from '../sdk/model/userCredentials';



@Injectable()
export class UserService {

    get user(): UserCredentials {
        return this._user;
    }

    set user(value: UserCredentials) {
        this._user = value;
    }

    // protected activatedBackgroundGeolocation = false;

    // protected patientToken: string = null;
    private _user: UserCredentials = null;

    public userLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    // public static PATIENT_TOKEN_KEY = 'patientToken';

    constructor(protected userController: UserControllerService,
        @Inject('environment') protected environment,
        protected router: Router,
        public platform: Platform,
        protected nativeStorage: NativeStorage) {

        // platform.ready().then(() => {
        //     if (1 == 1 || this.environment.production) {
        //         this.nativeStorage.getItem(UserService.PATIENT_TOKEN_KEY)
        //             .then(
        //                 data => {
        //                     this.loadPatient(data);
        //                 }
        //             );
        //     } else {
        //         this.loadPatient('5e7497828d970a10056ef022');
        //     }
        // });

    }

    // protected loadPatient(patientToken) {
    //     this.setPatientToken(patientToken).subscribe(success => {
    //         if (success) {
    //             this.patientLoaded$.next(true);
    //         } else {
    //             this.router.navigate(['register']);
    //         }
    //     });
    // }

    // public setPatientToken(patientToken: string) {

    //     let returnValue = new Subject();

    //     this.userController.patientControllerFindById(patientToken).subscribe(existingPatient => {

    //         if (existingPatient != null) {
    //             this._patient = existingPatient;
    //             this.patientToken = patientToken;
    //             returnValue.next(true);
    //             this.activateBackgroundGeolocation();
    //         } else {
    //             returnValue.next(false);
    //         }

    //     });

    //     return returnValue;

    // }

    public login(userCredentials: UserCredentials): Subscribable<any> {

        let returnValue = new Subject();

        this.userController.userControllerFind(new ApiFilter({ where: { email: { 'eq': userCredentials.email } } })).subscribe(existingPatient => {

            if (existingPatient.length > 0) {
                returnValue.next(false);
            } else {

                this.userController.userControllerCreate(userCredentials).subscribe(res => {
                    // this.loadPatient(res.id);
                    this.userLoaded$.subscribe(loaded => {
                        if (loaded) {
                            returnValue.next(res);
                        }
                    });
                });
            }
        });

        return returnValue;
    }

    // public register(patient: PatientWithRelations): Subscribable<any> {

    //     let returnValue = new Subject();

    //     this.userController.patientControllerFind(new ApiFilter({where: {documentNumber: {'eq': patient.documentNumber}}})).subscribe(existingPatient => {

    //         if (existingPatient.length > 0) {
    //             returnValue.next(false);
    //         } else {

    //             this.userController.patientControllerCreate(patient).subscribe(newPatient => {
    //                 this.loadPatient(newPatient.id);
    //                 this.patientLoaded$.subscribe(loaded => {
    //                     if(loaded) {
    //                         returnValue.next(newPatient);
    //                     }
    //                 })
    //             });
    //         }
    //     });

    //     return returnValue;
    // }

    // public getCheckStatusUrl() {
    //     return 'https://api.coronapp.es/check-status/' + this.patientToken;
    // }

    // public update(patient: PatientWithRelations): Subscribable<any> {

    //     let returnValue = new Subject();

    //     this.userController.patientControllerUpdateById(patient.id, patient).subscribe(exitingPatient => {
    //         this._patient = patient;
    //         returnValue.next(true);
    //     });

    //     return returnValue;
    // }

    // public activateBackgroundGeolocation() {

    //     if(!this.activatedBackgroundGeolocation && this.patient != null && this.patient.id != null) {

    //         this.activatedBackgroundGeolocation = true;

    //         BackgroundGeolocation.configure({
    //             desiredAccuracy: 10, //10 means MEDIUM
    //             stationaryRadius: 50,
    //             distanceFilter: 50,
    //             interval: 60000,
    //             fastestInterval: 60000,
    //             activitiesInterval: 60000,
    //             notificationTitle: 'Tu posición es importante',
    //             notificationText: 'Al informar sobre tu posición ayudas mucho a combatir el CORONAVIRUS',
    //             debug: false,
    //             stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    //         });

    //         BackgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {

    //             // handle your locations here
    //             // to perform long running operation on iOS
    //             // you need to create background task
    //             BackgroundGeolocation.startTask().then(taskKey => {

    //                 let geolocation: GeolocationWithRelations = new class implements GeolocationWithRelations {
    //                     [key: string]: object | any;

    //                     accuracy: number;
    //                     altitude: number;
    //                     bearing: number;
    //                     id: string;
    //                     latitude: number;
    //                     longitude: number;
    //                     speed: number;
    //                     updated: Date;
    //                     userId: string;
    //                 };

    //                 geolocation.userId = this.patient.id;
    //                 geolocation.latitude = location.latitude;
    //                 geolocation.longitude = location.longitude;
    //                 geolocation.accuracy = location.accuracy;
    //                 geolocation.speed = location.speed;
    //                 geolocation.bearing = location.bearing;
    //                 geolocation.altitude = location.altitude;

    //                 this.geolocationControllerService.geolocationControllerCreate(geolocation).subscribe(createdGeolocation => {
    //                     //nothing to do
    //                 });

    //                 // execute long running task
    //                 // eg. ajax post location
    //                 // IMPORTANT: task has to be ended by endTask
    //                 BackgroundGeolocation.endTask(taskKey);
    //             });
    //         });

    //         BackgroundGeolocation.checkStatus().then(status => {

    //             if (status.authorization !== BackgroundGeolocationAuthorizationStatus.AUTHORIZED) {
    //                 // we need to set delay or otherwise alert may not be shown
    //                 setTimeout(() => {
    //                     var showSettings = confirm('Al informar sobre tu posición ayudas mucho a combatir el CORONAVIRUS. Te gustaría cambiar la configuración de la app?');
    //                     if (showSettings) {
    //                         return BackgroundGeolocation.showAppSettings();
    //                     }
    //                 }, 1000);
    //             }

    //             // you don't need to check status before start (this is just the example)
    //             if (!status.isRunning) {
    //                 BackgroundGeolocation.start(); //triggers start on start event
    //             }
    //         });

    //     }

    // }


}
