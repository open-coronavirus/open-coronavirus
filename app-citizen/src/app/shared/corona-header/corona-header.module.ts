import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoronaHeaderComponent} from './corona-header.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [CoronaHeaderComponent],
    exports: [CoronaHeaderComponent]
})
export class CoronaHeaderModule {}
