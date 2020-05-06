import {Component, Inject, LOCALE_ID, ViewChild} from '@angular/core';
import {PatientInfoFormComponent} from '../shared/patient-info-form/patient-info-form.component';
import {PatientService} from '../shared/services/patient.service';
import {Router} from '@angular/router';
import {PatientWithRelations} from '../shared/sdk';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {PrivacityConditionsService} from '../shared/services/privacity-conditions.service';
import {PermissionsService} from '../shared/services/permissions.service';

@Component({
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.scss']
})
export class RegisterComponent {

    @ViewChild('patientInfoFormComponent', { static: true }) protected patientInfoFormComponent: PatientInfoFormComponent;

    protected patient: PatientWithRelations;
    public registerPatientForm: FormGroup;

    get acceptterms() { return this.registerPatientForm.get('acceptterms'); }

    protected accepttermsValuer: boolean;

    public formTriedToSubmit: boolean = false;

    constructor(
        protected formBuilder: FormBuilder,
        protected patientService: PatientService,
        @Inject(LOCALE_ID) protected locale: string,
        protected alertController: AlertController,
        public loadingController: LoadingController,
        private privacityConditionsService: PrivacityConditionsService,
        protected router: Router,
        private permissionService: PermissionsService,
        private navCtrl: NavController,
    ) {
        this.registerPatientForm = this.formBuilder.group({
            acceptterms: new FormControl(this.accepttermsValuer, [Validators.requiredTrue])
        });
    }

    public onSubmit() {
        this.formTriedToSubmit = true;
        this.patientInfoFormComponent.validate();
        if (this.registerPatientForm.valid && this.patientInfoFormComponent.isValid) {
            this.register();
        }
    }

    async register() {
        if (this.patientInfoFormComponent.isValid) {
            const loading = await this.loadingController.create({
                message: $localize`:@@pleaseWait:Por favor, espere`
            });
            await loading.present();
            this.patient = this.patientInfoFormComponent.patient;
            this.patientService.register(this.patient).subscribe(newPatient => {
                loading.dismiss();
                if (newPatient != null && newPatient != false) {
                    this.permissionService.requestFirstPermission();
                } else {
                    // go to error page
                    this.navCtrl.navigateRoot(['/no-access']);
                }
            }, err => {
                loading.dismiss();
                this.showError(err.error.error.message);
            });

        }
    }

    async showError(message) {

        let alert = await this.alertController.create({
            header: 'Error',
            message: message,
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                    }
                }
            ]
        });

        await alert.present();
    }

    showPrivacityConditions(ev) {
        ev.preventDefault();
        this.privacityConditionsService.showPrivacityConditions();
    }

    showTermsAndConditions(ev) {
        ev.preventDefault();
        this.privacityConditionsService.showTermsAndConditions();
    }

}
