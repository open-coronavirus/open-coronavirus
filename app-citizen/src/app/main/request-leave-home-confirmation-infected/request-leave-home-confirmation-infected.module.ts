import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RequestLeaveHomeConfirmationInfectedComponent } from './request-leave-home-confirmation-infected.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: RequestLeaveHomeConfirmationInfectedComponent }])
  ],
  declarations: [RequestLeaveHomeConfirmationInfectedComponent]
})
export class RequestLeaveHomeConfirmationInfectedModule { }
