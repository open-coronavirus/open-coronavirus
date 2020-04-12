import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contact-upload-request',
  templateUrl: './contact-upload-request.component.html',
  styleUrls: ['./contact-upload-request.component.scss'],
})
export class ContactUploadRequestComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss({accepts: false});
  }

  acceptUpload() {
    this.modalCtrl.dismiss({accepts: true});
  }
}
