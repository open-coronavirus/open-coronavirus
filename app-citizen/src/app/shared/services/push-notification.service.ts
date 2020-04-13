import {Injectable, NgZone} from "@angular/core";
import {Push} from "@ionic-native/push/ngx";
import {PushObject, PushOptions} from "@ionic-native/push";
import {InstallationControllerService} from "../sdk";
import {InstallationService} from "./installation.service";

@Injectable()
export class PushNotificationService {

    constructor(protected push: Push,
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
            })

        const options: PushOptions = {
            android: {},
            ios: {
                fcmSandbox: true,
                alert: true,
                badge: true,
                sound: true,
            }
        }

        const pushObject = this.push.init(options);

        console.log('[PushService] push object: ' + JSON.stringify(pushObject));

        pushObject.on('registration').subscribe(function(registration) {

            console.log("[PushService] Registration done: " + JSON.stringify(registration));

            let registrationId = registration.registrationId;

            this.installationService.loadedDeviceId$.subscribe(loaded => {
                if (loaded) {
                    this.installationControllerService.installationControllerUpdatePushRegistrationIdByDeviceId(this.installationService.deviceId, registrationId);
                    console.log("[PushService] Registration data: " + JSON.stringify(registration));
                }
            });

        });

        console.log(pushObject);

        pushObject.on('error').subscribe(e => {
            console.error("[PushService] Push error: " + JSON.stringify(e));
        });

        pushObject.on('notification').subscribe(data => {
            console.log('[PushService] Notification received: ' + JSON.stringify(data));
        });

    }

}
