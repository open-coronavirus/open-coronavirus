import {Injectable} from "@angular/core";
import {Push} from "@ionic-native/push/ngx";
import {InstallationControllerService} from "../sdk";
import {InstallationService} from "./installation.service";
import {PatientService} from "./patient.service";
import {Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken} from "@capacitor/core";

const { PushNotifications } = Plugins;

@Injectable()
export class PushNotificationService {

    constructor(protected push: Push,
                protected patientService: PatientService,
                protected installationService: InstallationService,
                protected installationControllerService: InstallationControllerService) { }

    public startPushNotifications() {

        // to check if we have permission
        this.push.hasPermission()
            .then((res: any) => {

                console.log('[PushService] Permission response: ' + JSON.stringify(res));

                if (res.isEnabled) {
                    console.log('[PushService] We have permission to send push notifications');
                } else {
                    console.log('[PushService] We do not have permission to send push notifications');
                }

            })
            .catch(error => {
                console.error('[PushService] Error trying to get push permissions: ' + JSON.stringify(error));
            });

            //set the init options at this point:
            this.push.init({
               android: {
                   forceShow: true,
               },
               ios: {
                   fcmSandbox: true,
                   alert: true,
                   badge: true,
                   sound: true,
               }
            });

            PushNotifications.register().then(result => {
                console.log('[PushService] regitration result: ' + JSON.stringify(result) );
            });

            PushNotifications.addListener('registration', (token: PushNotificationToken) => {
                console.log('[PushService] token: ' + token.value);
                this.installationService.loadedDeviceId$.subscribe(loaded => {
                    if(loaded) {
                        this.installationControllerService.installationControllerUpdatePushRegistrationIdByDeviceId(this.installationService.deviceId, token.value).subscribe(installation => {
                            console.log("[PushService] Registered on the installation");
                        });
                    }
                });
            });

            PushNotifications.addListener('registrationError', (error: any) => {
                console.log('[PushService] error on register ' + JSON.stringify(error));
            });
            PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
                console.log('[PushService] notification ' + JSON.stringify(notification));
                this.patientService.loadLocalPatient(); //refresh patient data
            });

            PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
                console.log('[PushService] notification ' + JSON.stringify(notification));
            });

    }

}
