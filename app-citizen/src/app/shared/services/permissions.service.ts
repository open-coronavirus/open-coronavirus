import {Inject, Injectable} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {BluetoothLE} from "@ionic-native/bluetooth-le/ngx";
import {Push} from "@ionic-native/push/ngx";
import {PermissionType, Plugins} from "@capacitor/core";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {ContactTrackerService} from "./contacts/contact-tracker.service";
import {TracingService} from "./tracing.service";

const { PushNotifications, Permissions } = Plugins;

@Injectable()
export class PermissionsService {

    public permissionsRequested = false;
    public requiredPermissions: Array<string>;

    constructor(
        @Inject('settings') protected settings,
        protected router: Router,
        protected push: Push,
        protected diagnostic: Diagnostic,
        protected platform: Platform,
        protected tracingService: TracingService,
        protected androidPermissions: AndroidPermissions,
        protected bluetoothLe: BluetoothLE,
        protected navCtrl: NavController,
        protected contactTrackerService: ContactTrackerService
    ) {
        this.requiredPermissions = [];
    }

    async requestFirstPermission() {
        this.permissionsRequested = true;
        this.requiredPermissions = this.getRequiredPermissions();
        this.goToNextPermission();
    }

    goToNextPermissionIfPermissionsRequested() {
        if (this.permissionsRequested) {
            console.debug('Go to next permission');

            this.goToNextPermission();
        }
    }

    goToNextPermission() {
        if (this.requiredPermissions.length === 0) {
            this.permissionsRequested = false;
            this.navCtrl.navigateRoot(['app/home']);
        } else {
            this.navCtrl.navigateRoot(['permissions', this.requiredPermissions.shift()]);
        }
    }

    getRequiredPermissions(): Array<string> {
        const requiredPermissions = [];

        for (const type in this.settings.enabled) {
            if (this.settings.enabled[type]) {
                requiredPermissions.push(type);
            }
        }

        if (!this.settings.autoshare) {
            requiredPermissions.push('autoshare');
        }

        return requiredPermissions;
    }

    hasPermission(permission) {
        console.log('check permission: ' + JSON.stringify(permission));
        let returnValue: Promise<boolean> = new Promise(resolve => {
            switch (permission) {
                case 'bluetooth':
                    this.hasBluetoothPermission().then(result => {
                       resolve(result);
                    });
                    break;
                case 'push':
                    this.hasPushPermission().then(result => {
                        resolve(result);
                    });
                    break;
                case 'gps':
                    this.hasGPSPermission().then(result => {
                        resolve(result);
                    })
                    break;
                case 'coarse-location':
                    this.hasCoarseLocationPermission().then(result => {
                        resolve(result);
                    })
                    break;
                case 'autoshare':
                    resolve(false);
                    break;
            }
        });
        return returnValue;
    }

    requestPermission(permission) {
        let returnValue: Promise<boolean> = new Promise(resolve => {
            switch (permission) {
                case 'bluetooth':
                    this.requestBluetoothPermission().then(result => {
                        resolve(result);
                    })
                    break;
                case 'push':
                    this.requestRemotePushPermission().then(result => {
                        resolve(result);
                    })
                    break;
                case 'gps':
                    resolve(true);
                    break;
                case 'coarse-location':
                    this.requestCoarseLocationPermission().then(result => {
                        resolve(result);
                    });
                    break;
                case 'autoshare':
                    this.requestAutosharePermission().then(result => {
                        resolve(result);
                    });
                    break;

            }
        });
        return returnValue;
    }

    hasBluetoothPermission() {
        let returnValue: Promise<boolean> = new Promise(resolve => {
            if(this.platform.is('android')) {
                this.bluetoothLe.hasPermission().then(result => {
                    console.log('[PermissionService] has bluetooth permission: ' + JSON.stringify(result));
                    resolve(true);
                })
                .catch(error => {
                    console.error('[PermissionService] has bluetooth permission: ' + JSON.stringify(error));
                    resolve(false);
                });
            }
            else if(this.platform.is('ios')) {
                resolve(false);
            }
        });

        return returnValue;
    }

    hasPushPermission() {
        let returnValue: Promise<boolean> = new Promise(resolve => {
            Permissions.query({name: PermissionType.Notifications}).then(result => {
                console.log('[PermissionService] has push permission: ' + JSON.stringify(result));
                if (result.state == 'granted') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

        return returnValue;
    }

    hasGPSPermission() {
        let returnValue: Promise<boolean> = new Promise(resolve => {
            Permissions.query({ name: PermissionType.Geolocation }).then(result => {
                console.log('[PermissionService] has geolocation permission: ' + JSON.stringify(result));
                if(result.state == 'granted') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });

        return returnValue;
    }

    hasCoarseLocationPermission() {
        let returnValue: Promise<boolean> = new Promise(resolve => {
            if(this.platform.is('android')) {
                this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(result => {
                    console.log('[PermissionService] has geolocation permission: ' + JSON.stringify(result));
                    if (result.hasPermission) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }
            else {
                resolve(true);
            }
        });

        return returnValue;
    }

    public requestBluetoothPermission() {

        let returnValue: Promise<boolean> = new Promise(resolve => {

            if(this.platform.is('android')) {
                this.bluetoothLe.requestPermission().then(result => {
                    console.log('[PermissionService] bluetooth has been enabled: ' + JSON.stringify(result));
                    resolve(true);
                })
                .catch(error => {
                    console.error('[PermissionService] error trying to enable bluetooth: ' + JSON.stringify(error));
                    resolve(false);
                });
            }
            else if(this.platform.is('ios')) {
                this.diagnostic.requestBluetoothAuthorization().then(result => {
                    console.log("[PermissionService] request bluetooth result: " + JSON.stringify(result));
                    this.diagnostic.registerBluetoothStateChangeHandler(state => {
                        if(state === this.diagnostic.bluetoothState.POWERED_ON){
                            console.log('[PermissionService] bluetooth has been enabled: ' + JSON.stringify(state));
                            console.log("Bluetooth is able to connect");
                            resolve(true);
                        }
                        else {
                            console.error('[PermissionService] bluetooth has noty been enabled: ' + JSON.stringify(state));
                        }
                    });
                })
                .catch(error => {
                    console.error('[PermissionService] error trying to enable bluetooth: ' + JSON.stringify(error));
                    resolve(false);
                });
            }

        });

        return returnValue;

    }

    public requestRemotePushPermission() {

        let returnValue = new Promise<boolean>(resolve => {

            PushNotifications.requestPermission().then( result => {
                console.log("[PermissionService] push permission request result: " + JSON.stringify(result));
                if (result.granted) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })

        });

        return returnValue;

    }

    public requestCoarseLocationPermission() {

        let returnValue = new Promise<boolean>(resolve => {

            if(this.platform.is('android')) {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(result => {
                    console.log("[PermissionService] coarse location permission request result: " + JSON.stringify(result));
                    resolve(true);
                })
                .catch(error => {
                    console.error("[PermissionService] Error trying to request coarse location permission: " + JSON.stringify(error));
                    resolve(false);
                });
            }
            else {
                resolve(true);
            }
        });

        return returnValue;

    }

    public requestAutosharePermission() {
        const returnValue = new Promise<boolean>(resolve => {
            this.tracingService.activateAutoShare();
            resolve(true);
        });

        return returnValue;
    }


}
