import PushNotifications from 'node-pushnotifications';
import {join} from "path";
import {repository} from "@loopback/repository";
import {InstallationRepository} from "../repositories";

export class PushNotificationService {

    protected push: PushNotifications;

    constructor(@repository(InstallationRepository) public installationRepository : InstallationRepository) {

        let settings: PushNotifications.Settings = {
            gcm: {
                id: process.env.GCM_SERVER_API_KEY,
            },
            apn: {
                cert: join(process.cwd(), '/credentials/' + process.env.NODE_ENV + '/apns_cert.pem'),
                key: join(process.cwd(), '/credentials/' + process.env.NODE_ENV + '/apns_key.pem'),
                production: false // true for APN production environment, false for APN sandbox environment,
            },
            adm: {
                client_id: '',
                client_secret: '',
            },
            wns: {
                client_id: '',
                client_secret: '',
                notificationMethod: 'sendTileSquareBlock',
            },
            web: {
                vapidDetails: {
                    subject: '< \'mailto\' Address or URL >',
                    publicKey: '< URL Safe Base64 Encoded Public Key >',
                    privateKey: '< URL Safe Base64 Encoded Private Key >',
                },
                gcmAPIKey: process.env.GCM_SERVER_API_KEY,
                TTL: 2419200,
                contentEncoding: 'aes128gcm',
                headers: {}
            },
            isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
        };

        this.push = new PushNotifications(settings);

    }

    public sendNotificationToPatient(patientId: string, title: string, body: string) {

        let filter = {
            "where": {
                "patientId": patientId
            }
        };

        this.installationRepository.find(filter, {strictObjectIDCoercion: true}).then(installations => {

            if(installations != null && installations.length > 0) {
                let pushRegistrationIds = new Array<string>();
                installations.forEach(installation => {
                    if (installation != null && !!installation.pushRegistrationId) {
                        pushRegistrationIds.push(installation.pushRegistrationId);
                    } else {
                        console.error("No push registration info found for patient " + patientId + ", installation: " + installation.id + ". No push will be sent");
                    }
                });
                this.sendNotification(pushRegistrationIds, title, body);
            }
            else {
                console.error("No installation info found for patient " + patientId + ". No push will be sent");
            }

        });
    }


    public sendNotification(deviceIds: any[], title: string, body: string, badge = 1) {
        const data = {
            title: title, // REQUIRED for Android
            topic: 'com.opencoronavirus', // REQUIRED for iOS (apn and gcm)
            /* The topic of the notification. When using token-based authentication, specify the bundle ID of the app.
             * When using certificate-based authentication, the topic is usually your app's bundle ID.
             * More details can be found under https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns
             */
            body: body,
            custom: {
                sender: 'com.opencoronavirus',
            },
            priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
            collapseKey: '', // gcm for android, used as collapseId in apn
            contentAvailable: true, // gcm, apn. node-apn will translate true to 1 as required by apn.
            delayWhileIdle: true, // gcm for android
            restrictedPackageName: '', // gcm for android
            dryRun: false, // gcm for android
            icon: '', // gcm for android
            image: '', // gcm for android
            style: '', // gcm for android
            picture: '', // gcm for android
            tag: '', // gcm for android
            color: '', // gcm for android
            clickAction: '', // gcm for android. In ios, category will be used if not supplied
            locKey: '', // gcm, apn
            locArgs: '[]', // gcm, apn
            titleLocKey: '', // gcm, apn
            titleLocArgs: '[]', // gcm, apn
            retries: 1, // gcm, apn
            encoding: '', // apn
            badge: badge, // gcm for ios, apn
            sound: 'default', // gcm, apn
            android_channel_id: 'fcm_default_channel', // gcm - Android Channel ID
            notificationCount: badge, // fcm for android. badge can be used for both fcm and apn
            alert: { // apn, will take precedence over title and body
                title: title,
                body: body
                // details: https://github.com/node-apn/node-apn/blob/master/doc/notification.markdown#convenience-setters
            },
            silent: false, // apn, will override badge, sound, alert and priority if set to true
            /*
             * A string is also accepted as a payload for alert
             * Your notification won't appear on ios if alert is empty object
             * If alert is an empty string the regular 'title' and 'body' will show in Notification
             */
            // alert: '',
            launchImage: '', // apn and gcm for ios
            action: '', // apn and gcm for ios
            category: '', // apn and gcm for ios
            // mdm: '', // apn and gcm for ios. Use this to send Mobile Device Management commands.
            // https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/MobileDeviceManagementProtocolRef/3-MDM_Protocol/MDM_Protocol.html
            urlArgs: '', // apn and gcm for ios
            truncateAtWordEnd: true, // apn and gcm for ios
            mutableContent: 0, // apn
            threadId: '', // apn
            pushType: 'alert', // apn. valid values are 'alert' and 'background' (https://github.com/parse-community/node-apn/blob/master/doc/notification.markdown#notificationpushtype)
            expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // unit is seconds. if both expiry and timeToLive are given, expiry will take precedence
            timeToLive: 28 * 86400,
            headers: [], // wns
            launch: '', // wns
            duration: '', // wns
            consolidationKey: 'my notification', // ADM
        };

        // Multiple destinations
        let registrationIds = <any>[];
        deviceIds.forEach((deviceId: any) => {
            registrationIds.push(deviceId);
        })

        this.push.send(registrationIds, data, (err, result) => {
            if (err) {
                console.log(JSON.stringify(err));
            } else {
                console.log(JSON.stringify(result));
            }
        });


    }


}
