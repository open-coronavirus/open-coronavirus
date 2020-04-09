import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-permissions-modal',
  templateUrl: './permissions-modal.component.html',
  styleUrls: ['./permissions-modal.component.scss'],
})
export class PermissionsModalComponent implements OnInit {
  public type: string;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.type = this.navParams.get('type');
  }

  dismissModal() {
    this.modalCtrl.dismiss({});
  }

  activatePermission() {
    this.modalCtrl.dismiss({});
  }

}
