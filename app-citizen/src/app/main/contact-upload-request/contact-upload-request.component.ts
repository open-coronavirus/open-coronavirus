import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PatientStatus } from '../../../../../server/src/common/utils/enums';
import { PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-contact-upload-request',
  templateUrl: './contact-upload-request.component.html',
  styleUrls: ['./contact-upload-request.component.scss'],
})
export class ContactUploadRequestComponent implements OnInit {
  public autoShareActivated: boolean;

  public isInfected: boolean;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    protected patientService: PatientService,

  ) { }

  ngOnInit() {
    this.isInfected = this.patientService.patient.status === PatientStatus.INFECTED;
  
    this.isInfected = false;

    this.autoShareActivated = this.navParams.get('autoShareActivated');
  }

  dismissModal() {
    this.modalCtrl.dismiss({ accepts: false });
  }

  acceptUpload() {
    this.modalCtrl.dismiss({ accepts: true });
  }
}
