import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginFormComponent} from './login-form.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [LoginFormComponent],
    exports: [LoginFormComponent]
})
export class LoginFormModule {}
