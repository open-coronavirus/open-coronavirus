import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ContactUploadRequestComponent } from './contact-upload-request.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: ContactUploadRequestComponent }])
  ],
  declarations: [ContactUploadRequestComponent]
})
export class ContactUploadRequestModule { }
