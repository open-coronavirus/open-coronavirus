(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-container-qr-reader-qr-reader-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/qr-reader/qr-reader.component.html":
/*!********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/qr-reader/qr-reader.component.html ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\n    <ion-toolbar class=\"header-app\">\n        <!-- <ion-buttons slot=\"start\">\n            <ion-icon size=\"large\" (click)=\"goBack()\" name=\"chevron-back-outline\"></ion-icon>\n        </ion-buttons> -->\n        <ion-title i18n=\"@@patientInfoTitle\">Escanear</ion-title>\n    </ion-toolbar>\n</ion-header>\n<ion-content>\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <!-- <patient-info-form #patientInfoFormComponent [patient]=\"patientService.patient\"></patient-info-form> -->\n                <ion-button color=\"dark\" (click)=\"scanQR()\" expand=\"block\" i18n=\"@@scanButton\">Escanear</ion-button>\n            </ion-col>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n");

/***/ }),

/***/ "./src/app/app-container/qr-reader/qr-reader.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/app-container/qr-reader/qr-reader.component.scss ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC1jb250YWluZXIvcXItcmVhZGVyL3FyLXJlYWRlci5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/app-container/qr-reader/qr-reader.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/app-container/qr-reader/qr-reader.component.ts ***!
  \****************************************************************/
/*! exports provided: QrReaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QrReaderComponent", function() { return QrReaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/patient.service */ "./src/app/shared/services/patient.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _ionic_native_barcode_scanner_ngx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic-native/barcode-scanner/ngx */ "./node_modules/@ionic-native/barcode-scanner/ngx/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");






let QrReaderComponent = class QrReaderComponent {
    constructor(router, patientService, barcodeScanner, location) {
        this.router = router;
        this.patientService = patientService;
        this.barcodeScanner = barcodeScanner;
        this.location = location;
    }
    scanQR() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data: ', barcodeData);
            if (barcodeData && barcodeData.text) {
                // this.serialNumber = barcodeData.text;
            }
        }).catch(err => {
            console.error('Error scanQR: ', err);
            this.router.navigate(['app/qr-reader-result']);
        });
    }
    goBack() {
        this.location.back();
    }
};
QrReaderComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] },
    { type: _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_2__["PatientService"] },
    { type: _ionic_native_barcode_scanner_ngx__WEBPACK_IMPORTED_MODULE_4__["BarcodeScanner"] },
    { type: _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"] }
];
QrReaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'qr-reader',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./qr-reader.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/qr-reader/qr-reader.component.html")).default,
        encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./qr-reader.component.scss */ "./src/app/app-container/qr-reader/qr-reader.component.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
        _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_2__["PatientService"],
        _ionic_native_barcode_scanner_ngx__WEBPACK_IMPORTED_MODULE_4__["BarcodeScanner"],
        _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]])
], QrReaderComponent);



/***/ }),

/***/ "./src/app/app-container/qr-reader/qr-reader.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/app-container/qr-reader/qr-reader.module.ts ***!
  \*************************************************************/
/*! exports provided: QrReaderModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QrReaderModule", function() { return QrReaderModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _qr_reader_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./qr-reader.component */ "./src/app/app-container/qr-reader/qr-reader.component.ts");
/* harmony import */ var _shared_qr_code_qr_code_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/qr-code/qr-code.module */ "./src/app/shared/qr-code/qr-code.module.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");








let QrReaderModule = class QrReaderModule {
};
QrReaderModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _shared_qr_code_qr_code_module__WEBPACK_IMPORTED_MODULE_6__["QrCodeModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["RouterModule"].forChild([{ path: '', component: _qr_reader_component__WEBPACK_IMPORTED_MODULE_5__["QrReaderComponent"] }])
        ],
        declarations: [_qr_reader_component__WEBPACK_IMPORTED_MODULE_5__["QrReaderComponent"]]
    })
], QrReaderModule);



/***/ })

}]);
//# sourceMappingURL=app-container-qr-reader-qr-reader-module-es2015.js.map