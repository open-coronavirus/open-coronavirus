import {Inject, Injectable} from "@angular/core";
import {BluetoothLE, ConnectionPriority} from "@ionic-native/bluetooth-le/ngx";
import {Platform} from "@ionic/angular";
import {BehaviorSubject, Subject} from "rxjs";
import {ContactTrackerService} from "../contacts/contact-tracker.service";
import {PatientService} from "../patient.service";
import {PermissionsService} from '../permissions.service';
import {Plugins} from "@capacitor/core";
import {EncryptedKey, KeyManagerService} from "../keys/key-manager.service";


const { App, BackgroundTask } = Plugins;

@Injectable()
export class BluetoothTrackingService {

    public btEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    protected addressesBeingTracked = new Map<string, boolean>();
    protected keySents = new Map<string, boolean>();

    public static serviceUUID = "C0C0C0C0-DEE8-B109-8DB0-3DBD690003C0";
    public static characteristicUUID = "CACACACA-DEE8-B109-8DB0-3DBD690003C0";
    public static timeScanningInMillis = 10000;
    public static timeWithoutScanningInMillis = 30000;

    protected myAddress;

    protected activated = false;

    protected isScanning = false;
    protected isAdvertising = false;
    protected scanTimeout;
    protected backgroundMode = false;

    protected knownAddress = new Map<string, boolean>();
    protected bluetoothRSSIs = new Map<string, number>();
    protected bluetoothMessages = new Map<string, BTLEMessage>();

    protected restoreKey = "Open Coronavirus";

    constructor(protected bluetoothLE: BluetoothLE,
                protected platform: Platform,
                protected keyManager: KeyManagerService,
                protected patientService: PatientService,
                protected permissionsService: PermissionsService,
                @Inject('settings') protected settings,
                protected contactTrackerService: ContactTrackerService
    ) {

    }

    public startBluetoothTracking() {

        this.prepareBackgroundMode();

        this.platform.ready().then((readySource) => {
            if (this.settings.enabled.bluetooth && this.activated == false) {

                this.activated = true;
                console.debug("[BluetoothLE] Initialize bluetooth LE ...");

                // request => true / false (default) - Should user be prompted to enable Bluetooth
                // statusReceiver => true / false (default) - Should change in Bluetooth status notifications be sent.
                // restoreKey => A unique string to identify your app. Bluetooth Central background mode is required to
                // use this, but background mode doesn't seem to require specifying the restoreKey.
                let params = {request: true, statusReceiver: false, restoreKey: this.restoreKey};

                this.bluetoothLE.initialize(params).subscribe(result => {
                    console.debug("[BluetoothLE] Initialization result: " + JSON.stringify(result));
                });
                //Use this way because the issue iOS: initialize promise resolve not called #477
                setTimeout(() => {
                    this.btEnabled$.next(true);
                }, 10000);

                this.btEnabled$.subscribe(enabled => {
                    if (enabled) {
                        this.startScan();
                        this.startAdvertising();
                    }
                })

            } else {
                this.permissionsService.goToNextPermissionIfPermissionsRequested();
            }
        });

        return this.btEnabled$;

    }

    protected prepareBackgroundMode() {
        App.addListener('appStateChange', (state) => {

            if (!state.isActive) {

                // The app has become inactive. We should check if we have some work left to do, and, if so,
                // execute a background task that will allow us to finish that work before the OS
                // suspends or terminates our app:
                let taskId = BackgroundTask.beforeExit(async () => {

                    this.startScanningInBackgroundMode();
                    if(!this.isAdvertising) {
                        this.startAdvertising();
                    }

                    BackgroundTask.finish({
                        taskId
                    });

                });
                this.backgroundMode = true;

            }
            else {
                if(this.backgroundMode) {
                    this.startScanningInForegroundMode();
                }
                this.backgroundMode = false;
            }

        });
    }


    protected addService() {

        console.debug("[BluetoothLE] Add service with UUID: " + BluetoothTrackingService.serviceUUID);

        let returnValue: Subject<boolean> = new Subject();

        let params = {
            service: BluetoothTrackingService.serviceUUID,
            characteristics: [
                {
                    uuid: BluetoothTrackingService.characteristicUUID,
                    permissions: {
                        read: true,
                        write: true,
                    },
                    properties : {
                        read: true,
                        writeWithoutResponse: true,
                        write: true,
                        notify: true,
                        indicate: true
                    }
                }
            ]
        };

        this.bluetoothLE.addService(params).then(result => {
            console.debug('[BluetoothLE] addService result: ' + JSON.stringify(result));
            returnValue.next(true);
        })
        .catch(error => {
            console.error('[BluetoothLE] addService error: ' + JSON.stringify(error));
            returnValue.next(false);
        });

        return returnValue;
    }

    public startAdvertising() {

        if(!this.isAdvertising) {
            this.isAdvertising = true;

            console.debug("[BluetoothLE] start advertise ...");

            let params = {
                "request": true, //Should user be prompted to enable Bluetooth
                "restoreKey": this.restoreKey
            };

            this.bluetoothLE.initializePeripheral(params).subscribe(result => {

                console.log('[BluetoothLE] Callback received: ' + JSON.stringify(result));

                if (result.status == 'enabled') {

                    this.addService().subscribe(result => {

                        if (result) {

                            let params = {
                                "services": [BluetoothTrackingService.serviceUUID], //iOS
                                "service": BluetoothTrackingService.serviceUUID, //Android
                                "name": "Open Coronavirus",
                                "includeDeviceName": false,
                                "mode": 'balanced',
                                "connectable": true,
                                "timeout": 0,
                            };

                            this.bluetoothLE.startAdvertising(params).then(result => {
                                console.debug("[BluetoothLE] Started advertising: " + JSON.stringify(result));
                            })
                            .catch(error => {
                                console.error("[BluetoothLE] Error trying to advertise: " + JSON.stringify(error));
                            });
                        }

                    });

                }
                else if(result.status == 'writeRequested' ) {

                    if(result.service == BluetoothTrackingService.serviceUUID && result.characteristic == BluetoothTrackingService.characteristicUUID) {

                        //first of all
                        this.bluetoothLE.respond(<any>{
                            address: result.address,
                            requestId: result.requestId,
                            value: result.value
                        });

                        console.debug("[BluetoothLE] Received key part from " + result.address + ", part: " + result.value);

                        if(!this.bluetoothMessages.has(result.address)) {
                            this.bluetoothMessages.set(result.address, new BTLEMessage(this.bluetoothLE));
                        }
                        let btleMessage = this.bluetoothMessages.get(result.address);

                        btleMessage.addPart(result.requestId, result.value);

                        if(btleMessage.isMessageCompleted()) {
                            let message = btleMessage.getMessage();
                            console.debug("**************************************************************");
                            console.debug("    Received key from " + result.address + ": " + message);
                            console.debug("**************************************************************");
                            let encryptedKey: EncryptedKey = JSON.parse(message);
                            let rssi = null;
                            if(this.bluetoothRSSIs.has(result.address)) {
                                rssi = this.bluetoothRSSIs.get(result.address);
                            }
                            this.contactTrackerService.trackContact(result.address, encryptedKey, rssi);
                            //don't forget to remove the message structure
                            this.bluetoothMessages.delete(result.address);
                        }

                    }

                }


            });

        }

    }

    protected sendKey(address: string) {

        let encryptedData = this.keyManager.generateEncryptedKey();

        let jsonEncryptedData = JSON.stringify(encryptedData);

        console.debug('[BluetoothLE] connecting to ' + address + " ...");

        this.bluetoothLE.connect({address: address}).subscribe(connectionResult => {

            console.debug('[BluetoothLE] connected to ' + address + ": " + JSON.stringify(connectionResult));

            if (connectionResult.status == 'connected') {

                this.changeConnectionPriority(address).then(result => {

                    this.bluetoothLE.discover({address: address, clearCache: true}).then(async discoverResult => {

                        console.debug('[BluetoothLE] discover result to ' + address + ": " + JSON.stringify(discoverResult) + " - encrypted: " + jsonEncryptedData);

                        do {
                            let jsonPart;
                            if(jsonEncryptedData.length > 12) {
                                jsonPart = jsonEncryptedData.substring(0, 12);
                                jsonEncryptedData = jsonEncryptedData.substring(12);
                            }
                            else {
                                jsonPart = jsonEncryptedData;
                                jsonEncryptedData = "";
                            }
                            let value = this.bluetoothLE.bytesToEncodedString(this.bluetoothLE.stringToBytes(jsonPart));
                            console.debug('[BluetoothLE] will write to ' + address + ' data: [' + jsonPart + "], encoded: [" + value + "]");
                            await this.write(address, value);

                        } while(jsonEncryptedData.length > 0);

                        this.keySents.set(address, true);
                        //finally disconnect from the remote bluetooth address
                        this.bluetoothLE.disconnect({address: address});

                    });

                });
            }

        });

    }

    async write(address, value) {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                this.bluetoothLE.write({
                    address: address,
                    service: BluetoothTrackingService.serviceUUID,
                    characteristic: BluetoothTrackingService.characteristicUUID,
                    value: value
                }).then(result => {
                    console.debug('[BluetoothLE] key written to ' + address + ": " + JSON.stringify(result));
                    resolve();
                })
                .catch(error => {
                    reject();
                    console.debug('[BluetoothLE] error trying to write key to ' + address + ": " + JSON.stringify(error));
                    this.bluetoothLE.close({address: address}).then(closed => {

                    })
                    .finally(() => {
                        console.debug("[BluetoothLE] trying again in 5 seconds ...")
                        setTimeout(() => {
                            this.sendKey(address);
                        }, 5000);
                    })
                });
            }, 200); //ensure that each call to write is separated at least 200 millis

        });

    }

    public changeConnectionPriority(address: string, priority: ConnectionPriority = "high") {
        return new Promise((resolve, reject) => {
            //just in android: change priority to hight
            if (this.platform.is('android')) {
                this.bluetoothLE.requestConnectionPriority({
                    address: address,
                    connectionPriority: priority
                }).then(result => {
                    console.debug("[BluetoothLE] request connection priority result: " + JSON.stringify(result));
                    resolve();
                })
                .catch(error => {
                    console.error("[BluetoothLE] error requesting connection priority result: " + JSON.stringify(error));
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    public startScan(backgroundMode = false) {

        if (!this.isScanning) {

            this.isScanning = true;

            if (backgroundMode) {
                console.debug("[BluetoothLE] Start scanning in background mode ...");
            } else {
                console.debug("[BluetoothLE] Start scanning ...");
            }

            let params = {
                "services": [
                    BluetoothTrackingService.serviceUUID,
                ],
                "allowDuplicates": false,
                "scanMode": this.bluetoothLE.SCAN_MODE_BALANCED,
                "matchMode": this.bluetoothLE.MATCH_MODE_AGGRESSIVE,
                "matchNum": this.bluetoothLE.MATCH_NUM_MAX_ADVERTISEMENT,
                "callbackType": this.bluetoothLE.CALLBACK_TYPE_ALL_MATCHES,
            };

            this.bluetoothLE.startScan(params).subscribe(device => {

                console.debug("[BluetoothLE] Scan callback received: " + JSON.stringify(device));

                if(device.address != null) {
                    this.bluetoothRSSIs.set(device.address, device.rssi);

                    if (!this.knownAddress.has(device.address)) {
                        this.knownAddress.set(device.address, true);
                        console.debug("**************************************************************");
                        console.debug("    Send Key to " + device.address + ", rssi: " + device.rssi);
                        console.debug("**************************************************************");
                        this.sendKey(device.address);
                        //wait and check after 30 seconds that the key has been sent,
                        //otherwise remove from knownAddress to force resend the key again.
                        setTimeout(() => {
                            if(!this.keySents.has(device.address)) {
                                this.bluetoothLE.close({address: device.address}).finally(() => {
                                    this.knownAddress.delete(device.address);
                                });
                            }
                        }, 30000);
                    } else {
                        this.contactTrackerService.updateTrack(device.address, device.rssi);
                    }
                }

            });

            if (!backgroundMode) {
                this.scanTimeout = setTimeout(() => {
                    this.stopScan(backgroundMode);
                }, BluetoothTrackingService.timeScanningInMillis);
            }
        }

    }

    public stopScan(backgroundMode = false) {
        let returnValue: Promise<boolean> = new Promise(resolve => {
            if(this.isScanning) {
                this.isScanning = false;
                if (backgroundMode) {
                    console.debug("[BluetoothLE] Stop scanning in background mode ...");
                } else {
                    console.debug("[BluetoothLE] Stop scanning ...");
                }
                this.bluetoothLE.stopScan().then(result => {
                    console.log('[BluetoothLE] Stop scanning successfully!');
                    resolve(true);
                })
                .catch(error => {
                    console.error('[BluetoothLE] Error trying to stop scanning: ' + JSON.stringify(error));
                    resolve(false);
                })
                .finally(() => {
                    if (!backgroundMode) {
                        this.scanTimeout = setTimeout(() => {
                            this.startScan(backgroundMode);
                        }, BluetoothTrackingService.timeWithoutScanningInMillis);
                    }
                });
            }
            else {
                resolve(true);
            }
        });

        return returnValue;
    }

    public startScanningInBackgroundMode() {
        if(this.scanTimeout != null) {
            clearTimeout(this.scanTimeout);
        }
        if(this.isScanning) { //always stop if scanning in order to start in background mode
            this.stopScan(true).then(result => {
                this.startScan(true);
            });
        }
        this.startScan(true);
    }

    public startScanningInForegroundMode() {
        if(this.isScanning) {
            this.stopScan(true);
        }
        this.startScan();
    }




}


class BTLEMessage {

    protected messages = new Map<number, string>();

    public constructor(protected bluetoothLE: BluetoothLE) {}

    addPart(requestId, message) {
        this.messages.set(requestId, message);
    }

    isMessageCompleted() {
        let message = this.getMessage();
        console.log("Current message: " + message + " - Current memory structure: " + JSON.stringify(this.messages));
        try {
            JSON.parse(message);
            console.log("Current message is a valid JSON");
            return true;
        } catch (e) {
            console.log("Current message is NOT a valid JSON");
            return false;
        }
    }

    getMessage() {
        let returnValue = "";

        let keys = [...this.messages.keys()];
        let sortedKeys = keys.sort();
        sortedKeys.forEach((key)=>{
            returnValue += this.bluetoothLE.bytesToString(this.bluetoothLE.encodedStringToBytes(this.messages.get(key)));
        });
        return returnValue;
    }

}
