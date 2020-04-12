import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RequestLeaveHomeConfirmationNoTestComponent } from './request-leave-home-confirmation-no-test.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: RequestLeaveHomeConfirmationNoTestComponent }])
  ],
  declarations: [RequestLeaveHomeConfirmationNoTestComponent]
})
export class RequestLeaveHomeConfirmationNoTestModule { }
