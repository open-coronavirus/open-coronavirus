import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoronaHeaderComponent} from './header.component';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import { AvatarModule } from '../avatar/avatar.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxQRCodeModule,
        AvatarModule,
    ],
    declarations: [CoronaHeaderComponent],
    exports: [CoronaHeaderComponent]
})
export class CoronaHeaderModule {}
