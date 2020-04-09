import {Injectable} from "@angular/core";
import {BluetoothLE} from "@ionic-native/bluetooth-le/ngx";
import {Platform} from "@ionic/angular";
import {BluetoothLeAdvertisementControllerService} from "../../sdk";
import {BehaviorSubject, Subject} from "rxjs";
import {BLE} from "@ionic-native/ble/ngx";
import {ContactTrackerService} from "../contacts/contact-tracker.service";

@Injectable()
export class BluetoothTrackingService {

    public btEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _patientServiceUUID;

    protected addressesBeingTracked = new Map<string, boolean>();

    public static serviceUUID = "C0C0C0C0-DEE8-B109-8DB0-3DBD690003C0";

    protected myAddress;

    get patientServiceUUID() {
        return this._patientServiceUUID;
    }

    protected restoreKey = "Open Coronavirus";

    set patientServiceUUID(value) {
        this._patientServiceUUID = value;
    }

    constructor(protected bluetoothle: BluetoothLE,
                protected ble: BLE,
                protected platform: Platform,
                protected contactTrackerService: ContactTrackerService,
                protected bluetoothLeAdvertisementControllerService: BluetoothLeAdvertisementControllerService,
                ) {

    }

    public startBluetooth() {

        if(this._patientServiceUUID == null) {
            throw new Error("Need to set a value to patientServiceUUID before calling startBluetooth!!!");
        }

        this.checkBLEPermission();

        this.platform.ready().then((readySource) => {

            console.debug("[BluetoothLE] Initialize bluetooth LE ...");

            // request => true / false (default) - Should user be prompted to enable Bluetooth
            // statusReceiver => true / false (default) - Should change in Bluetooth status notifications be sent.
            // restoreKey => A unique string to identify your app. Bluetooth Central background mode is required to
            // use this, but background mode doesn't seem to require specifying the restoreKey.
            let params = {request: true, statusReceiver: false, restoreKey : this.restoreKey};

            this.bluetoothle.initialize(params).subscribe(result => {
                console.debug("[BluetoothLE] Initialization result: " + JSON.stringify(result));
            });
            //Use this way because the issue iOS: initialize promise resolve not called #477
            setTimeout(() => {
                this.btEnabled$.next(true);
            }, 10000);

        });

        this.btEnabled$.subscribe(enabled => {
            if(enabled) {
                this.startScan();
                this.startAdvertising();
            }
        })

        return this.btEnabled$;

    }


    //Check if application having BluetoothLE access permission
    checkBLEPermission() {

        this.bluetoothle.hasPermission().then(permission => {
            if(!permission.hasPermission) {
                this.bluetoothle.requestPermission().then((res) => {
                    //todo: show the right alert
                    console.debug(res.requestPermission);
                    console.debug("[BluetoothLE] res :" + JSON.stringify(res));
                }, (err) => {
                    console.debug("[BluetoothLE] err: " + JSON.stringify(err));
                });
            }
        });

    }

    protected addService() {

        console.debug("[BluetoothLE] Add service with UUID: " + this._patientServiceUUID);

        let returnValue: Subject<boolean> = new Subject();

        let params = {
            service: BluetoothTrackingService.serviceUUID,
            characteristics: [
                {
                    uuid: this._patientServiceUUID,
                    permissions: {
                        read: true,
                        write: false,
                    },
                    properties : {
                        read: true,
                        writeWithoutResponse: false,
                        write: false,
                        notify: true,
                        indicate: true
                    }
                }
            ]
        };

        this.bluetoothle.addService(params).then(result => {
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

        console.debug("[BluetoothLE] start advertise ...");

        let params = {
            "request": true, //Should user be prompted to enable Bluetooth
            "restoreKey": this.restoreKey
        };

        this.bluetoothle.initializePeripheral(params).subscribe(result => {

            if(result.status == 'enabled') {

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

                        this.bluetoothle.startAdvertising(params).then(result => {
                            console.debug("[BluetoothLE] Started advertising: " +  JSON.stringify(result));
                        })
                        .catch(error => {
                            console.error("[BluetoothLE] Error trying to advertise: " + JSON.stringify(error));
                        })
                    }

                });

            }

        });


    }

    public startScan(continuousScanning = true) {

        console.debug("[BluetoothLE] Start scanning ...");
        this.ble.startScan([BluetoothTrackingService.serviceUUID]).subscribe(device => {

            if (!this.contactTrackerService.isKnownContact(device.id)) {
                //avoid duplicate calls while processing an item (because this is a subscription callback from ble.scan method
                console.debug('[BluetoothLE] connecting to ' + device.id + " ...");
                this.ble.connect(device.id).subscribe(result => {
                        console.debug('[BluetoothLE] connected result: ' + JSON.stringify(result));
                        result.characteristics.forEach(characteristic => {
                            if (characteristic.service.toUpperCase() == BluetoothTrackingService.serviceUUID) {
                                let targetCharacteristicUUID = characteristic.characteristic;
                                console.debug("******>>> Open Coronavirus Target UUID detected: " + targetCharacteristicUUID + ", rssi: " + device.rssi);
                                //now save the device, with the address and so on into local storage
                                if (!this.addressesBeingTracked.has(device.id)) {
                                    this.addressesBeingTracked.set(device.id, true);
                                    this.contactTrackerService.trackContact(targetCharacteristicUUID, device.rssi, device.id);
                                }
                            }
                        });
                    },
                    peripheralData => {
                        console.error('[BluetoothLE] error connecting: ' + JSON.stringify(peripheralData));
                    });
            } else {
                this.contactTrackerService.updateTrack(device.id, device.rssi);
            }

        });

        if (continuousScanning) {
            setTimeout(() => {
                this.stopScan(continuousScanning);
            }, 10000);
        }

    }

    public stopScan(continuousScanning = true) {
        this.ble.stopScan().then(result => {
            if(continuousScanning) {
                setTimeout(() => {
                    this.startScan(continuousScanning);
                }, 10000);
            }
        })
    }




}
