import {Inject, Injectable} from "@angular/core";
import {Push} from "@ionic-native/push/ngx";
import {InstallationControllerService} from "../sdk";
import {InstallationService} from "./installation.service";
import {PatientService} from "./patient.service";
import {Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken} from "@capacitor/core";
import {PushNotificationChannel} from "@capacitor/core/dist/esm/core-plugin-definitions";
import {AlertController} from "@ionic/angular";
import { PermissionsService } from './permissionsService.service';

const { PushNotifications } = Plugins;

@Injectable()
export class PushNotificationService {

    protected activated = false;

    constructor(protected push: Push,
                protected patientService: PatientService,
                @Inject('settings') protected settings,
                public alertController: AlertController,
                protected installationService: InstallationService,
                protected installationControllerService: InstallationControllerService,
                protected permissionsService: PermissionsService) { }

    public startPushNotifications() {

        if(this.settings.enabled.push && this.activated == false) {
            this.activated = true;

            // to check if we have permission
            this.push.hasPermission()
                .then((res: any) => {

                    console.log('[PushService] Permission response: ' + JSON.stringify(res));

                    if (res.isEnabled) {
                        console.log('[PushService] We have permission to send push notifications');
                    } else {
                        console.log('[PushService] We do not have permission to send push notifications');
                    }

                    this.permissionsService.goToNextPermissionIfPermissionsRequested();
                })
                .catch(error => {
                    console.error('[PushService] Error trying to get push permissions: ' + JSON.stringify(error));
                    this.permissionsService.goToNextPermissionIfPermissionsRequested();
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
                console.log('[PushService] regitration result: ' + JSON.stringify(result));
            });

            PushNotifications.addListener('registration', (token: PushNotificationToken) => {
                console.log('[PushService] token: ' + token.value);
                this.installationService.loadedDeviceId$.subscribe(loaded => {
                    if (loaded) {
                        this.installationControllerService.installationControllerUpdatePushRegistrationIdByDeviceId(this.installationService.deviceId, token.value).subscribe(installation => {
                            console.log("[PushService] Registered on the installation");
                        });
                    }
                });
            });

            PushNotifications.createChannel(<PushNotificationChannel>{
                id: 'opencoronavirus',
                name: 'opencoronavirus',
                description: 'Open Coronavirus Channel',
                sound: 'pulse',
                importance: 3,
                visibility: 1,
                vibration: true
            });

            PushNotifications.addListener('registrationError', (error: any) => {
                console.log('[PushService] error on register ' + JSON.stringify(error));
            });
            PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
                console.log('[PushService] notification ' + JSON.stringify(notification));
                this.patientService.refreshPatientData(); //refresh patient data in the meantime
                this.showNotification(notification); //and show the notification with the message from server
            });

            PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
                console.log('[PushService] notification ' + JSON.stringify(notification));
            });
        }

    }

    async showNotification(notification) {
        const alert = await this.alertController.create(
            {
                header: notification.title,
                message: notification.body,
                buttons: ['OK'],
                backdropDismiss: false
            }
        );
        await alert.present();
    }
}
