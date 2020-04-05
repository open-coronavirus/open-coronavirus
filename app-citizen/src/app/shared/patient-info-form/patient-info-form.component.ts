import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {Patient, PatientWithRelations} from '../sdk';

@Component({
    selector: 'patient-info-form',
    templateUrl: 'patient-info-form.component.html',
    styleUrls: ['patient-info-form.component.scss']
})
export class PatientInfoFormComponent implements OnInit, OnDestroy, AfterViewInit {

    public patientInfoForm: FormGroup;

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
        gender: number;
        healthInsuranceCardNumber: string;
        id: string;
        lastName: string;
        phone: string;
        postalCode: string;
        street: string;
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

    protected subscriptions: Subscription[] = new Array<Subscription>();

    public constructor(protected formBuilder: FormBuilder) {

    }

    public ngOnInit() {

        this.patientInfoForm = this.formBuilder.group({
            firstName: new FormControl(this.patient.firstName, [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/^.*[AEIOUYaeiouy]+.*$/)]),
            lastName: new FormControl(this.patient.lastName, [,
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/^.*[AEIOUYaeiouy]+.*$/)]),
            documentNumber: new FormControl(this.patient.documentNumber, [Validators.required]),
            healthInsuranceCardNumber: new FormControl(this.patient.healthInsuranceCardNumber, [Validators.required]),
            age: new FormControl(this.patient.age, [Validators.required, Validators.pattern(/^\s*\d+\s*$/ )]),
            gender: new FormControl(this.patient.gender, [Validators.required]),
            street: new FormControl(this.patient.street, [Validators.required]),
            apartment: new FormControl(this.patient.apartment),
            postalCode: new FormControl(this.patient.postalCode, [
                Validators.required,
                Validators.pattern(/^\s*\d{5}\s*$/ )]),
            phone: new FormControl(this.patient.phone, [
                Validators.required,
                Validators.minLength(9),
                Validators.pattern(/^\s*[\d\s\(\)\-]+\s*$/ )]),
            email: new FormControl(this.patient.email, [
                Validators.required,
                Validators.pattern(/^\s*[a-zA-Z0-9._-]+@[a-zA-Z0-9\.-]+?\.[a-zA-Z]{2,}\s*$/i)]),
        });

        this.subscriptions.push(this.patientInfoForm.get('firstName').valueChanges
            .subscribe((value: string) => {
                this.patient.firstName = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('lastName').valueChanges
            .subscribe((value: string) => {
                this.patient.lastName = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('documentNumber').valueChanges
            .subscribe((value: string) => {
                this.patient.documentNumber = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('healthInsuranceCardNumber').valueChanges
            .subscribe((value: string) => {
                this.patient.healthInsuranceCardNumber = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('age').valueChanges
            .subscribe((value: string) => {
                value = value.trim();
                this.patient.age = +value;
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('gender').valueChanges
            .subscribe(value => {
                this.patient.gender = +value;
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('street').valueChanges
            .subscribe((value: string) => {
                this.patient.street = value.trim();
                this.onChange.next(this.patient);
            }));

        this.subscriptions.push(this.patientInfoForm.get('apartment').valueChanges
            .subscribe((value: string) => {
                this.patient.apartment = value.trim();
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

    }

    public validate() {
        for (var i in this.patientInfoForm.controls) {
            this.patientInfoForm.controls[i].markAsTouched();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public ngAfterViewInit() {
        //todo
    }


}
