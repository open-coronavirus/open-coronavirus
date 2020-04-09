import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AvatarComponent} from './avatar.component';
import {NgxQRCodeModule} from 'ngx-qrcode2';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxQRCodeModule
    ],
    declarations: [AvatarComponent],
    exports: [AvatarComponent]
})
export class AvatarModule {}
