import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RequestLeaveHomeConfirmationMandatoryQuarentineComponent } from './request-leave-home-confirmation-mandatory-quarentine.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: RequestLeaveHomeConfirmationMandatoryQuarentineComponent }])
  ],
  declarations: [RequestLeaveHomeConfirmationMandatoryQuarentineComponent]
})
export class RequestLeaveHomeConfirmationMandatoryQuarentineModule { }
