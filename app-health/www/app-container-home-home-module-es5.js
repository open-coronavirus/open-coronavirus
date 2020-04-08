(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-container-home-home-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/home/home.component.html":
  /*!**********************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/home/home.component.html ***!
    \**********************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppAppContainerHomeHomeComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\n    <ion-toolbar class=\"header-app\">\n        <ion-buttons slot=\"start\">\n            <ion-menu-button class=\"menu\" (click)=\"openMenu()\" autoHide=\"false\"></ion-menu-button>\n        </ion-buttons>\n        <ion-title i18n=\"@@headerTitle\"><span class=\"supertitle\">Luchemos juntos contra el</span><br /> CORONAVIRUS</ion-title>\n    </ion-toolbar>\n</ion-header>\n<ion-content>\n    <ion-grid>\n        <ion-row>\n            <ion-col></ion-col>\n            <ion-col size=\"8\">\n                <div class=\"auth-code-label\" i18n=\"@@authorizationCodeLabel\">Código de autorización</div>\n                <div class=\"patient-name\">{{patientName}}</div>\n                <qr-code></qr-code>\n                <div *ngIf=\"leaveStatus == 2\" class=\"leave-status\">Motivo: <span class=\"leave-reason\">{{leaveReason}}</span></div>\n                <ion-button *ngIf=\"leaveStatus == null || leaveStatus == 1\" (click)=\"goToRequestLeaveHome()\" class=\"light-button\" expand=\"block\">\n                    <div slot=\"start\"><img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-salir-casa.svg\">&nbsp;&nbsp;&nbsp;</div>\n                    <ng-container i18n=\"@@ImGoingLeaveHomeButton\">Voy a salir de casa</ng-container></ion-button>\n                <ion-button *ngIf=\"leaveStatus == 2\" (click)=\"setAtHome()\" class=\"light-button\" expand=\"block\">\n                    <div slot=\"start\"><img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-volver-casa.svg\">&nbsp;&nbsp;&nbsp;</div>\n                    <ng-container i18n=\"@@ImGoingLeaveHomeButton\">He vuelto a casa</ng-container>\n                </ion-button>\n            </ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n<ion-toolbar class=\"home-footer-toolbar\">\n    <ion-button (click)=\"goToAutotest()\" color=\"dark\" expand=\"block\"><div slot=\"start\"><img class=\"button-icon filter-white\" src=\"/assets/icons/svg/icon-test.svg\">&nbsp;&nbsp;&nbsp;</div>\n        <ng-container i18n=\"@@autotestButton\">¿Tengo el coronavirus?</ng-container></ion-button>\n    <ion-button (click)=\"goToCoronavirusInfo()\" class=\"light-button\" expand=\"block\"><div slot=\"start\"><img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-info.svg\">&nbsp;&nbsp;&nbsp;</div>\n        <ng-container i18n=\"@@coronavirusInfoButton\">Información sobre el coronavirus</ng-container></ion-button>\n    <div class=\"share-link\"><a href=\"javascrip:void(null);\" (click)=\"share()\"><img class=\"button-icon filter-green\" src=\"/assets/icons/svg/whatsapp.svg\">&nbsp;&nbsp;&nbsp;<ng-container i18n=\"@@shareButton\">Compartir App para luchar juntos</ng-container></a></div>\n</ion-toolbar>\n";
    /***/
  },

  /***/
  "./src/app/app-container/home/home.component.scss":
  /*!********************************************************!*\
    !*** ./src/app/app-container/home/home.component.scss ***!
    \********************************************************/

  /*! exports provided: default */

  /***/
  function srcAppAppContainerHomeHomeComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".qrcode img {\n  width: 100% !important;\n}\n\n.supertitle {\n  font-size: 14px;\n  font-weight: 300;\n}\n\n.menu {\n  --color: white;\n}\n\n.home-footer-toolbar {\n  box-shadow: 0px -11px 5px -11px rgba(0, 0, 0, 0.34);\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n\n.auth-code-label {\n  text-align: center;\n  color: #848484;\n}\n\n.leave-status {\n  padding-bottom: 10px;\n  text-align: center;\n  color: #848484;\n}\n\n.leave-reason {\n  color: black;\n}\n\n.patient-name {\n  text-align: center;\n  color: black;\n}\n\n.share-link {\n  text-align: center;\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n\n.share-link img {\n  vertical-align: middle;\n}\n\n.share-link a, .share-link a:hover {\n  color: black;\n  text-decoration: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLXBvbGljZS9zcmMvYXBwL2FwcC1jb250YWluZXIvaG9tZS9ob21lLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9hcHAtY29udGFpbmVyL2hvbWUvaG9tZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFRTtFQUNFLHNCQUFBO0FDREo7O0FETUE7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7QUNIRjs7QURNQTtFQUNFLGNBQUE7QUNIRjs7QURNQTtFQUdFLG1EQUFBO0VBQ0EsaUJBQUE7RUFDQSxvQkFBQTtBQ0hGOztBRE1BO0VBQ0Usa0JBQUE7RUFDQSxjQUFBO0FDSEY7O0FETUE7RUFDRSxvQkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQ0hGOztBRE1BO0VBQ0UsWUFBQTtBQ0hGOztBRE1BO0VBQ0Usa0JBQUE7RUFDQSxZQUFBO0FDSEY7O0FETUE7RUFDRSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0Esb0JBQUE7QUNIRjs7QURLRTtFQUNFLHNCQUFBO0FDSEo7O0FETUU7RUFDRSxZQUFBO0VBQ0EscUJBQUE7QUNKSiIsImZpbGUiOiJzcmMvYXBwL2FwcC1jb250YWluZXIvaG9tZS9ob21lLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnFyY29kZSB7XG5cbiAgaW1nIHtcbiAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xuICB9XG5cbn1cblxuLnN1cGVydGl0bGUge1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiAzMDA7XG59XG5cbi5tZW51IHtcbiAgLS1jb2xvcjogd2hpdGU7XG59XG5cbi5ob21lLWZvb3Rlci10b29sYmFyIHtcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiAwcHggLTExcHggNXB4IC0xMXB4IHJnYmEoMCwwLDAsMC4zNCk7XG4gIC1tb3otYm94LXNoYWRvdzogMHB4IC0xMXB4IDVweCAtMTFweCByZ2JhKDAsMCwwLDAuMzQpO1xuICBib3gtc2hhZG93OiAwcHggLTExcHggNXB4IC0xMXB4IHJnYmEoMCwwLDAsMC4zNCk7XG4gIHBhZGRpbmctdG9wOiAxMHB4O1xuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcbn1cblxuLmF1dGgtY29kZS1sYWJlbCB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM4NDg0ODQ7XG59XG5cbi5sZWF2ZS1zdGF0dXMge1xuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzg0ODQ4NDtcbn1cblxuLmxlYXZlLXJlYXNvbiB7XG4gIGNvbG9yOiBibGFjaztcbn1cblxuLnBhdGllbnQtbmFtZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6IGJsYWNrO1xufVxuXG4uc2hhcmUtbGluayB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZy10b3A6IDIwcHg7XG4gIHBhZGRpbmctYm90dG9tOiAyMHB4O1xuXG4gIGltZyB7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgfVxuXG4gIGEsIGE6aG92ZXIge1xuICAgIGNvbG9yOiBibGFjaztcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIH1cblxufVxuXG4iLCIucXJjb2RlIGltZyB7XG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG59XG5cbi5zdXBlcnRpdGxlIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogMzAwO1xufVxuXG4ubWVudSB7XG4gIC0tY29sb3I6IHdoaXRlO1xufVxuXG4uaG9tZS1mb290ZXItdG9vbGJhciB7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IC0xMXB4IDVweCAtMTFweCByZ2JhKDAsIDAsIDAsIDAuMzQpO1xuICAtbW96LWJveC1zaGFkb3c6IDBweCAtMTFweCA1cHggLTExcHggcmdiYSgwLCAwLCAwLCAwLjM0KTtcbiAgYm94LXNoYWRvdzogMHB4IC0xMXB4IDVweCAtMTFweCByZ2JhKDAsIDAsIDAsIDAuMzQpO1xuICBwYWRkaW5nLXRvcDogMTBweDtcbiAgcGFkZGluZy1ib3R0b206IDEwcHg7XG59XG5cbi5hdXRoLWNvZGUtbGFiZWwge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjODQ4NDg0O1xufVxuXG4ubGVhdmUtc3RhdHVzIHtcbiAgcGFkZGluZy1ib3R0b206IDEwcHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM4NDg0ODQ7XG59XG5cbi5sZWF2ZS1yZWFzb24ge1xuICBjb2xvcjogYmxhY2s7XG59XG5cbi5wYXRpZW50LW5hbWUge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiBibGFjaztcbn1cblxuLnNoYXJlLWxpbmsge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBhZGRpbmctdG9wOiAyMHB4O1xuICBwYWRkaW5nLWJvdHRvbTogMjBweDtcbn1cbi5zaGFyZS1saW5rIGltZyB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG4uc2hhcmUtbGluayBhLCAuc2hhcmUtbGluayBhOmhvdmVyIHtcbiAgY29sb3I6IGJsYWNrO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59Il19 */";
    /***/
  },

  /***/
  "./src/app/app-container/home/home.component.ts":
  /*!******************************************************!*\
    !*** ./src/app/app-container/home/home.component.ts ***!
    \******************************************************/

  /*! exports provided: HomeComponent */

  /***/
  function srcAppAppContainerHomeHomeComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HomeComponent", function () {
      return HomeComponent;
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


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../../shared/services/patient.service */
    "./src/app/shared/services/patient.service.ts");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
    /* harmony import */


    var _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @ionic-native/in-app-browser/ngx */
    "./node_modules/@ionic-native/in-app-browser/ngx/index.js");

    let HomeComponent = class HomeComponent {
      constructor(router, patientService, menu, inAppBrowser) {
        this.router = router;
        this.patientService = patientService;
        this.menu = menu;
        this.inAppBrowser = inAppBrowser;
      }

      openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
      }

      goToRequestLeaveHome() {
        this.router.navigate(['/app/request-leave-home']);
      }

      goToAutotest() {
        this.router.navigate(['/app/autotest']);
      }

      goToCoronavirusInfo() {
        window.open("https://coronavirus.epidemixs.org/#/opening", '_system');
      }

    };

    HomeComponent.ctorParameters = () => [{
      type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
    }, {
      type: _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_3__["PatientService"]
    }, {
      type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["MenuController"]
    }, {
      type: _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_5__["InAppBrowser"]
    }];

    HomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'home',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./home.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/home/home.component.html")).default,
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./home.component.scss */
      "./src/app/app-container/home/home.component.scss")).default]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _shared_services_patient_service__WEBPACK_IMPORTED_MODULE_3__["PatientService"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["MenuController"], _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_5__["InAppBrowser"]])], HomeComponent);
    /***/
  },

  /***/
  "./src/app/app-container/home/home.module.ts":
  /*!***************************************************!*\
    !*** ./src/app/app-container/home/home.module.ts ***!
    \***************************************************/

  /*! exports provided: HomeModule */

  /***/
  function srcAppAppContainerHomeHomeModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HomeModule", function () {
      return HomeModule;
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


    var _home_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./home.component */
    "./src/app/app-container/home/home.component.ts");
    /* harmony import */


    var _shared_qr_code_qr_code_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../shared/qr-code/qr-code.module */
    "./src/app/shared/qr-code/qr-code.module.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");

    let HomeModule = class HomeModule {};
    HomeModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
      imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _shared_qr_code_qr_code_module__WEBPACK_IMPORTED_MODULE_6__["QrCodeModule"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["RouterModule"].forChild([{
        path: '',
        component: _home_component__WEBPACK_IMPORTED_MODULE_5__["HomeComponent"]
      }])],
      declarations: [_home_component__WEBPACK_IMPORTED_MODULE_5__["HomeComponent"]]
    })], HomeModule);
    /***/
  }
}]);
//# sourceMappingURL=app-container-home-home-module-es5.js.map