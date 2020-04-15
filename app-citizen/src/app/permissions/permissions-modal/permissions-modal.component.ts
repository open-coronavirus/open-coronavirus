import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {PatientService} from '../../shared/services/patient.service';
import {GeolocationTrackingService} from "../../shared/services/tracking/geolocation-tracking.service";
import {BluetoothTrackingService} from "../../shared/services/tracking/bluetooth-tracking.service";
import {PushNotificationService} from "../../shared/services/push-notification.service";
import { PermissionsService } from 'src/app/shared/services/permissionsService.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-permissions-modal',
  templateUrl: './permissions-modal.component.html',
  styleUrls: ['./permissions-modal.component.scss'],
})
export class PermissionsModalComponent implements OnInit {
  public type: string;

  constructor(
    public modalCtrl: ModalController,
    protected geolocationtrackingService: GeolocationTrackingService,
    protected pushNotificationService: PushNotificationService,
    protected bluetoothTrackingService: BluetoothTrackingService,
    public patientService: PatientService,
    public permissionsService: PermissionsService,
    protected navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.type = params.get('type');
    });
  }

  dismissModal() {
    this.permissionsService.goToNextPermission();
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

    this.dismissModal();
  }

}
