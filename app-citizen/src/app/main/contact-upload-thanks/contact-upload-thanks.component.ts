import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contact-upload-thanks',
  templateUrl: './contact-upload-thanks.component.html',
  styleUrls: ['./contact-upload-thanks.component.scss'],
})
export class ContactUploadThanksComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss({});
  }
}
