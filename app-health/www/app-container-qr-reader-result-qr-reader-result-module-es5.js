(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-container-qr-reader-result-qr-reader-result-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/qr-reader-result/qr-reader-result.component.html":
  /*!**********************************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/qr-reader-result/qr-reader-result.component.html ***!
    \**********************************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppAppContainerQrReaderResultQrReaderResultComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\n    <ion-toolbar class=\"header-app\">\n        <!-- <ion-buttons slot=\"start\">\n            <ion-icon size=\"large\" (click)=\"goBack()\" name=\"chevron-back-outline\"></ion-icon>\n        </ion-buttons> -->\n        <ion-title i18n=\"@@patientInfoTitle\">Resultado</ion-title>\n    </ion-toolbar>\n</ion-header>\n<ion-content>\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n               <img [src]=\"'qr.png'\">\n            </ion-col>\n            <ion-col>\n                <p>ciudadano</p>\n                <p>Marsisa García Pérez</p>\n                <h3>INFECTADO</h3>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n          <ion-col>\n            <p>DNI</p>\n          </ion-col>\n          <ion-col>\n            <p>734567849-F</p>\n          </ion-col>\n        </ion-row>\n        <ion-row>\n          <ion-col>\n            <p>Edad</p>\n          </ion-col>\n          <ion-col>\n            <p>38 años</p>\n          </ion-col>\n        </ion-row>\n        <ion-row>\n          <ion-col>\n            <p>Dirección</p>\n          </ion-col>\n          <ion-col>\n            <p>C/ Bailén 12 4A Alicante (04003)</p>\n          </ion-col>\n        </ion-row>\n\n\n        <ion-row>\n            <ion-col>\n                Ver mapa movilidad\n            </ion-col>\n        </ion-row>\n\n\n        <ion-row>\n            <ion-col>\n               <div>\n                   <p>Se ha saltado la cuarentena y está fuera de casa <strong>durante 2h</strong></p>\n                   <span>15/02/2020 20.30h</span>\n               </div>\n               <div>\n                    <p>Se encuentra en casa</p>\n                    <span>15/02/2020 12.30h</span>\n                </div>\n                <div>\n                    <p>Solicitud salir a comprar alimentos</p>\n                    <span>15/02/2020 9.10h</span>\n                </div>\n            </ion-col>\n        </ion-row>\n\n    </ion-grid>\n\n    <ion-button color=\"dark\" (click)=\"goBack()\" expand=\"block\" i18n=\"@@okButton\">OK</ion-button>\n</ion-content>\n";
    /***/
  },

  /***/
  "./src/app/app-container/qr-reader-result/qr-reader-result.component.scss":
  /*!********************************************************************************!*\
    !*** ./src/app/app-container/qr-reader-result/qr-reader-result.component.scss ***!
    \********************************************************************************/

  /*! exports provided: default */

  /***/
  function srcAppAppContainerQrReaderResultQrReaderResultComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC1jb250YWluZXIvcXItcmVhZGVyLXJlc3VsdC9xci1yZWFkZXItcmVzdWx0LmNvbXBvbmVudC5zY3NzIn0= */";
    /***/
  },

  /***/
  "./src/app/app-container/qr-reader-result/qr-reader-result.component.ts":
  /*!******************************************************************************!*\
    !*** ./src/app/app-container/qr-reader-result/qr-reader-result.component.ts ***!
    \******************************************************************************/

  /*! exports provided: QrReaderResultComponent */

  /***/
  function srcAppAppContainerQrReaderResultQrReaderResultComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "QrReaderResultComponent", function () {
      return QrReaderResultComponent;
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


    var _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../../shared/services/patient.service */
    "./src/app/shared/services/patient.service.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/fesm2015/common.js");

    let QrReaderResultComponent = class QrReaderResultComponent {
      constructor(patientService, location) {
        this.patientService = patientService;
        this.location = location;
      }

      goBack() {
        this.location.back();
      }

    };

    QrReaderResultComponent.ctorParameters = () => [{
      type: _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_2__["PatientService"]
    }, {
      type: _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]
    }];

    QrReaderResultComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'qr-reader-result',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./qr-reader-result.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/qr-reader-result/qr-reader-result.component.html")).default,
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./qr-reader-result.component.scss */
      "./src/app/app-container/qr-reader-result/qr-reader-result.component.scss")).default]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_shared_services_patient_service__WEBPACK_IMPORTED_MODULE_2__["PatientService"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]])], QrReaderResultComponent);
    /***/
  },

  /***/
  "./src/app/app-container/qr-reader-result/qr-reader-result.module.ts":
  /*!***************************************************************************!*\
    !*** ./src/app/app-container/qr-reader-result/qr-reader-result.module.ts ***!
    \***************************************************************************/

  /*! exports provided: QrReaderResultModule */

  /***/
  function srcAppAppContainerQrReaderResultQrReaderResultModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "QrReaderResultModule", function () {
      return QrReaderResultModule;
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


    var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/fesm2015/common.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");
    /* harmony import */


    var _qr_reader_result_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./qr-reader-result.component */
    "./src/app/app-container/qr-reader-result/qr-reader-result.component.ts");
    /* harmony import */


    var _shared_qr_code_qr_code_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../shared/qr-code/qr-code.module */
    "./src/app/shared/qr-code/qr-code.module.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");

    let QrReaderResultModule = class QrReaderResultModule {};
    QrReaderResultModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
      imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _shared_qr_code_qr_code_module__WEBPACK_IMPORTED_MODULE_6__["QrCodeModule"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["RouterModule"].forChild([{
        path: '',
        component: _qr_reader_result_component__WEBPACK_IMPORTED_MODULE_5__["QrReaderResultComponent"]
      }])],
      declarations: [_qr_reader_result_component__WEBPACK_IMPORTED_MODULE_5__["QrReaderResultComponent"]]
    })], QrReaderResultModule);
    /***/
  }
}]);
//# sourceMappingURL=app-container-qr-reader-result-qr-reader-result-module-es5.js.map