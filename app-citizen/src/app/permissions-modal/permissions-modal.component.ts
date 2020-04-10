import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PatientService } from '../shared/services/patient.service';
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
        break;
      case 'gps':
        this.patientService.startGeoTracking(this.patientService.patient);
        break;
      case 'bluetooth':
        this.patientService.startBluetoothTracking(this.patientService.patient);
        break;
    }

    this.modalCtrl.dismiss({});
  }

}
