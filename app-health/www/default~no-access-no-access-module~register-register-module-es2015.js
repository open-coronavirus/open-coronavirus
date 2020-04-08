(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~no-access-no-access-module~register-register-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/shared/patient-info-form/patient-info-form.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/shared/patient-info-form/patient-info-form.component.html ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<form [formGroup]=\"patientInfoForm\">\n    <div class=\"form-row\">\n        <h5 i18n=\"@@personalInfoSectionTitle\">Tus datos</h5>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" id=\"firstName\" name=\"firstName\" formControlName=\"firstName\" i18n-placeholder placeholder=\"Nombre\">\n            <label for=\"firstName\" i18n=\"@@firstNameLabel\">Nombre</label>\n            <small class=\"error\" *ngIf=\"firstName.invalid && firstName.touched\" i18n=\"@@firstNameError\">Por favor, introduce tu nombre</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\"  id=\"lastName\" name=\"lastName\" formControlName=\"lastName\" i18n-placeholder placeholder=\"Apellidos\">\n            <label for=\"lastName\" i18n=\"@@lastNameLabel\">Apellidos</label>\n            <small class=\"error\" *ngIf=\"lastName.invalid && lastName.touched\" i18n=\"@@lastNameError\">Por favor, introduce tus apellidos</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" name=\"documentNumber\" id=\"documentNumber\" formControlName=\"documentNumber\" i18n-placeholder placeholder=\"DNI/NIF/Tarjeta residencia\">\n            <label for=\"documentNumber\" i18n=\"@@documentNumberLabel\">DNI/NIF/Tarjeta residencia</label>\n            <small class=\"error\" *ngIf=\"documentNumber.invalid && documentNumber.touched\" i18n=\"@@documentNumberForm\">Por favor, introduce tu número de documento</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" name=\"healthInsuranceCardNumber\" id=\"healthInsuranceCardNumber\" formControlName=\"healthInsuranceCardNumber\" i18n-placeholder placeholder=\"Número de tarjeta sanitaria\">\n            <label for=\"healthInsuranceCardNumber\" i18n=\"@@healthInsuranceCardNumberLabel\">Número de tarjeta sanitaria</label>\n            <small class=\"error\" *ngIf=\"healthInsuranceCardNumber.invalid && healthInsuranceCardNumber.touched\" i18n=\"@@healthInsuranceCardNumberError\">Por favor, introduce tu número de tarjeta sanitaria</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\"  style=\"width: 50%;\">\n            <input type=\"text\" class=\"form-control\" name=\"age\" id=\"age\" formControlName=\"age\" i18n-placeholder placeholder=\"Edad\">\n            <label for=\"age\" i18n=\"@@ageLabel\">Edad</label>\n            <small class=\"error\" *ngIf=\"age.invalid && age.touched\" i18n=\"@@ageError\">Por favor, introduce tu edad (por ejemplo 25)</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-check option-group\">\n            <input class=\"form-check-input\" formControlName=\"gender\" name=\"gender\" id=\"female\" [value]=\"2\" type=\"radio\">\n            <label for=\"female\" i18n=\"@@genderFemaleLabel\">Mujer</label>\n        </div>\n        <div class=\"form-group form-check option-group\">\n            <input class=\"form-check-input\" formControlName=\"gender\" name=\"gender\" id=\"male\" [value]=\"1\" type=\"radio\">\n            <label for=\"male\" i18n=\"@@genderMaleLabel\">Hombre</label>\n        </div>\n        <div *ngIf=\"gender.invalid && gender.touched\" class=\"option-error\">\n            <small class=\"error\" *ngIf=\"gender.invalid && gender.touched\"  i18n=\"@@genderError\">Por favor, indica tu género</small>\n        </div>\n    </div>\n    <div class=\"form-row section-title\">\n        <h5 i18n=\"@@addressSectionTitle\">Dirección donde vives</h5>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" id=\"street\" name=\"street\" formControlName=\"street\" i18n-placeholder placeholder=\"Calle\">\n            <label for=\"street\" i18n=\"@@streetLabel\">Calle</label>\n            <small class=\"error\" *ngIf=\"street.invalid && street.touched\" i18n=\"@@streetError\">Por favor, introduce tu dirección</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" id=\"apartment\" name=\"apartment\" formControlName=\"apartment\" i18n-placeholder placeholder=\"Número\">\n            <label for=\"apartment\" i18n=\"@@apartmentLabel\">Número</label>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" id=\"postalCode\" name=\"postalCode\" formControlName=\"postalCode\" i18n-placeholder placeholder=\"Código postal\">\n            <label for=\"postalCode\" i18n=\"@@postalCodeLabel\">Código postal</label>\n            <small class=\"error\" *ngIf=\"postalCode.invalid && postalCode.touched\" i18n=\"@@postalCodeError\">Por favor, introduce un código postal válido</small>\n        </div>\n    </div>\n\n    <div class=\"form-row section-title\">\n        <h5 i18n=\"@@contactInfoSectionTitle\">Información de contacto</h5>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" id=\"email\" name=\"email\" formControlName=\"email\" i18n-placeholder placeholder=\"Email\">\n            <label for=\"email\" i18n=\"@@emailLabel\">Email</label>\n            <small class=\"error\" *ngIf=\"email.invalid && email.touched\" i18n=\"@@emailError\">Por favor, introduce un email válido</small>\n        </div>\n    </div>\n    <div class=\"form-row\">\n        <div class=\"form-group form-label-group\">\n            <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\" formControlName=\"phone\" i18n-placeholder placeholder=\"Phone\">\n            <label for=\"phone\" i18n=\"@@phoneLabel\">Phone</label>\n            <small class=\"error\" *ngIf=\"phone.invalid && phone.touched\" i18n=\"@@phoneError\">Por favor, introduce un número de teléfono válido</small>\n        </div>\n    </div>\n</form>\n");

/***/ }),

/***/ "./src/app/shared/patient-info-form/patient-info-form.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/shared/patient-info-form/patient-info-form.component.scss ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3NoYXJlZC9wYXRpZW50LWluZm8tZm9ybS9wYXRpZW50LWluZm8tZm9ybS5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/shared/patient-info-form/patient-info-form.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/shared/patient-info-form/patient-info-form.component.ts ***!
  \*************************************************************************/
/*! exports provided: PatientInfoFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientInfoFormComponent", function() { return PatientInfoFormComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");




let PatientInfoFormComponent = class PatientInfoFormComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.patient = new class {
        };
        this.onChange = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.subscriptions = new Array();
    }
    get isValid() {
        if (this.patientInfoForm != null) {
            if (this.patientInfoForm.status != 'INVALID') {
                return true;
            }
        }
        return false;
    }
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
    ngOnInit() {
        this.patientInfoForm = this.formBuilder.group({
            firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.firstName, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(2),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^.*[AEIOUYaeiouy]+.*$')
            ]),
            lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.lastName, [,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(2),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^.*[AEIOUYaeiouy]+.*$')]),
            documentNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.documentNumber, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]),
            healthInsuranceCardNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.healthInsuranceCardNumber, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]),
            age: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.age, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern("\\d+")]),
            gender: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.gender, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]),
            street: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.street, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]),
            apartment: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.apartment),
            postalCode: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.postalCode, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(5),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(5),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern("\\d+")
            ]),
            phone: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.phone, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(9),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern("[\\d\\s\\(\\)\\-]+")
            ]),
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.patient.email, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i)
            ]),
        });
        this.subscriptions.push(this.patientInfoForm.get('firstName').valueChanges
            .subscribe(value => {
            this.patient.firstName = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('lastName').valueChanges
            .subscribe(value => {
            this.patient.lastName = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('documentNumber').valueChanges
            .subscribe(value => {
            this.patient.documentNumber = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('healthInsuranceCardNumber').valueChanges
            .subscribe(value => {
            this.patient.healthInsuranceCardNumber = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('age').valueChanges
            .subscribe(value => {
            this.patient.age = +value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('gender').valueChanges
            .subscribe(value => {
            this.patient.gender = +value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('street').valueChanges
            .subscribe(value => {
            this.patient.street = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('apartment').valueChanges
            .subscribe(value => {
            this.patient.apartment = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('postalCode').valueChanges
            .subscribe(value => {
            this.patient.postalCode = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('firstName').valueChanges
            .subscribe(value => {
            this.patient.firstName = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('email').valueChanges
            .subscribe(value => {
            this.patient.email = value;
            this.onChange.next(this.patient);
        }));
        this.subscriptions.push(this.patientInfoForm.get('phone').valueChanges
            .subscribe(value => {
            this.patient.phone = value;
            this.onChange.next(this.patient);
        }));
    }
    validate() {
        for (var i in this.patientInfoForm.controls) {
            this.patientInfoForm.controls[i].markAsTouched();
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    ngAfterViewInit() {
        //todo
    }
};
PatientInfoFormComponent.ctorParameters = () => [
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])('patient'),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
], PatientInfoFormComponent.prototype, "patient", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])('onChange'),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"])
], PatientInfoFormComponent.prototype, "onChange", void 0);
PatientInfoFormComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'patient-info-form',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./patient-info-form.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/shared/patient-info-form/patient-info-form.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./patient-info-form.component.scss */ "./src/app/shared/patient-info-form/patient-info-form.component.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
], PatientInfoFormComponent);



/***/ }),

/***/ "./src/app/shared/patient-info-form/patient-info-form.module.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/patient-info-form/patient-info-form.module.ts ***!
  \**********************************************************************/
/*! exports provided: PatientInfoFormModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientInfoFormModule", function() { return PatientInfoFormModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _patient_info_form_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./patient-info-form.component */ "./src/app/shared/patient-info-form/patient-info-form.component.ts");






let PatientInfoFormModule = class PatientInfoFormModule {
};
PatientInfoFormModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]
        ],
        declarations: [_patient_info_form_component__WEBPACK_IMPORTED_MODULE_5__["PatientInfoFormComponent"]],
        exports: [_patient_info_form_component__WEBPACK_IMPORTED_MODULE_5__["PatientInfoFormComponent"]]
    })
], PatientInfoFormModule);



/***/ })

}]);
//# sourceMappingURL=default~no-access-no-access-module~register-register-module-es2015.js.map