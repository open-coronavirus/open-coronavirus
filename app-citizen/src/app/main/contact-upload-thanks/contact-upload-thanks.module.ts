import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ContactUploadThanksComponent } from './contact-upload-thanks.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: ContactUploadThanksComponent }])
  ],
  declarations: [ContactUploadThanksComponent]
})
export class ContactUploadThanksModule { }
