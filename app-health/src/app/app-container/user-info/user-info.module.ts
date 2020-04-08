import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {  UserInfoComponent } from './user-info.component';
import { AvatarModule } from '../../shared/avatar/avatar.module';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        AvatarModule,
        RouterModule.forChild([{path: '', component: UserInfoComponent}])
    ],
    declarations: [UserInfoComponent]
})
export class UserInfoModule {}
