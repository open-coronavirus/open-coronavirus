import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TermsAndConditionsComponent} from './terms-and-conditions.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [TermsAndConditionsComponent],
    exports: [TermsAndConditionsComponent]
})
export class TermsAndConditionsModule {}
