function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["splash-splash-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/splash/splash.component.html":
  /*!************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/splash/splash.component.html ***!
    \************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppSplashSplashComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-content>\n    <div class=\"title-splash\">\n      <img class=\"coronavirus\" src=\"/assets/icons/svg/texto-icono.svg\">\n    </div>\n  </ion-content>\n  <ion-footer class=\"ion-no-border\">\n    <ion-toolbar class=\"footer-app\" >\n        <button class=\"btn\" (click)=\"enter()\" i18n=\"@@enter\">ENTRAR</button>\n    </ion-toolbar>\n  </ion-footer>";
    /***/
  },

  /***/
  "./src/app/splash/splash.component.scss":
  /*!**********************************************!*\
    !*** ./src/app/splash/splash.component.scss ***!
    \**********************************************/

  /*! exports provided: default */

  /***/
  function srcAppSplashSplashComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".title-splash {\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.title-splash img {\n  width: 80%;\n  max-width: 400px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLWhlYWx0aC9zcmMvYXBwL3NwbGFzaC9zcGxhc2guY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL3NwbGFzaC9zcGxhc2guY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUNDRjtBRENFO0VBQ0UsVUFBQTtFQUNBLGdCQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9zcGxhc2gvc3BsYXNoLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRpdGxlLXNwbGFzaCB7XG4gIHdpZHRoOiAxMDAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgaW1ne1xuICAgIHdpZHRoOiA4MCU7XG4gICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgfVxufVxuIiwiLnRpdGxlLXNwbGFzaCB7XG4gIHdpZHRoOiAxMDAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG4udGl0bGUtc3BsYXNoIGltZyB7XG4gIHdpZHRoOiA4MCU7XG4gIG1heC13aWR0aDogNDAwcHg7XG59Il19 */";
    /***/
  },

  /***/
  "./src/app/splash/splash.component.ts":
  /*!********************************************!*\
    !*** ./src/app/splash/splash.component.ts ***!
    \********************************************/

  /*! exports provided: SplashComponent */

  /***/
  function srcAppSplashSplashComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SplashComponent", function () {
      return SplashComponent;
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


    var _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @ionic-native/native-storage/ngx */
    "./node_modules/@ionic-native/native-storage/ngx/index.js");
    /* harmony import */


    var _shared_services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../shared/services/user.service */
    "./src/app/shared/services/user.service.ts");

    var SplashComponent = /*#__PURE__*/function () {
      function SplashComponent(router, userService, nativeStorage) {
        _classCallCheck(this, SplashComponent);

        this.router = router;
        this.userService = userService;
        this.nativeStorage = nativeStorage;
      }

      _createClass(SplashComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {// Code auto-enter login
          // this.userService.userLoaded$.subscribe(loaded => {
          //     if (loaded) {
          //         this.router.navigate(['app/diagnostic-send']);
          //     }
          // });
        }
      }, {
        key: "enter",
        value: function enter() {
          // this.router.navigate(['app/diagnostic-send']);
          this.router.navigate(['login']);
        }
      }]);

      return SplashComponent;
    }();

    SplashComponent.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
      }, {
        type: _shared_services_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"]
      }, {
        type: _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__["NativeStorage"]
      }];
    };

    SplashComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'splash',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./splash.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/splash/splash.component.html"))["default"],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./splash.component.scss */
      "./src/app/splash/splash.component.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _shared_services_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"], _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__["NativeStorage"]])], SplashComponent);
    /***/
  },

  /***/
  "./src/app/splash/splash.module.ts":
  /*!*****************************************!*\
    !*** ./src/app/splash/splash.module.ts ***!
    \*****************************************/

  /*! exports provided: SplashModule */

  /***/
  function srcAppSplashSplashModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SplashModule", function () {
      return SplashModule;
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


    var _splash_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./splash.component */
    "./src/app/splash/splash.component.ts");

    var SplashModule = function SplashModule() {
      _classCallCheck(this, SplashModule);
    };

    SplashModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
      imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{
        path: '',
        component: _splash_component__WEBPACK_IMPORTED_MODULE_6__["SplashComponent"]
      }])],
      declarations: [_splash_component__WEBPACK_IMPORTED_MODULE_6__["SplashComponent"]]
    })], SplashModule);
    /***/
  }
}]);
//# sourceMappingURL=splash-splash-module-es5.js.map