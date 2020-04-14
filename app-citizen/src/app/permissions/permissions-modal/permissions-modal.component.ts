import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PatientService } from '../../shared/services/patient.service';
import {GeolocationTrackingService} from "../../shared/services/tracking/geolocation-tracking.service";
import {BluetoothTrackingService} from "../../shared/services/tracking/bluetooth-tracking.service";
import { PushNotificationService } from 'src/app/shared/services/push-notification.service';
@Component({
  selector: 'app-permissions-modal',
  templateUrl: './permissions-modal.component.html',
  styleUrls: ['./permissions-modal.component.scss'],
})
export class PermissionsModalComponent implements OnInit {
  public type: string;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    protected pushNotificationService: PushNotificationService,
    protected geolocationtrackingService: GeolocationTrackingService,
    protected bluetoothTrackingService: BluetoothTrackingService,
    public patientService: PatientService
  ) { }

  ngOnInit() {
    this.type = this.navParams.get('type');
  }

  dismissModal() {
    this.modalCtrl.dismiss({});
  }

  activatePermission() {
    switch (this.type) {
      case 'push':
        console.debug('Activating push ...');
        this.pushNotificationService.startPushNotifications();
        break;
      case 'gps':
        console.debug('Activating geolocation ...');
        this.geolocationtrackingService.startBackgroundGeolocation();
        break;
      case 'bluetooth':
        console.debug('Activating bluetooth tracking ...');
        this.bluetoothTrackingService.startBluetoothTracking();
        break;
    }

    this.modalCtrl.dismiss({});
  }

}
