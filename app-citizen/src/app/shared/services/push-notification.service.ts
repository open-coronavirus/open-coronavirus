import {Inject, Injectable} from "@angular/core";
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


    constructor(protected patientService: PatientService,
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

            PushNotifications.requestPermission().then( permission => {
                if (permission.granted) {

                    PushNotifications.register().then(result => {
                        this.loggingService.log('[PushService] regitration result: ' + JSON.stringify(result));

                        PushNotifications.createChannel(<NotificationChannel>{
                            id: 'fcm_default_channel',
                            name: 'opencoronavirus',
                            description: 'Open Coronavirus',
                            importance: 5,
                            visibility: 1,
                            sound: 'default',
                            lights: true,
                            vibration: true
                        });

                    });

                    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
                        if (!this.handledRegistration) {
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

                    PushNotifications.addListener('registrationError', (error: any) => {
                        this.loggingService.log('[PushService] error on register ' + JSON.stringify(error));
                    });

                    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
                        this.loggingService.log('[PushService] notification ' + JSON.stringify(notification));
                        this.patientService.refreshPatientData();
                    });

                    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
                        this.loggingService.log('[PushService] notification ' + JSON.stringify(notification));
                    });

                }
            });
        }

    }


}
