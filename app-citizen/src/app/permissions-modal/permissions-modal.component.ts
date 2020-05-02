import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {PatientService} from '../shared/services/patient.service';
import {GeolocationTrackingService} from "../shared/services/tracking/geolocation-tracking.service";
import {BluetoothTrackingService} from "../shared/services/tracking/bluetooth-tracking.service";
import {PushNotificationService} from "../shared/services/push-notification.service";
import {PermissionsService} from 'src/app/shared/services/permissions.service';
import {ActivatedRoute} from '@angular/router';

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
        protected platform: Platform,
        public permissionsService: PermissionsService,
        protected navCtrl: NavController,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.permissionsService.hasPermission(params.get('type')).then(hasPermission => {
                //ask just for missing permissions
                console.log(params.get('type'));
                if (!hasPermission) {
                    //bluetooth on android also needs location service:
                    if (params.get('type') == 'bluetooth' && this.platform.is('android')) {
                        this.permissionsService.hasPermission('coarse-location').then(hasPermission => {
                            if (!hasPermission) {
                                this.type = 'coarse-location';
                            } else {
                                this.type = 'bluetooth';
                            }
                        });
                    } else {
                        this.type = params.get('type');
                    }
                } else {
                    this.dismissModal();
                }
            })
        });
    }

    dismissModal() {
        this.permissionsService.goToNextPermission();
    }

    activatePermission() {
        this.permissionsService.requestPermission(this.type).then(result => {
            this.dismissModal();
        })
    }

    isIOS() {
        return (this.platform.is('ios'));

    }

}
