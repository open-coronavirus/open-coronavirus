(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["register-register-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/register/register.component.html":
  /*!****************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/register/register.component.html ***!
    \****************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppRegisterRegisterComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\n    <ion-toolbar class=\"header-app\">\n        <ion-title i18n=\"@@headerTitle\"><span class=\"supertitle\">Luchemos juntos contra el</span><br /> CORONAVIRUS</ion-title>\n    </ion-toolbar>\n</ion-header>\n<ion-content>\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <div class=\"form-row\">\n                    <h1 i18n=\"@@registerTitle\">Registro</h1>\n                </div>\n                <form [formGroup]=\"registerPatientForm\" (ngSubmit)=\"onSubmit()\">\n                    <patient-info-form #patientInfoFormComponent></patient-info-form>\n                    <div class=\"form-row\">\n                        <div class=\"form-group form-check\">\n                            <input formControlName=\"acceptterms\" name=\"acceptterms\" class=\"form-check-input\" id=\"acceptterms\" type=\"checkbox\">\n                            <label for=\"acceptterms\" i18n=\"@@accepttermsLabel\">Acepto las condiciones de uso y políticas de privacidad</label>\n                            <small class=\"error\" *ngIf=\"acceptterms.invalid && formTriedToSubmit\" i18n=\"@@accepttermsError\">Por favor, debes aceptar las condiciones de uso y la política de privacidad.</small>\n                        </div>\n                    </div>\n                    <ion-button type=\"submit\" color=\"dark\" expand=\"block\" i18n=\"@@registerSubmitButton\">REGISTRARSE</ion-button>\n                    <div class=\"d-none d-lg-block d-lg-flex justify-content-end\">\n                        <div>\n                            <small class=\"error\" *ngIf=\"(!patientInfoFormComponent.isValid || acceptterms.invalid) && formTriedToSubmit\" i18n=\"@@registerFormError\">\n                                Ups! Te faltan campos por rellenar <span class=\"emoji-thinking-face\"></span>\n                            </small>\n                        </div>\n                    </div>\n                </form>\n            </ion-col>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n";
    /***/
  },

  /***/
  "./src/app/register/register.component.scss":
  /*!**************************************************!*\
    !*** ./src/app/register/register.component.scss ***!
    \**************************************************/

  /*! exports provided: default */

  /***/
  function srcAppRegisterRegisterComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".supertitle {\n  font-size: 14px;\n  font-weight: 300;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLXBvbGljZS9zcmMvYXBwL3JlZ2lzdGVyL3JlZ2lzdGVyLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9yZWdpc3Rlci9yZWdpc3Rlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvcmVnaXN0ZXIvcmVnaXN0ZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3VwZXJ0aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbn1cbiIsIi5zdXBlcnRpdGxlIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogMzAwO1xufSJdfQ== */";
    /***/
  },

  /***/
  "./src/app/register/register.component.ts":
  /*!************************************************!*\
    !*** ./src/app/register/register.component.ts ***!
    \************************************************/

  /*! exports provided: RegisterComponent */

  /***/
  function srcAppRegisterRegisterComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "RegisterComponent", function () {
      return RegisterComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _shared_patient_info_form_patient_info_form_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../shared/patient-info-form/patient-info-form.component */
    "./src/app/shared/patient-info-form/patient-info-form.component.ts");
    /* harmony import */


    var _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../shared/services/patient.service */
    "./src/app/shared/services/patient.service.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");

    let RegisterComponent = class RegisterComponent {
      constructor(formBuilder, patientService, loadingController, router) {
        this.formBuilder = formBuilder;
        this.patientService = patientService;
        this.loadingController = loadingController;
        this.router = router;
        this.formTriedToSubmit = false;
        this.registerPatientForm = this.formBuilder.group({
          acceptterms: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.accepttermsValuer, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].requiredTrue])
        });
      }

      get acceptterms() {
        return this.registerPatientForm.get('acceptterms');
      }

      onSubmit() {
        this.formTriedToSubmit = true;
        this.patientInfoFormComponent.validate();

        if (this.registerPatientForm.valid && this.patientInfoFormComponent.isValid) {
          this.register();
        }
      }

      register() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
          if (this.patientInfoFormComponent.isValid) {
            const loading = yield this.loadingController.create({
              message: 'Por favor, espere...'
            });
            yield loading.present();
            this.patient = this.patientInfoFormComponent.patient;
            this.patientService.register(this.patient).subscribe(newPatient => {
              loading.dismiss();

              if (newPatient != null && newPatient != false) {
                this.router.navigate(['/app/home']);
              } else {
                //go to error page
                this.router.navigate(['/no-access']);
              }
            });
          }
        });
      }

      presentLoading() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
          const loading = yield this.loadingController.create({
            message: 'Por favor, espere...',
            duration: 2000
          });
          yield loading.present();
          const {
            role,
            data
          } = yield loading.onDidDismiss();
          console.log('Loading dismissed!');
        });
      }

    };

    RegisterComponent.ctorParameters = () => [{
      type: _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"]
    }, {
      type: _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_3__["PatientService"]
    }, {
      type: _ionic_angular__WEBPACK_IMPORTED_MODULE_6__["LoadingController"]
    }, {
      type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]
    }];

    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('patientInfoFormComponent', {
      static: true
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_patient_info_form_patient_info_form_component__WEBPACK_IMPORTED_MODULE_2__["PatientInfoFormComponent"])], RegisterComponent.prototype, "patientInfoFormComponent", void 0);
    RegisterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'register',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./register.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/register/register.component.html")).default,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./register.component.scss */
      "./src/app/register/register.component.scss")).default]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"], _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_3__["PatientService"], _ionic_angular__WEBPACK_IMPORTED_MODULE_6__["LoadingController"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]])], RegisterComponent);
    /***/
  },

  /***/
  "./src/app/register/register.module.ts":
  /*!*********************************************!*\
    !*** ./src/app/register/register.module.ts ***!
    \*********************************************/

  /*! exports provided: RegisterModule */

  /***/
  function srcAppRegisterRegisterModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "RegisterModule", function () {
      return RegisterModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/fesm2015/common.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");
    /* harmony import */


    var _register_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./register.component */
    "./src/app/register/register.component.ts");
    /* harmony import */


    var _shared_patient_info_form_patient_info_form_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../shared/patient-info-form/patient-info-form.module */
    "./src/app/shared/patient-info-form/patient-info-form.module.ts");

    let RegisterModule = class RegisterModule {};
    RegisterModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
      imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"], _shared_patient_info_form_patient_info_form_module__WEBPACK_IMPORTED_MODULE_7__["PatientInfoFormModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{
        path: '',
        component: _register_component__WEBPACK_IMPORTED_MODULE_6__["RegisterComponent"]
      }])],
      declarations: [_register_component__WEBPACK_IMPORTED_MODULE_6__["RegisterComponent"]]
    })], RegisterModule);
    /***/
  }
}]);
//# sourceMappingURL=register-register-module-es5.js.map