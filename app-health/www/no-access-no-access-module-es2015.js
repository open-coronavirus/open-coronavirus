(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["no-access-no-access-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/no-access/no-access.component.html":
/*!******************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/no-access/no-access.component.html ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\n    <ion-toolbar class=\"header-app\">\n        <ion-title><span class=\"supertitle\">Luchemos juntos contra el</span><br /> CORONAVIRUS</ion-title>\n    </ion-toolbar>\n</ion-header>\n<ion-content class=\"no-access\">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 i18n=\"@@noAccessTitle\">No acceso</h1>\n                <ng-container i18n=\"@@noAccessDescription\">\n                <p>Parece que ya la estás utilizando en otro móvil.</p>\n                <p>Si no es así o quieres cambiar de terminal póngase en contacto con el servicio técnico</p>\n                </ng-container>\n                <ion-button (click)=\"callToTechnicalSupport()\" class=\"light-button\" expand=\"block\"  i18n=\"callTechnicalServiceButtonLabel\"><img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-telefono.svg\">&nbsp;&nbsp;&nbsp;Servicio técnico&nbsp;&nbsp;<strong>999 888 777</strong></ion-button>\n                <ion-button color=\"light\" (click)=\"backToRegisterForm()\" i18n=\"tryAgainButtonLabel\" expand=\"block\">Volver a intentar</ion-button>\n\n                <p style=\"padding-top: 25px;\" i18n=\"noAccessFootNote\">Si no puedes entrar y crees que tienes síntomas del coronavirus contacta con la atención médica por el procedimiento habitual.</p>\n            </ion-col>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n");

/***/ }),

/***/ "./src/app/no-access/no-access.component.scss":
/*!****************************************************!*\
  !*** ./src/app/no-access/no-access.component.scss ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".no-access h1 {\n  color: #c80f2e;\n}\n\n.supertitle {\n  font-size: 14px;\n  font-weight: 300;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLXBvbGljZS9zcmMvYXBwL25vLWFjY2Vzcy9uby1hY2Nlc3MuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL25vLWFjY2Vzcy9uby1hY2Nlc3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRSxjQUFBO0FDQUo7O0FETUE7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7QUNIRiIsImZpbGUiOiJzcmMvYXBwL25vLWFjY2Vzcy9uby1hY2Nlc3MuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubm8tYWNjZXNzIHtcbiAgaDEge1xuICAgIGNvbG9yOiAjYzgwZjJlO1xuICB9XG5cbn1cblxuXG4uc3VwZXJ0aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbn1cbiIsIi5uby1hY2Nlc3MgaDEge1xuICBjb2xvcjogI2M4MGYyZTtcbn1cblxuLnN1cGVydGl0bGUge1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiAzMDA7XG59Il19 */");

/***/ }),

/***/ "./src/app/no-access/no-access.component.ts":
/*!**************************************************!*\
  !*** ./src/app/no-access/no-access.component.ts ***!
  \**************************************************/
/*! exports provided: NoAccessComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoAccessComponent", function() { return NoAccessComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");



let NoAccessComponent = class NoAccessComponent {
    constructor(router) {
        this.router = router;
    }
    callToTechnicalSupport() {
        window.location.href = 'tel:999888777';
    }
    backToRegisterForm() {
        this.router.navigate(['/register']);
    }
};
NoAccessComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
];
NoAccessComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'no-access',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./no-access.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/no-access/no-access.component.html")).default,
        encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./no-access.component.scss */ "./src/app/no-access/no-access.component.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], NoAccessComponent);



/***/ }),

/***/ "./src/app/no-access/no-access.module.ts":
/*!***********************************************!*\
  !*** ./src/app/no-access/no-access.module.ts ***!
  \***********************************************/
/*! exports provided: NoAccessModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoAccessModule", function() { return NoAccessModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _shared_patient_info_form_patient_info_form_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/patient-info-form/patient-info-form.module */ "./src/app/shared/patient-info-form/patient-info-form.module.ts");
/* harmony import */ var _no_access_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./no-access.component */ "./src/app/no-access/no-access.component.ts");








let NoAccessModule = class NoAccessModule {
};
NoAccessModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            _shared_patient_info_form_patient_info_form_module__WEBPACK_IMPORTED_MODULE_6__["PatientInfoFormModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{ path: '', component: _no_access_component__WEBPACK_IMPORTED_MODULE_7__["NoAccessComponent"] }])
        ],
        declarations: [_no_access_component__WEBPACK_IMPORTED_MODULE_7__["NoAccessComponent"]]
    })
], NoAccessModule);



/***/ })

}]);
//# sourceMappingURL=no-access-no-access-module-es2015.js.map