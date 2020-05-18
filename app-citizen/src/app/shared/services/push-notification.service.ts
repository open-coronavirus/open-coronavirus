import {Inject, Injectable} from "@angular/core";
import {Push} from "@ionic-native/push/ngx";
import {InstallationControllerService} from "../sdk";
import {InstallationService} from "./installation.service";
import {PatientService} from "./patient.service";
import {
    NotificationChannel,
    Plugins,
    PushNotification,
    PushNotificationActionPerformed,
    PushNotificationToken
} from "@capacitor/core";
import {AlertController} from "@ionic/angular";
import {PermissionsService} from './permissions.service';
import {ContactTrackerService} from "./contacts/contact-tracker.service";
import {KeyManagerService} from "./keys/key-manager.service";
import {TracingService} from "./tracing.service";
import {LoggingService} from "./logging.service";

const { PushNotifications } = Plugins;

@Injectable()
export class PushNotificationService {

    protected activated = false;

    protected handledRegistration = false;



    constructor(protected push: Push,
                protected patientService: PatientService,
                @Inject('settings') protected settings,
                public alertController: AlertController,
                protected tracingService: TracingService,
                protected installationService: InstallationService,
                protected loggingService: LoggingService,
                protected contactTrackerService: ContactTrackerService,
                protected keyManagerService: KeyManagerService,
                protected installationControllerService: InstallationControllerService,
                protected permissionsService: PermissionsService) { }

    public startPushNotifications() {

        if(this.settings.enabled.push && this.activated == false) {
            this.activated = true;

            // to check if we have permission
            this.push.hasPermission().then((res: any) => {
                this.loggingService.log('[PushService] Permission response: ' + JSON.stringify(res));
                if (res.isEnabled) {
                    this.loggingService.log('[PushService] We have permission to send push notifications');
                } else {
                    this.loggingService.log('[PushService] We do not have permission to send push notifications');
                }
            })
                .catch(error => {
                    this.loggingService.error('[PushService] Error trying to get push permissions: ' + JSON.stringify(error));
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
                this.loggingService.log('[PushService] regitration result: ' + JSON.stringify(result));
            });

            PushNotifications.addListener('registration', (token: PushNotificationToken) => {
                if(!this.handledRegistration) {
                    this.handledRegistration = true;
                    this.loggingService.log('[PushService] token: ' + token.value);
                    this.installationService.loadedDeviceId$.subscribe(loaded => {
                        if (loaded) {
                            this.installationControllerService.installationControllerUpdatePushRegistrationIdByDeviceId(this.installationService.deviceId, token.value).subscribe(installation => {
                                this.loggingService.log("[PushService] Registered on the installation");
                            });
                        }
                    });
                }
            });

            PushNotifications.createChannel(<NotificationChannel>{
                id: 'opencoronavirus',
                name: 'opencoronavirus',
                description: 'Open Coronavirus Channel',
                sound: 'pulse',
                importance: 3,
                visibility: 1,
                vibration: true
            });

            PushNotifications.addListener('registrationError', (error: any) => {
                this.loggingService.log('[PushService] error on register ' + JSON.stringify(error));
            });
            PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
                this.loggingService.log('[PushService] notification ' + JSON.stringify(notification));
                this.showNotification(notification); //and show the notification with the message from server
            });

            PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
                this.loggingService.log('[PushService] notification ' + JSON.stringify(notification));
            });
        }

    }

    async showNotification(notification) {
        const alert = await this.alertController.create(
            {
                header: notification.title,
                message: notification.body,
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {
                            this.patientService.refreshPatientData();
                        }
                    }
                ],
                backdropDismiss: false
            }
        );
        await alert.present();
    }
}
