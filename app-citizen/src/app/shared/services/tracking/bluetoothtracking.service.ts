import {Injectable} from "@angular/core";
import {BluetoothCallbackType, BluetoothLE, BluetoothMatchNum, BluetoothScanMode} from "@ionic-native/bluetooth-le/ngx";
import {Platform} from "@ionic/angular";
import {ScanStatus} from "@ionic-native/bluetooth-le";
import {BluetoothLeAdvertisement, BluetoothLeAdvertisementControllerService, PatientWithRelations} from "../../sdk";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class BlueToothTrackingService {

    public btEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    protected patientServiceUUID;

    constructor(protected bluetoothle: BluetoothLE,
                protected plt: Platform,
                protected bluetoothLeAdvertisementControllerService: BluetoothLeAdvertisementControllerService,
                ) {

        this.checkBLEPermission();

        this.plt.ready().then((readySource) => {

            // request => true / false (default) - Should user be prompted to enable Bluetooth
            // statusReceiver => true / false (default) - Should change in Bluetooth status notifications be sent.
            // restoreKey => A unique string to identify your app. Bluetooth Central background mode is required to
            // use this, but background mode doesn't seem to require specifying the restoreKey.
            let params = {request: true, statusReceiver: false, restoreKey : "OpenCoronavirus"};
            this.bluetoothle.initialize(params).subscribe(ble => {
                if(ble.status == 'enabled') {
                    this.btEnabled$.next(true);
                }
                else {
                    //show message to user to enable bluetooth
                }
            });

        });

    }

    //Check if application having BluetoothLE access permission
    checkBLEPermission() {
        this.bluetoothle.requestPermission().then((res) => {
            //todo: show the right alert
            console.log(res.requestPermission);
            console.log("res :" + res);
        }, (err) => {
            console.log("err: " + err);
        })
    }

    public startAdvertising(patient: PatientWithRelations) {

        this.patientServiceUUID = patient.serviceAdvertisementUUID;

        var params = {
            "services": [this.patientServiceUUID], //iOS
            "service": this.patientServiceUUID, //Android
            "name":"Open Coronavirus",
        };

        this.bluetoothle.startAdvertising(params);

    }

    public stopAdvertising() {
        this.bluetoothle.stopAdvertising();
    }

    public startScan() {

        this.bluetoothle.getAdapterInfo().then(adapterInfo => {
            //ensure that the bluetooth is not being scaning
            if(!adapterInfo.isScanning) {
                let params = {
                    scanMode: BluetoothScanMode.SCAN_MODE_BALANCED,
                    matchNum: BluetoothMatchNum.MATCH_NUM_MAX_ADVERTISEMENT,
                    callbackType: BluetoothCallbackType.CALLBACK_TYPE_ALL_MATCHES,
                    isConnectable: false
                }

                this.bluetoothle.startScan(params).subscribe((result: ScanStatus) => {

                    let targetServiceUUID = null;
                    if(result != null) {
                        if(typeof result.advertisement === "string") {
                            targetServiceUUID = result.advertisement;
                        }
                        else {
                            if(result.advertisement.serviceUuids.length > 0) {
                                targetServiceUUID = result.advertisement.serviceUuids[0];
                            }
                        }
                        if(targetServiceUUID != null) {
                            let bluetoothLeAdvertisement: BluetoothLeAdvertisement = new class implements BluetoothLeAdvertisement {
                                [key: string]: object | any;

                                created: string;
                                id: string;
                                sourceServiceUUID: string;
                                targetServiceUUID: string;
                            };

                            bluetoothLeAdvertisement.sourceServiceUUID = this.patientServiceUUID;
                            bluetoothLeAdvertisement.targetServiceUUID = targetServiceUUID;
                            bluetoothLeAdvertisement.rssi = result.rssi;

                            this.bluetoothLeAdvertisementControllerService.bluetoothLeAdvertisementControllerCreate(bluetoothLeAdvertisement);
                        }

                    }

                });

                setTimeout(() => {
                    this.stopScan();
                }, 5000);
            }
        });

    }

    public stopScan(numberOfRetries = 3) {
        this.bluetoothle.stopScan().then(result => {
            if(result.status != 'scanStopped' && numberOfRetries > 0) {
                setTimeout(() => {
                    this.stopScan(numberOfRetries - 1);
                }, 5000);
            }
            else {
                setTimeout(() => {
                    this.startScan();
                }, 5000);
            }
        });
    }


}
