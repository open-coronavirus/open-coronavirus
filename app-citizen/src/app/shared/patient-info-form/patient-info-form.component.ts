import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { PatientWithRelations } from '../sdk';
import moment from 'moment';

@Component({
    selector: 'patient-info-form',
    templateUrl: 'patient-info-form.component.html',
    styleUrls: ['patient-info-form.component.scss']
})
export class PatientInfoFormComponent implements OnInit, OnDestroy, AfterViewInit {

    public patientInfoForm: FormGroup;

    public enabledDateValidation: boolean;

    @Input('edit')
    public edit;

    public get isValid(): boolean {
        if (this.patientInfoForm != null) {
            if (this.patientInfoForm.status != 'INVALID') {
                return true;
            }
        }
        return false;
    }

    @Input('patient')
    public patient: PatientWithRelations = new class implements PatientWithRelations {
        [key: string]: object | any;

        age: number;
        apartment: string;
        documentNumber: string;
        email: string;
        firstName: string;
        lastName: string;
        gender: number;
        healthInsuranceCardNumber: string;
        id: string;
        birthday: string;
        phone: string;
        postalCode: string;
        street: string;
        autoshare: boolean;
    };

    @Output('onChange')
    public onChange: Subject<any> = new Subject();

    get firstName() {
        return this.patientInfoForm.get('firstName');
    }

    get lastName() {
        return this.patientInfoForm.get('lastName');
    }

    get documentNumber() {
        return this.patientInfoForm.get('documentNumber');
    }

    get healthInsuranceCardNumber() {
        return this.patientInfoForm.get('healthInsuranceCardNumber');
    }

    get age() {
        return this.patientInfoForm.get('age');
    }

    get birthday() {
        return this.patientInfoForm.get('birthday');
    }
    get gender() {
        return this.patientInfoForm.get('gender');
    }

    get street() {
        return this.patientInfoForm.get('street');
    }

    get apartment() {
        return this.patientInfoForm.get('apartment');
    }

    get postalCode() {
        return this.patientInfoForm.get('postalCode');
    }

    get email() {
        return this.patientInfoForm.get('email');
    }

    get phone() {
        return this.patientInfoForm.get('phone');
    }

    get autoshare() {
        return this.patientInfoForm.get('autoshare');
    }

    protected subscriptions: Subscription[] = new Array<Subscription>();

    public constructor(
        protected formBuilder: FormBuilder,
        @Inject('settings') public settings) {

    }

    public ngOnInit() {

        this.patientInfoForm = this.formBuilder.group({
            firstName: new FormControl(this.patient.firstName, [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/^.*[AEIOUYaeiouy]+.*$/)]),
            documentNumber: new FormControl(this.patient.documentNumber, [Validators.required]),
            birthday: new FormControl(this.patient.birthday, [Validators.required]),
            street: new FormControl(this.patient.street),
            postalCode: (this.settings.register.moduleHome) ? new FormControl(this.patient.postalCode, [Validators.pattern(/^\s*\d{5}\s*$/), Validators.required]) : new FormControl(this.patient.postalCode, [Validators.pattern(/^\s*\d{5}\s*$/)]),
            phone: (this.settings.register.moduleContact) ? new FormControl(this.patient.phone, [Validators.required, Validators.minLength(9), Validators.pattern(/^\s*[\d\s\(\)\-]+\s*$/)]) : new FormControl(this.patient.phone, [Validators.minLength(9), Validators.pattern(/^\s*[\d\s\(\)\-]+\s*$/)]),
            email: new FormControl(this.patient.email, [
                Validators.pattern(/^\s*[a-zA-Z0-9._-]+@[a-zA-Z0-9\.-]+?\.[a-zA-Z]{2,}\s*$/i)]),
            autoshare: new FormControl(this.patient.autoshare)
        });

        this.subscriptions.push(this.patientInfoForm.get('firstName').valueChanges
            .subscribe((value: string) => {
                this.patient.firstName = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('documentNumber').valueChanges
            .subscribe((value: string) => {
                this.patient.documentNumber = value.trim();
                this.onChange.next(this.patient);
            }));


        this.subscriptions.push(this.patientInfoForm.get('birthday').valueChanges
            .subscribe((value: string) => {
                value = value.trim();
                this.patient.birthday = value;
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('street').valueChanges
            .subscribe((value: string) => {
                this.patient.street = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('postalCode').valueChanges
            .subscribe((value: string) => {
                this.patient.postalCode = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('email').valueChanges
            .subscribe((value: string) => {
                this.patient.email = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('phone').valueChanges
            .subscribe((value: string) => {
                this.patient.phone = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('autoshare').valueChanges
            .subscribe((value: boolean) => {
                this.patient.autoshare = value;
                this.onChange.next(this.patient);
            }));
    }

    public validate() {
        for (var i in this.patientInfoForm.controls) {
            this.patientInfoForm.controls[i].markAsTouched();
        }

        this.enabledDateValidation = true;
    }

    getMaxDate() {
        return moment().subtract(18, 'y').format('YYYY-MM-DD');
    }


    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public ngAfterViewInit() {
        //  todo
    }

    public changeDate(ev) {
        console.log("changeDate: ", ev);
        this.enabledDateValidation = true;
    }


}
