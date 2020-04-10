import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermissionsModalComponent } from './permissions-modal.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: PermissionsModalComponent }])
  ],
  declarations: [PermissionsModalComponent]
})
export class PermissionsPushModule { }
