import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {I18nStringsComponent} from "./i18n-strings.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [I18nStringsComponent],
    exports: [I18nStringsComponent]
})
export class I18nStringsModule {}
