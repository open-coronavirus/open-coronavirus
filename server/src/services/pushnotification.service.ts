import PN from 'node-pushnotifications';
import PushNotifications from "node-pushnotifications";

export class PushNotificationService {

    constructor() {

        let settings: PushNotifications.Settings = {
            gcm: {
                id: 'slkj',
            },
            apn: {
                token: {
                    key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
                    keyId: 'ABCD',
                    teamId: 'EFGH',
                },
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
                gcmAPIKey: 'gcmkey',
                TTL: 2419200,
                contentEncoding: 'aes128gcm',
                headers: {}
            },
            isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
        };

        const push = new PushNotifications(settings);

    }

}
