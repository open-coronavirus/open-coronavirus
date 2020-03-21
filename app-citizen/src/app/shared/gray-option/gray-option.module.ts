import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {GrayOptionComponent} from './gray-option.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxQRCodeModule
    ],
    declarations: [GrayOptionComponent],
    exports: [GrayOptionComponent]
})
export class GrayOptionModule {}
