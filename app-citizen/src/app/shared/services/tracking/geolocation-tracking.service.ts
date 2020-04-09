import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation";
import {BackgroundGeolocationEvents, BackgroundGeolocationResponse} from "@ionic-native/background-geolocation/ngx";
import {GeolocationControllerService, GeolocationWithRelations, PatientWithRelations} from "../../sdk";


@Injectable()
export class GeolocationTrackingService {


    protected activatedBackgroundGeolocation = false;

    constructor(protected geolocationControllerService: GeolocationControllerService) {}

    public activateBackgroundGeolocation(patient: PatientWithRelations) {

        let returnValue: Subject<any> = new Subject();

        if(!this.activatedBackgroundGeolocation && patient != null && patient.id != null) {

            this.activatedBackgroundGeolocation = true;

            BackgroundGeolocation.configure({
                desiredAccuracy: 10, //10 means MEDIUM
                stationaryRadius: 50,
                distanceFilter: 50,
                interval: 60000,
                fastestInterval: 60000,
                activitiesInterval: 60000,
                notificationTitle: $localize`:@@geolocationNotificationTitle:Tu posición es importante`,
                notificationText: $localize`:@@geolocationNotificationText:Al informar sobre tu posición ayudas mucho a combatir el CORONAVIRUS`,
                debug: false,
                stopOnTerminate: false, // enable this to clear background location settings when the app terminates
            });

            BackgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {

                // handle your locations here
                // to perform long running operation on iOS
                // you need to create background task
                BackgroundGeolocation.startTask().then(taskKey => {

                    let geolocation: GeolocationWithRelations = new class implements GeolocationWithRelations {
                        [key: string]: object | any;

                        accuracy: number;
                        altitude: number;
                        bearing: number;
                        id: string;
                        latitude: number;
                        longitude: number;
                        speed: number;
                        updated: Date;
                        patientId: string;
                    };

                    geolocation.patientId = patient.id;
                    geolocation.latitude = location.latitude;
                    geolocation.longitude = location.longitude;
                    geolocation.accuracy = location.accuracy;
                    geolocation.speed = location.speed;
                    geolocation.bearing = location.bearing;
                    geolocation.altitude = location.altitude;

                    this.geolocationControllerService.geolocationControllerCreate(geolocation).subscribe(createdGeolocation => {
                        //nothing to do
                    });

                    // execute long running task
                    // eg. ajax post location
                    // IMPORTANT: task has to be ended by endTask
                    BackgroundGeolocation.endTask(taskKey);
                });
            });


        }

        return returnValue;

    }

}
