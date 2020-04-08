(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["splash-splash-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/splash/splash.component.html":
/*!************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/splash/splash.component.html ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-content>\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <div class=\"title-splash\" i18n=\"@@introductionHeader\">\n                    Luchemos juntos<br />contra el\n                    <img class=\"coronavirus\" src=\"/assets/images/coronavirus.png\">\n                </div>\n            </ion-col>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n<div class=\"footer-buttons-container\">\n    <div class=\"footer-labels-container\" i18n=\"@@introductionTip\">App de control policial</div>\n    <ion-button color=\"dark\" (click)=\"enter()\" expand=\"block\" i18n=\"@@enter\">ENTRAR</ion-button>\n</div>\n");

/***/ }),

/***/ "./src/app/splash/splash.component.scss":
/*!**********************************************!*\
  !*** ./src/app/splash/splash.component.scss ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".coronavirus {\n  width: 80%;\n}\n\n.title-splash {\n  text-align: center;\n  font-weight: 300;\n  font-size: 30px;\n  padding-top: 100px;\n}\n\n.title-splash img {\n  padding-top: 20px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLXBvbGljZS9zcmMvYXBwL3NwbGFzaC9zcGxhc2guY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL3NwbGFzaC9zcGxhc2guY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxVQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0FDQ0Y7O0FEQ0U7RUFDRSxpQkFBQTtBQ0NKIiwiZmlsZSI6InNyYy9hcHAvc3BsYXNoL3NwbGFzaC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb3JvbmF2aXJ1cyB7XG4gIHdpZHRoOiA4MCU7XG59XG5cbi50aXRsZS1zcGxhc2gge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiAzMDA7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgcGFkZGluZy10b3A6IDEwMHB4O1xuXG4gIGltZyB7XG4gICAgcGFkZGluZy10b3A6IDIwcHg7XG4gIH1cblxufVxuIiwiLmNvcm9uYXZpcnVzIHtcbiAgd2lkdGg6IDgwJTtcbn1cblxuLnRpdGxlLXNwbGFzaCB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbiAgZm9udC1zaXplOiAzMHB4O1xuICBwYWRkaW5nLXRvcDogMTAwcHg7XG59XG4udGl0bGUtc3BsYXNoIGltZyB7XG4gIHBhZGRpbmctdG9wOiAyMHB4O1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/splash/splash.component.ts":
/*!********************************************!*\
  !*** ./src/app/splash/splash.component.ts ***!
  \********************************************/
/*! exports provided: SplashComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SplashComponent", function() { return SplashComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic-native/native-storage/ngx */ "./node_modules/@ionic-native/native-storage/ngx/index.js");
/* harmony import */ var _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/services/patient.service */ "./src/app/shared/services/patient.service.ts");





let SplashComponent = class SplashComponent {
    constructor(router, patientService, nativeStorage) {
        this.router = router;
        this.patientService = patientService;
        this.nativeStorage = nativeStorage;
    }
    ngOnInit() {
        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.router.navigate(['app/home']);
            }
        });
    }
    enter() {
        this.router.navigate(['app/qr-reader']);
    }
};
SplashComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_4__["PatientService"] },
    { type: _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__["NativeStorage"] }
];
SplashComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'splash',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./splash.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/splash/splash.component.html")).default,
        encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./splash.component.scss */ "./src/app/splash/splash.component.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
        _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_4__["PatientService"],
        _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__["NativeStorage"]])
], SplashComponent);



/***/ }),

/***/ "./src/app/splash/splash.module.ts":
/*!*****************************************!*\
  !*** ./src/app/splash/splash.module.ts ***!
  \*****************************************/
/*! exports provided: SplashModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SplashModule", function() { return SplashModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _splash_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./splash.component */ "./src/app/splash/splash.component.ts");







let SplashModule = class SplashModule {
};
SplashModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{ path: '', component: _splash_component__WEBPACK_IMPORTED_MODULE_6__["SplashComponent"] }])
        ],
        declarations: [_splash_component__WEBPACK_IMPORTED_MODULE_6__["SplashComponent"]]
    })
], SplashModule);



/***/ })

}]);
//# sourceMappingURL=splash-splash-module-es2015.js.map