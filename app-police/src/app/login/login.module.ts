import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';
import {LoginFormModule} from '../shared/login-form/login-form.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        LoginFormModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: LoginComponent }])
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
