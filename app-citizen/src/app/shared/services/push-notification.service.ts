import {Injectable} from "@angular/core";
import {Push} from "@ionic-native/push/ngx";
import {PushObject, PushOptions} from "@ionic-native/push";

@Injectable()
export class PushNotificationService {

    constructor(private push: Push) { }

    protected pushObject: PushObject;

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
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        }

        this.pushObject = this.push.init(options);

        console.log('[PushService] push object: ' + JSON.stringify(this.pushObject));

        this.pushObject.on('registration').subscribe(registration => {
            console.log("[PushService] Registration data: " + JSON.stringify(registration));
        },
        error => {
            console.error("[PushService] Registration error: " + JSON.stringify(error));
        });

        this.pushObject.on('error').subscribe(e => {
            console.error("[PushService] Push error: " + JSON.stringify(e));
        });

        this.pushObject.on('notification').subscribe(data => {
            console.log('[PushService] Notification received: ' + JSON.stringify(data));
        })

    }

}
