import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SelfDeclarationLeaveComponent } from './self-declaration-leave.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{path: '', component: SelfDeclarationLeaveComponent}])
  ],
  declarations: [SelfDeclarationLeaveComponent]
})
export class SelfDeclarationLeaveModule { }
