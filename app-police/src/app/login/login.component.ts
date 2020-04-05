import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { Patient, PatientWithRelations } from '../shared/sdk';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { LoginFormComponent } from '../shared/login-form/login-form.component';
import { UserService } from '../shared/services/user.service';
import { UserCredentials } from '../shared/sdk/model/userCredentials';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent {

    @ViewChild('loginFormComponent', { static: true }) protected loginFormComponent: LoginFormComponent;

    protected userCredentials: UserCredentials;
    public loginForm: FormGroup;

    // get acceptterms() { return this.loginForm.get('acceptterms'); }

    // protected accepttermsValuer: boolean;

    public error: string;
    public formTriedToSubmit = false;

    constructor(
        protected formBuilder: FormBuilder,
        protected userService: UserService,
        public loadingController: LoadingController,
        protected router: Router) {
        this.loginForm = this.formBuilder.group({
            // acceptterms: new FormControl(this.accepttermsValuer, [Validators.requiredTrue ])
        });
    }

    public onSubmit() {
        this.formTriedToSubmit = true;
        this.loginFormComponent.validate();
        if (this.loginForm.valid && this.loginFormComponent.isValid) {
            this.login();
        }
    }

    async login() {
        if (this.loginFormComponent.isValid) {
            const loading = await this.loadingController.create({
                message: 'Por favor, espere...'
            });
            await loading.present();

            this.userCredentials = this.loginFormComponent.user;
            this.userService.login(this.userCredentials).subscribe(res => {
                loading.dismiss();
                if (res != null && res !== false) {
                    this.router.navigate(['/app/qr-reader']);
                } else {
                    // go to error page
                    // this.error = ;
                    console.error("error login");
                    // test
                    this.router.navigate(['/app/qr-reader']);
                }
            }, err => {
                // console.log("login: ", err);
                loading.dismiss();
                this.error = err.message;

            });

        }
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Por favor, espere...',
            duration: 2000
        });
        await loading.present();

        const { role, data } = await loading.onDidDismiss();
        console.log('Loading dismissed!');
    }

}
