function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "./$$_lazy_route_resource lazy recursive":
  /*!******************************************************!*\
    !*** ./$$_lazy_route_resource lazy namespace object ***!
    \******************************************************/

  /*! no static exports found */

  /***/
  function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./node_modules/@ionic/core/dist/esm lazy recursive ^\\.\\/.*\\.entry\\.js$ include: \\.entry\\.js$ exclude: \\.system\\.entry\\.js$":
  /*!*****************************************************************************************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm lazy ^\.\/.*\.entry\.js$ include: \.entry\.js$ exclude: \.system\.entry\.js$ namespace object ***!
    \*****************************************************************************************************************************************/

  /*! no static exports found */

  /***/
  function node_modulesIonicCoreDistEsmLazyRecursiveEntryJs$IncludeEntryJs$ExcludeSystemEntryJs$(module, exports, __webpack_require__) {
    var map = {
      "./ion-action-sheet-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-action-sheet-ios.entry.js", "common", 0],
      "./ion-action-sheet-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-action-sheet-md.entry.js", "common", 1],
      "./ion-alert-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-alert-ios.entry.js", "common", 2],
      "./ion-alert-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-alert-md.entry.js", "common", 3],
      "./ion-app_8-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-app_8-ios.entry.js", "common", 4],
      "./ion-app_8-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-app_8-md.entry.js", "common", 5],
      "./ion-avatar_3-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-avatar_3-ios.entry.js", "common", 6],
      "./ion-avatar_3-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-avatar_3-md.entry.js", "common", 7],
      "./ion-back-button-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-back-button-ios.entry.js", "common", 8],
      "./ion-back-button-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-back-button-md.entry.js", "common", 9],
      "./ion-backdrop-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-backdrop-ios.entry.js", 10],
      "./ion-backdrop-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-backdrop-md.entry.js", 11],
      "./ion-button_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-button_2-ios.entry.js", "common", 12],
      "./ion-button_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-button_2-md.entry.js", "common", 13],
      "./ion-card_5-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-card_5-ios.entry.js", "common", 14],
      "./ion-card_5-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-card_5-md.entry.js", "common", 15],
      "./ion-checkbox-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-checkbox-ios.entry.js", "common", 16],
      "./ion-checkbox-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-checkbox-md.entry.js", "common", 17],
      "./ion-chip-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-chip-ios.entry.js", "common", 18],
      "./ion-chip-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-chip-md.entry.js", "common", 19],
      "./ion-col_3.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-col_3.entry.js", 20],
      "./ion-datetime_3-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-datetime_3-ios.entry.js", "common", 21],
      "./ion-datetime_3-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-datetime_3-md.entry.js", "common", 22],
      "./ion-fab_3-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-fab_3-ios.entry.js", "common", 23],
      "./ion-fab_3-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-fab_3-md.entry.js", "common", 24],
      "./ion-img.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-img.entry.js", 25],
      "./ion-infinite-scroll_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-infinite-scroll_2-ios.entry.js", "common", 26],
      "./ion-infinite-scroll_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-infinite-scroll_2-md.entry.js", "common", 27],
      "./ion-input-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-input-ios.entry.js", "common", 28],
      "./ion-input-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-input-md.entry.js", "common", 29],
      "./ion-item-option_3-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-item-option_3-ios.entry.js", "common", 30],
      "./ion-item-option_3-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-item-option_3-md.entry.js", "common", 31],
      "./ion-item_8-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-item_8-ios.entry.js", "common", 32],
      "./ion-item_8-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-item_8-md.entry.js", "common", 33],
      "./ion-loading-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-loading-ios.entry.js", "common", 34],
      "./ion-loading-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-loading-md.entry.js", "common", 35],
      "./ion-menu_3-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-menu_3-ios.entry.js", "common", 36],
      "./ion-menu_3-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-menu_3-md.entry.js", "common", 37],
      "./ion-modal-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-modal-ios.entry.js", "common", 38],
      "./ion-modal-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-modal-md.entry.js", "common", 39],
      "./ion-nav_2.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-nav_2.entry.js", "common", 40],
      "./ion-popover-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-popover-ios.entry.js", "common", 41],
      "./ion-popover-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-popover-md.entry.js", "common", 42],
      "./ion-progress-bar-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-progress-bar-ios.entry.js", "common", 43],
      "./ion-progress-bar-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-progress-bar-md.entry.js", "common", 44],
      "./ion-radio_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-radio_2-ios.entry.js", "common", 45],
      "./ion-radio_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-radio_2-md.entry.js", "common", 46],
      "./ion-range-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-range-ios.entry.js", "common", 47],
      "./ion-range-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-range-md.entry.js", "common", 48],
      "./ion-refresher_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-refresher_2-ios.entry.js", "common", 49],
      "./ion-refresher_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-refresher_2-md.entry.js", "common", 50],
      "./ion-reorder_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-reorder_2-ios.entry.js", "common", 51],
      "./ion-reorder_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-reorder_2-md.entry.js", "common", 52],
      "./ion-ripple-effect.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-ripple-effect.entry.js", 53],
      "./ion-route_4.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-route_4.entry.js", "common", 54],
      "./ion-searchbar-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-searchbar-ios.entry.js", "common", 55],
      "./ion-searchbar-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-searchbar-md.entry.js", "common", 56],
      "./ion-segment_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-segment_2-ios.entry.js", "common", 57],
      "./ion-segment_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-segment_2-md.entry.js", "common", 58],
      "./ion-select_3-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-select_3-ios.entry.js", "common", 59],
      "./ion-select_3-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-select_3-md.entry.js", "common", 60],
      "./ion-slide_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-slide_2-ios.entry.js", 61],
      "./ion-slide_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-slide_2-md.entry.js", 62],
      "./ion-spinner.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-spinner.entry.js", "common", 63],
      "./ion-split-pane-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-split-pane-ios.entry.js", 64],
      "./ion-split-pane-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-split-pane-md.entry.js", 65],
      "./ion-tab-bar_2-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-tab-bar_2-ios.entry.js", "common", 66],
      "./ion-tab-bar_2-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-tab-bar_2-md.entry.js", "common", 67],
      "./ion-tab_2.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-tab_2.entry.js", "common", 68],
      "./ion-text.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-text.entry.js", "common", 69],
      "./ion-textarea-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-textarea-ios.entry.js", "common", 70],
      "./ion-textarea-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-textarea-md.entry.js", "common", 71],
      "./ion-toast-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-toast-ios.entry.js", "common", 72],
      "./ion-toast-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-toast-md.entry.js", "common", 73],
      "./ion-toggle-ios.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-toggle-ios.entry.js", "common", 74],
      "./ion-toggle-md.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-toggle-md.entry.js", "common", 75],
      "./ion-virtual-scroll.entry.js": ["./node_modules/@ionic/core/dist/esm/ion-virtual-scroll.entry.js", 76]
    };

    function webpackAsyncContext(req) {
      if (!__webpack_require__.o(map, req)) {
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + req + "'");
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        });
      }

      var ids = map[req],
          id = ids[0];
      return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function () {
        return __webpack_require__(id);
      });
    }

    webpackAsyncContext.keys = function webpackAsyncContextKeys() {
      return Object.keys(map);
    };

    webpackAsyncContext.id = "./node_modules/@ionic/core/dist/esm lazy recursive ^\\.\\/.*\\.entry\\.js$ include: \\.entry\\.js$ exclude: \\.system\\.entry\\.js$";
    module.exports = webpackAsyncContext;
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/app-container.component.html":
  /*!**************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/app-container.component.html ***!
    \**************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppAppContainerAppContainerComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-menu class=\"menu\" side=\"start\" menuId=\"menu\" contentId=\"main\">\n    <ion-header>\n        <div class=\"menu__header menu__separator\" (click)=\"goToHome()\">\n            <avatar class=\"menu__header-circle\" [userName]=\"userName\"></avatar>\n            <div class=\"menu__header-name\">{{userName}}</div>\n        </div>\n    </ion-header>\n    <ion-content>\n        <div>\n            <div class=\"menu__item\" (click)=\"goToIdentity()\">\n                <img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-info.svg\">\n                <ng-container i18n=\"@@coronavirusIdentityUserMenuLabel\">Subir diagnóstico</ng-container>\n            </div>\n        </div>\n    </ion-content>\n    <ion-toolbar>\n        <div>\n            <div class=\"menu__item menu__item--sm\" (click)=\"goToMyInfo()\">\n                <img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-usuario.svg\">\n                <ng-container i18n=\"@@myInfoMenuLabel\">Mis datos</ng-container>\n            </div>\n            <div class=\"menu__item menu__item--sm\" (click)=\"goExit()\">\n                <img class=\"button-icon filter-black\" src=\"/assets/icons/svg/icon-salir-casa.svg\">\n                <ng-container i18n=\"@@exitMenuLabel\">Salir</ng-container>\n            </div>\n        </div>\n    </ion-toolbar>\n</ion-menu>\n\n<!-- the main content -->\n<ion-router-outlet class=\"app-router-outlet\" id=\"main\"></ion-router-outlet>\n";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
  /*!**************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
    \**************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppAppComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-app>\n  <ion-router-outlet></ion-router-outlet>\n</ion-app>\n";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/shared/avatar/avatar.component.html":
  /*!*******************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/shared/avatar/avatar.component.html ***!
    \*******************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppSharedAvatarAvatarComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"circle circle--gray\">{{ chartUser }}</div>";
    /***/
  },

  /***/
  "./node_modules/tslib/tslib.es6.js":
  /*!*****************************************!*\
    !*** ./node_modules/tslib/tslib.es6.js ***!
    \*****************************************/

  /*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */

  /***/
  function node_modulesTslibTslibEs6Js(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__extends", function () {
      return __extends;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__assign", function () {
      return _assign;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__rest", function () {
      return __rest;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__decorate", function () {
      return __decorate;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__param", function () {
      return __param;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__metadata", function () {
      return __metadata;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__awaiter", function () {
      return __awaiter;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__generator", function () {
      return __generator;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__exportStar", function () {
      return __exportStar;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__values", function () {
      return __values;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__read", function () {
      return __read;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__spread", function () {
      return __spread;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__spreadArrays", function () {
      return __spreadArrays;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__await", function () {
      return __await;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function () {
      return __asyncGenerator;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function () {
      return __asyncDelegator;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__asyncValues", function () {
      return __asyncValues;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function () {
      return __makeTemplateObject;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__importStar", function () {
      return __importStar;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__importDefault", function () {
      return __importDefault;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function () {
      return __classPrivateFieldGet;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function () {
      return __classPrivateFieldSet;
    });
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0
    
    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.
    
    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */


    var _extendStatics = function extendStatics(d, b) {
      _extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) {
          if (b.hasOwnProperty(p)) d[p] = b[p];
        }
      };

      return _extendStatics(d, b);
    };

    function __extends(d, b) {
      _extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var _assign = function __assign() {
      _assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

      return _assign.apply(this, arguments);
    };

    function __rest(s, e) {
      var t = {};

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      }

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    function __decorate(decorators, target, key, desc) {
      var c = arguments.length,
          r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
          d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      }
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
      return function (target, key) {
        decorator(target, key, paramIndex);
      };
    }

    function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }

    function __generator(thisArg, body) {
      var _ = {
        label: 0,
        sent: function sent() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
          f,
          y,
          t,
          g;
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;

      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }

      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");

        while (_) {
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];

            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;

              case 4:
                _.label++;
                return {
                  value: op[1],
                  done: false
                };

              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;

              case 7:
                op = _.ops.pop();

                _.trys.pop();

                continue;

              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }

                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }

                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }

                if (t && _.label < t[2]) {
                  _.label = t[2];

                  _.ops.push(op);

                  break;
                }

                if (t[2]) _.ops.pop();

                _.trys.pop();

                continue;
            }

            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        }

        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    }

    function __exportStar(m, exports) {
      for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
      }
    }

    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function next() {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
          r,
          ar = [],
          e;

      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
          ar.push(r.value);
        }
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }

      return ar;
    }

    function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++) {
        ar = ar.concat(__read(arguments[i]));
      }

      return ar;
    }

    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
        s += arguments[i].length;
      }

      for (var r = Array(s), k = 0, i = 0; i < il; i++) {
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
          r[k] = a[j];
        }
      }

      return r;
    }

    ;

    function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []),
          i,
          q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
      }, i;

      function verb(n) {
        if (g[n]) i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
      }

      function resume(n, v) {
        try {
          step(g[n](v));
        } catch (e) {
          settle(q[0][3], e);
        }
      }

      function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
      }

      function fulfill(value) {
        resume("next", value);
      }

      function reject(value) {
        resume("throw", value);
      }

      function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
      }
    }

    function __asyncDelegator(o) {
      var i, p;
      return i = {}, verb("next"), verb("throw", function (e) {
        throw e;
      }), verb("return"), i[Symbol.iterator] = function () {
        return this;
      }, i;

      function verb(n, f) {
        i[n] = o[n] ? function (v) {
          return (p = !p) ? {
            value: __await(o[n](v)),
            done: n === "return"
          } : f ? f(v) : v;
        } : f;
      }
    }

    function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator],
          i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
      }, i);

      function verb(n) {
        i[n] = o[n] && function (v) {
          return new Promise(function (resolve, reject) {
            v = o[n](v), settle(resolve, reject, v.done, v.value);
          });
        };
      }

      function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function (v) {
          resolve({
            value: v,
            done: d
          });
        }, reject);
      }
    }

    function __makeTemplateObject(cooked, raw) {
      if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", {
          value: raw
        });
      } else {
        cooked.raw = raw;
      }

      return cooked;
    }

    ;

    function __importStar(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
      }
      result["default"] = mod;
      return result;
    }

    function __importDefault(mod) {
      return mod && mod.__esModule ? mod : {
        "default": mod
      };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
      if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
      }

      return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
      if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
      }

      privateMap.set(receiver, value);
      return value;
    }
    /***/

  },

  /***/
  "./src/app/app-container/app-container.component.scss":
  /*!************************************************************!*\
    !*** ./src/app/app-container/app-container.component.scss ***!
    \************************************************************/

  /*! exports provided: default */

  /***/
  function srcAppAppContainerAppContainerComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".menu__separator {\n  border-bottom: 1px solid lightgray;\n  padding-bottom: 16px;\n}\n.menu__header {\n  display: flex;\n  align-items: center;\n  margin: 0 16px;\n  padding: 24px 0 16px 0;\n}\n.menu__header .circle {\n  margin-right: 10px;\n}\n.menu__header-name {\n  font-size: 16px;\n}\n@media (min-width: 321px) {\n  .menu__header-name {\n    font-size: 18px;\n    line-height: 22px;\n  }\n}\n.menu__item {\n  display: flex;\n  align-items: center;\n  padding-top: 16px;\n}\n.menu__item img {\n  margin-right: 16px;\n}\n@media (min-width: 321px) {\n  .menu__item img {\n    width: 30px;\n    height: auto;\n  }\n}\n.menu__item--sm {\n  font-size: 14px;\n  line-height: 16px;\n}\n@media (min-width: 321px) {\n  .menu__item--sm {\n    font-size: 18px;\n    line-height: 22px;\n  }\n}\n.menu__item--xs {\n  color: #9b9b9b;\n  padding-left: 40px;\n  text-decoration: underline;\n  font-size: 14px;\n}\n@media (min-width: 321px) {\n  .menu__item--xs {\n    font-size: 18px;\n    line-height: 22px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLWhlYWx0aC9zcmMvYXBwL2FwcC1jb250YWluZXIvYXBwLWNvbnRhaW5lci5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvYXBwLWNvbnRhaW5lci9hcHAtY29udGFpbmVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQ0Usa0NBQUE7RUFDQSxvQkFBQTtBQ0FKO0FER0U7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBQ0Esc0JBQUE7QUNESjtBREdJO0VBQ0Usa0JBQUE7QUNETjtBRElJO0VBQ0UsZUFBQTtBQ0ZOO0FESU07RUFIRjtJQUlJLGVBQUE7SUFDQSxpQkFBQTtFQ0ROO0FBQ0Y7QURNRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGlCQUFBO0FDSko7QURNSTtFQUNFLGtCQUFBO0FDSk47QURLTTtFQUZGO0lBR0ksV0FBQTtJQUNBLFlBQUE7RUNGTjtBQUNGO0FES0k7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7QUNITjtBRElNO0VBSEY7SUFJSSxlQUFBO0lBQ0EsaUJBQUE7RUNETjtBQUNGO0FESUk7RUFDRSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSwwQkFBQTtFQUNBLGVBQUE7QUNGTjtBREdNO0VBTEY7SUFNSSxlQUFBO0lBQ0EsaUJBQUE7RUNBTjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvYXBwLWNvbnRhaW5lci9hcHAtY29udGFpbmVyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1lbnV7XG4gICZfX3NlcGFyYXRvciB7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGxpZ2h0Z3JheTtcbiAgICBwYWRkaW5nLWJvdHRvbTogMTZweDtcbiAgfVxuXG4gICZfX2hlYWRlcntcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgbWFyZ2luOiAwIDE2cHg7XG4gICAgcGFkZGluZzogMjRweCAwIDE2cHggMDsgIFxuXG4gICAgLmNpcmNsZXtcbiAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICB9IFxuICAgICAgXG4gICAgJi1uYW1lIHtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcblxuICAgICAgQG1lZGlhIChtaW4td2lkdGg6IDMyMXB4KSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gICAgICB9ICAgIFxuICAgIH1cblxuICB9XG5cbiAgJl9faXRlbSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHBhZGRpbmctdG9wOiAxNnB4O1xuXG4gICAgaW1nIHtcbiAgICAgIG1hcmdpbi1yaWdodDogMTZweDtcbiAgICAgIEBtZWRpYSAobWluLXdpZHRoOiAzMjFweCkge1xuICAgICAgICB3aWR0aDogMzBweDtcbiAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgfVxuICAgIH1cblxuICAgICYtLXNte1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICBAbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICAgIH1cblxuICAgIH1cbiAgICAmLS14c3tcbiAgICAgIGNvbG9yOiAjOWI5YjliO1xuICAgICAgcGFkZGluZy1sZWZ0OiA0MHB4O1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBAbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICAgIH0gICAgXG4gICAgfVxuICB9XG59XG4iLCIubWVudV9fc2VwYXJhdG9yIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGxpZ2h0Z3JheTtcbiAgcGFkZGluZy1ib3R0b206IDE2cHg7XG59XG4ubWVudV9faGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luOiAwIDE2cHg7XG4gIHBhZGRpbmc6IDI0cHggMCAxNnB4IDA7XG59XG4ubWVudV9faGVhZGVyIC5jaXJjbGUge1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG59XG4ubWVudV9faGVhZGVyLW5hbWUge1xuICBmb250LXNpemU6IDE2cHg7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgLm1lbnVfX2hlYWRlci1uYW1lIHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gIH1cbn1cbi5tZW51X19pdGVtIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZy10b3A6IDE2cHg7XG59XG4ubWVudV9faXRlbSBpbWcge1xuICBtYXJnaW4tcmlnaHQ6IDE2cHg7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgLm1lbnVfX2l0ZW0gaW1nIHtcbiAgICB3aWR0aDogMzBweDtcbiAgICBoZWlnaHQ6IGF1dG87XG4gIH1cbn1cbi5tZW51X19pdGVtLS1zbSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbGluZS1oZWlnaHQ6IDE2cHg7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgLm1lbnVfX2l0ZW0tLXNtIHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gIH1cbn1cbi5tZW51X19pdGVtLS14cyB7XG4gIGNvbG9yOiAjOWI5YjliO1xuICBwYWRkaW5nLWxlZnQ6IDQwcHg7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICBmb250LXNpemU6IDE0cHg7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgLm1lbnVfX2l0ZW0tLXhzIHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gIH1cbn0iXX0= */";
    /***/
  },

  /***/
  "./src/app/app-container/app-container.component.ts":
  /*!**********************************************************!*\
    !*** ./src/app/app-container/app-container.component.ts ***!
    \**********************************************************/

  /*! exports provided: AppContainerComponent */

  /***/
  function srcAppAppContainerAppContainerComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppContainerComponent", function () {
      return AppContainerComponent;
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


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ionic-native/in-app-browser/ngx */
    "./node_modules/@ionic-native/in-app-browser/ngx/index.js");
    /* harmony import */


    var _shared_services_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../shared/services/user.service */
    "./src/app/shared/services/user.service.ts");

    var AppContainerComponent = /*#__PURE__*/function () {
      function AppContainerComponent(menu, router, navCtrl, userService, iab) {
        _classCallCheck(this, AppContainerComponent);

        this.menu = menu;
        this.router = router;
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.iab = iab;
      }

      _createClass(AppContainerComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          this.user = this.userService.user;

          if (this.user) {
            this.userName = this.user.firstName + ' ' + this.user.lastName;
          }
        }
      }, {
        key: "openMenu",
        value: function openMenu() {
          this.menu.enable(true, 'menu');
          this.menu.open('menu');
        }
      }, {
        key: "closeMenu",
        value: function closeMenu() {
          this.menu.close('menu');
        }
      }, {
        key: "goToIdentity",
        value: function goToIdentity() {
          this.closeMenu();
          this.router.navigate(['/app/qr-reader']);
        }
      }, {
        key: "goToMyInfo",
        value: function goToMyInfo() {
          this.closeMenu();
          this.router.navigate(['/app/my-info']);
        }
      }, {
        key: "goExit",
        value: function goExit() {
          this.closeMenu();
          this.userService.user = null;
          this.navCtrl.navigateRoot(['login']);
        }
      }]);

      return AppContainerComponent;
    }();

    AppContainerComponent.ctorParameters = function () {
      return [{
        type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["MenuController"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]
      }, {
        type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["NavController"]
      }, {
        type: _shared_services_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"]
      }, {
        type: _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_4__["InAppBrowser"]
      }];
    };

    AppContainerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-container',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./app-container.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/app-container/app-container.component.html"))["default"],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./app-container.component.scss */
      "./src/app/app-container/app-container.component.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_2__["MenuController"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["NavController"], _shared_services_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"], _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_4__["InAppBrowser"]])], AppContainerComponent);
    /***/
  },

  /***/
  "./src/app/app-routing.module.ts":
  /*!***************************************!*\
    !*** ./src/app/app-routing.module.ts ***!
    \***************************************/

  /*! exports provided: AppRoutingModule */

  /***/
  function srcAppAppRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
      return AppRoutingModule;
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


    var _app_container_app_container_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./app-container/app-container.component */
    "./src/app/app-container/app-container.component.ts");

    var routes = [{
      path: 'splash',
      children: [{
        path: '',
        loadChildren: function loadChildren() {
          return __webpack_require__.e(
          /*! import() | splash-splash-module */
          "splash-splash-module").then(__webpack_require__.bind(null,
          /*! ./splash/splash.module */
          "./src/app/splash/splash.module.ts")).then(function (m) {
            return m.SplashModule;
          });
        }
      }]
    }, {
      path: 'login',
      children: [{
        path: '',
        loadChildren: function loadChildren() {
          return __webpack_require__.e(
          /*! import() | login-login-module */
          "login-login-module").then(__webpack_require__.bind(null,
          /*! ./login/login.module */
          "./src/app/login/login.module.ts")).then(function (m) {
            return m.LoginModule;
          });
        }
      }]
    }, {
      path: 'app',
      component: _app_container_app_container_component__WEBPACK_IMPORTED_MODULE_3__["AppContainerComponent"],
      children: [{
        path: 'diagnostic-send',
        children: [{
          path: '',
          loadChildren: function loadChildren() {
            return Promise.all(
            /*! import() | app-container-diagnostic-send-diagnostic-send-module */
            [__webpack_require__.e("common"), __webpack_require__.e("app-container-diagnostic-send-diagnostic-send-module")]).then(__webpack_require__.bind(null,
            /*! ./app-container/diagnostic-send/diagnostic-send.module */
            "./src/app/app-container/diagnostic-send/diagnostic-send.module.ts")).then(function (m) {
              return m.DiagnosticSendModule;
            });
          }
        }]
      }, {
        path: 'diagnostic-send-result',
        children: [{
          path: '',
          loadChildren: function loadChildren() {
            return Promise.all(
            /*! import() | app-container-diagnostic-send-result-diagnostic-send-result-module */
            [__webpack_require__.e("common"), __webpack_require__.e("app-container-diagnostic-send-result-diagnostic-send-result-module")]).then(__webpack_require__.bind(null,
            /*! ./app-container/diagnostic-send-result/diagnostic-send-result.module */
            "./src/app/app-container/diagnostic-send-result/diagnostic-send-result.module.ts")).then(function (m) {
              return m.DiagnosticSendResultModule;
            });
          }
        }]
      }, {
        path: 'my-info',
        children: [{
          path: '',
          loadChildren: function loadChildren() {
            return __webpack_require__.e(
            /*! import() | app-container-user-info-user-info-module */
            "app-container-user-info-user-info-module").then(__webpack_require__.bind(null,
            /*! ./app-container/user-info/user-info.module */
            "./src/app/app-container/user-info/user-info.module.ts")).then(function (m) {
              return m.UserInfoModule;
            });
          }
        }]
      }]
    }, {
      path: '',
      redirectTo: '/splash',
      pathMatch: 'full'
    }];

    var AppRoutingModule = function AppRoutingModule() {
      _classCallCheck(this, AppRoutingModule);
    };

    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, {
        preloadingStrategy: _angular_router__WEBPACK_IMPORTED_MODULE_2__["PreloadAllModules"]
      })],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })], AppRoutingModule);
    /***/
  },

  /***/
  "./src/app/app.component.scss":
  /*!************************************!*\
    !*** ./src/app/app.component.scss ***!
    \************************************/

  /*! exports provided: default */

  /***/
  function srcAppAppComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */";
    /***/
  },

  /***/
  "./src/app/app.component.ts":
  /*!**********************************!*\
    !*** ./src/app/app.component.ts ***!
    \**********************************/

  /*! exports provided: AppComponent */

  /***/
  function srcAppAppComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
      return AppComponent;
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


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
    /* harmony import */


    var _ionic_native_splash_screen_ngx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @ionic-native/splash-screen/ngx */
    "./node_modules/@ionic-native/splash-screen/ngx/index.js");
    /* harmony import */


    var _ionic_native_status_bar_ngx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ionic-native/status-bar/ngx */
    "./node_modules/@ionic-native/status-bar/ngx/index.js");

    var AppComponent = /*#__PURE__*/function () {
      function AppComponent(platform, splashScreen, statusBar) {
        _classCallCheck(this, AppComponent);

        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.initializeApp();
      }

      _createClass(AppComponent, [{
        key: "initializeApp",
        value: function initializeApp() {
          var _this = this;

          this.platform.ready().then(function () {
            _this.statusBar.styleDefault();

            _this.splashScreen.hide();
          });
        }
      }]);

      return AppComponent;
    }();

    AppComponent.ctorParameters = function () {
      return [{
        type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["Platform"]
      }, {
        type: _ionic_native_splash_screen_ngx__WEBPACK_IMPORTED_MODULE_3__["SplashScreen"]
      }, {
        type: _ionic_native_status_bar_ngx__WEBPACK_IMPORTED_MODULE_4__["StatusBar"]
      }];
    };

    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-root',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./app.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html"))["default"],
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./app.component.scss */
      "./src/app/app.component.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_2__["Platform"], _ionic_native_splash_screen_ngx__WEBPACK_IMPORTED_MODULE_3__["SplashScreen"], _ionic_native_status_bar_ngx__WEBPACK_IMPORTED_MODULE_4__["StatusBar"]])], AppComponent);
    /***/
  },

  /***/
  "./src/app/app.module.ts":
  /*!*******************************!*\
    !*** ./src/app/app.module.ts ***!
    \*******************************/

  /*! exports provided: AppModule */

  /***/
  function srcAppAppModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
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


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
    /* harmony import */


    var _ionic_native_splash_screen_ngx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @ionic-native/splash-screen/ngx */
    "./node_modules/@ionic-native/splash-screen/ngx/index.js");
    /* harmony import */


    var _ionic_native_status_bar_ngx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @ionic-native/status-bar/ngx */
    "./node_modules/@ionic-native/status-bar/ngx/index.js");
    /* harmony import */


    var _app_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./app-routing.module */
    "./src/app/app-routing.module.ts");
    /* harmony import */


    var _app_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./app.component */
    "./src/app/app.component.ts");
    /* harmony import */


    var _shared_sdkconfiguration_provider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ./shared/sdkconfiguration.provider */
    "./src/app/shared/sdkconfiguration.provider.ts");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ../environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! @ionic-native/native-storage/ngx */
    "./node_modules/@ionic-native/native-storage/ngx/index.js");
    /* harmony import */


    var _app_container_app_container_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! ./app-container/app-container.component */
    "./src/app/app-container/app-container.component.ts");
    /* harmony import */


    var _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
    /*! @ionic-native/in-app-browser/ngx */
    "./node_modules/@ionic-native/in-app-browser/ngx/index.js");
    /* harmony import */


    var _ionic_native_barcode_scanner_ngx__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
    /*! @ionic-native/barcode-scanner/ngx */
    "./node_modules/@ionic-native/barcode-scanner/ngx/index.js");
    /* harmony import */


    var _shared_services_user_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
    /*! ./shared/services/user.service */
    "./src/app/shared/services/user.service.ts");
    /* harmony import */


    var _shared_avatar_avatar_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
    /*! ./shared/avatar/avatar.module */
    "./src/app/shared/avatar/avatar.module.ts");

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      declarations: [_app_component__WEBPACK_IMPORTED_MODULE_8__["AppComponent"], _app_container_app_container_component__WEBPACK_IMPORTED_MODULE_13__["AppContainerComponent"]],
      entryComponents: [],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_11__["HttpClientModule"], _shared_avatar_avatar_module__WEBPACK_IMPORTED_MODULE_17__["AvatarModule"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"].forRoot({
        mode: 'ios'
      }), _app_routing_module__WEBPACK_IMPORTED_MODULE_7__["AppRoutingModule"]],
      providers: [_ionic_native_status_bar_ngx__WEBPACK_IMPORTED_MODULE_6__["StatusBar"], _ionic_native_splash_screen_ngx__WEBPACK_IMPORTED_MODULE_5__["SplashScreen"], _shared_sdkconfiguration_provider__WEBPACK_IMPORTED_MODULE_9__["sdkConfigurationProvider"], _shared_services_user_service__WEBPACK_IMPORTED_MODULE_16__["UserService"], _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_12__["NativeStorage"], _ionic_native_in_app_browser_ngx__WEBPACK_IMPORTED_MODULE_14__["InAppBrowser"], _ionic_native_barcode_scanner_ngx__WEBPACK_IMPORTED_MODULE_15__["BarcodeScanner"], {
        provide: 'environment',
        useValue: _environments_environment__WEBPACK_IMPORTED_MODULE_10__["environment"]
      }, {
        provide: _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouteReuseStrategy"],
        useClass: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicRouteStrategy"]
      }],
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_8__["AppComponent"]]
    })], AppModule);
    /***/
  },

  /***/
  "./src/app/shared/avatar/avatar.component.scss":
  /*!*****************************************************!*\
    !*** ./src/app/shared/avatar/avatar.component.scss ***!
    \*****************************************************/

  /*! exports provided: default */

  /***/
  function srcAppSharedAvatarAvatarComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".circle {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  font-size: 14px;\n  text-align: center;\n  line-height: 32px;\n}\n@media (min-width: 321px) {\n  .circle {\n    font-size: 18px;\n    line-height: 22px;\n  }\n}\n.circle--gray {\n  background: #f3f3f3;\n  color: black;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vcmRhcy93d3cvY29yb25hdmlydXMtYXBwLXJlYWwvYXBwLWhlYWx0aC9zcmMvYXBwL3NoYXJlZC9hdmF0YXIvYXZhdGFyLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9zaGFyZWQvYXZhdGFyL2F2YXRhci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtBQ0NGO0FEQUU7RUFQRjtJQVFJLGVBQUE7SUFDQSxpQkFBQTtFQ0dGO0FBQ0Y7QURERTtFQUNFLG1CQUFBO0VBQ0EsWUFBQTtBQ0dKIiwiZmlsZSI6InNyYy9hcHAvc2hhcmVkL2F2YXRhci9hdmF0YXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY2lyY2xlIHtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBmb250LXNpemU6IDE0cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbGluZS1oZWlnaHQ6IDMycHg7XG4gIEBtZWRpYSAobWluLXdpZHRoOiAzMjFweCkge1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgfSAgICBcblxuICAmLS1ncmF5IHtcbiAgICBiYWNrZ3JvdW5kOiAjZjNmM2YzO1xuICAgIGNvbG9yOiBibGFjaztcbiAgfVxuICBcbn0iLCIuY2lyY2xlIHtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBmb250LXNpemU6IDE0cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbGluZS1oZWlnaHQ6IDMycHg7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIxcHgpIHtcbiAgLmNpcmNsZSB7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAyMnB4O1xuICB9XG59XG4uY2lyY2xlLS1ncmF5IHtcbiAgYmFja2dyb3VuZDogI2YzZjNmMztcbiAgY29sb3I6IGJsYWNrO1xufSJdfQ== */";
    /***/
  },

  /***/
  "./src/app/shared/avatar/avatar.component.ts":
  /*!***************************************************!*\
    !*** ./src/app/shared/avatar/avatar.component.ts ***!
    \***************************************************/

  /*! exports provided: AvatarComponent */

  /***/
  function srcAppSharedAvatarAvatarComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AvatarComponent", function () {
      return AvatarComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");

    var AvatarComponent = /*#__PURE__*/function () {
      function AvatarComponent() {
        _classCallCheck(this, AvatarComponent);
      }

      _createClass(AvatarComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {// this.chartUser = this.userName.charAt(0);
        }
      }, {
        key: "ngOnChanges",
        value: function ngOnChanges(changes) {
          if (changes.userName) {
            if (changes.userName && changes.userName.currentValue) {
              this.chartUser = changes.userName.currentValue.charAt(0);
            }
          }
        }
      }]);

      return AvatarComponent;
    }();

    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)], AvatarComponent.prototype, "userName", void 0);
    AvatarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'avatar',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./avatar.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/shared/avatar/avatar.component.html"))["default"],
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./avatar.component.scss */
      "./src/app/shared/avatar/avatar.component.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])], AvatarComponent);
    /***/
  },

  /***/
  "./src/app/shared/avatar/avatar.module.ts":
  /*!************************************************!*\
    !*** ./src/app/shared/avatar/avatar.module.ts ***!
    \************************************************/

  /*! exports provided: AvatarModule */

  /***/
  function srcAppSharedAvatarAvatarModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AvatarModule", function () {
      return AvatarModule;
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


    var _avatar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./avatar.component */
    "./src/app/shared/avatar/avatar.component.ts");
    /* harmony import */


    var ngx_qrcode2__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ngx-qrcode2 */
    "./node_modules/ngx-qrcode2/index.js");

    var AvatarModule = function AvatarModule() {
      _classCallCheck(this, AvatarModule);
    };

    AvatarModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
      imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"], ngx_qrcode2__WEBPACK_IMPORTED_MODULE_6__["NgxQRCodeModule"]],
      declarations: [_avatar_component__WEBPACK_IMPORTED_MODULE_5__["AvatarComponent"]],
      exports: [_avatar_component__WEBPACK_IMPORTED_MODULE_5__["AvatarComponent"]]
    })], AvatarModule);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api.module.ts":
  /*!******************************************!*\
    !*** ./src/app/shared/sdk/api.module.ts ***!
    \******************************************/

  /*! exports provided: ApiModule */

  /***/
  function srcAppSharedSdkApiModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ApiModule", function () {
      return ApiModule;
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


    var _configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./configuration */
    "./src/app/shared/sdk/configuration.ts");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");

    var ApiModule_1;

    var ApiModule = ApiModule_1 = /*#__PURE__*/function () {
      function ApiModule(parentModule, http) {
        _classCallCheck(this, ApiModule);

        if (parentModule) {
          throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }

        if (!http) {
          throw new Error('You need to import the HttpClientModule in your AppModule! \n' + 'See also https://github.com/angular/angular/issues/20575');
        }
      }

      _createClass(ApiModule, null, [{
        key: "forRoot",
        value: function forRoot(configurationFactory) {
          return {
            ngModule: ApiModule_1,
            providers: [{
              provide: _configuration__WEBPACK_IMPORTED_MODULE_2__["Configuration"],
              useFactory: configurationFactory
            }]
          };
        }
      }]);

      return ApiModule;
    }();

    ApiModule.ctorParameters = function () {
      return [{
        type: ApiModule,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["SkipSelf"]
        }]
      }, {
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    ApiModule = ApiModule_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [],
      declarations: [],
      exports: [],
      providers: []
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["SkipSelf"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ApiModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"]])], ApiModule);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/api.ts":
  /*!***************************************!*\
    !*** ./src/app/shared/sdk/api/api.ts ***!
    \***************************************/

  /*! exports provided: AuthControllerService, PoliceOfficerControllerService, APIS, BluetoothLeAdvertisementControllerService, DocumentControllerService, GeolocationControllerService, HealthCenterControllerService, LeaveRequestControllerService, PatientControllerService, PingControllerService, SanitarianControllerService, TestAppointmentControllerService, TestQuestionControllerService, TestResultControllerService */

  /***/
  function srcAppSharedSdkApiApiTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "APIS", function () {
      return APIS;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _authController_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./authController.service */
    "./src/app/shared/sdk/api/authController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "AuthControllerService", function () {
      return _authController_service__WEBPACK_IMPORTED_MODULE_1__["AuthControllerService"];
    });
    /* harmony import */


    var _bluetoothLeAdvertisementController_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./bluetoothLeAdvertisementController.service */
    "./src/app/shared/sdk/api/bluetoothLeAdvertisementController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "BluetoothLeAdvertisementControllerService", function () {
      return _bluetoothLeAdvertisementController_service__WEBPACK_IMPORTED_MODULE_2__["BluetoothLeAdvertisementControllerService"];
    });
    /* harmony import */


    var _documentController_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./documentController.service */
    "./src/app/shared/sdk/api/documentController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "DocumentControllerService", function () {
      return _documentController_service__WEBPACK_IMPORTED_MODULE_3__["DocumentControllerService"];
    });
    /* harmony import */


    var _geolocationController_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./geolocationController.service */
    "./src/app/shared/sdk/api/geolocationController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "GeolocationControllerService", function () {
      return _geolocationController_service__WEBPACK_IMPORTED_MODULE_4__["GeolocationControllerService"];
    });
    /* harmony import */


    var _healthCenterController_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./healthCenterController.service */
    "./src/app/shared/sdk/api/healthCenterController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "HealthCenterControllerService", function () {
      return _healthCenterController_service__WEBPACK_IMPORTED_MODULE_5__["HealthCenterControllerService"];
    });
    /* harmony import */


    var _leaveRequestController_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./leaveRequestController.service */
    "./src/app/shared/sdk/api/leaveRequestController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "LeaveRequestControllerService", function () {
      return _leaveRequestController_service__WEBPACK_IMPORTED_MODULE_6__["LeaveRequestControllerService"];
    });
    /* harmony import */


    var _patientController_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./patientController.service */
    "./src/app/shared/sdk/api/patientController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "PatientControllerService", function () {
      return _patientController_service__WEBPACK_IMPORTED_MODULE_7__["PatientControllerService"];
    });
    /* harmony import */


    var _pingController_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./pingController.service */
    "./src/app/shared/sdk/api/pingController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "PingControllerService", function () {
      return _pingController_service__WEBPACK_IMPORTED_MODULE_8__["PingControllerService"];
    });
    /* harmony import */


    var _policeOfficerController_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ./policeOfficerController.service */
    "./src/app/shared/sdk/api/policeOfficerController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "PoliceOfficerControllerService", function () {
      return _policeOfficerController_service__WEBPACK_IMPORTED_MODULE_9__["PoliceOfficerControllerService"];
    });
    /* harmony import */


    var _sanitarianController_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ./sanitarianController.service */
    "./src/app/shared/sdk/api/sanitarianController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "SanitarianControllerService", function () {
      return _sanitarianController_service__WEBPACK_IMPORTED_MODULE_10__["SanitarianControllerService"];
    });
    /* harmony import */


    var _testAppointmentController_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ./testAppointmentController.service */
    "./src/app/shared/sdk/api/testAppointmentController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "TestAppointmentControllerService", function () {
      return _testAppointmentController_service__WEBPACK_IMPORTED_MODULE_11__["TestAppointmentControllerService"];
    });
    /* harmony import */


    var _testQuestionController_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! ./testQuestionController.service */
    "./src/app/shared/sdk/api/testQuestionController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "TestQuestionControllerService", function () {
      return _testQuestionController_service__WEBPACK_IMPORTED_MODULE_12__["TestQuestionControllerService"];
    });
    /* harmony import */


    var _testResultController_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! ./testResultController.service */
    "./src/app/shared/sdk/api/testResultController.service.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "TestResultControllerService", function () {
      return _testResultController_service__WEBPACK_IMPORTED_MODULE_13__["TestResultControllerService"];
    });

    var APIS = [_authController_service__WEBPACK_IMPORTED_MODULE_1__["AuthControllerService"], _bluetoothLeAdvertisementController_service__WEBPACK_IMPORTED_MODULE_2__["BluetoothLeAdvertisementControllerService"], _documentController_service__WEBPACK_IMPORTED_MODULE_3__["DocumentControllerService"], _geolocationController_service__WEBPACK_IMPORTED_MODULE_4__["GeolocationControllerService"], _healthCenterController_service__WEBPACK_IMPORTED_MODULE_5__["HealthCenterControllerService"], _leaveRequestController_service__WEBPACK_IMPORTED_MODULE_6__["LeaveRequestControllerService"], _patientController_service__WEBPACK_IMPORTED_MODULE_7__["PatientControllerService"], _pingController_service__WEBPACK_IMPORTED_MODULE_8__["PingControllerService"], _policeOfficerController_service__WEBPACK_IMPORTED_MODULE_9__["PoliceOfficerControllerService"], _sanitarianController_service__WEBPACK_IMPORTED_MODULE_10__["SanitarianControllerService"], _testAppointmentController_service__WEBPACK_IMPORTED_MODULE_11__["TestAppointmentControllerService"], _testQuestionController_service__WEBPACK_IMPORTED_MODULE_12__["TestQuestionControllerService"], _testResultController_service__WEBPACK_IMPORTED_MODULE_13__["TestResultControllerService"]];
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/authController.service.ts":
  /*!**********************************************************!*\
    !*** ./src/app/shared/sdk/api/authController.service.ts ***!
    \**********************************************************/

  /*! exports provided: AuthControllerService */

  /***/
  function srcAppSharedSdkApiAuthControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthControllerService", function () {
      return AuthControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var AuthControllerService = /*#__PURE__*/function () {
      function AuthControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, AuthControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(AuthControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this2 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this2.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this2.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "authControllerPoliceOfficerLogin",
        value: function authControllerPoliceOfficerLogin(policeOfficerLogin) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/auth/police-officers"), policeOfficerLogin, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "authControllerSanitarianLogin",
        value: function authControllerSanitarianLogin(sanitarianLogin) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/auth/sanitarians"), sanitarianLogin, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return AuthControllerService;
    }();

    AuthControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    AuthControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], AuthControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/bluetoothLeAdvertisementController.service.ts":
  /*!******************************************************************************!*\
    !*** ./src/app/shared/sdk/api/bluetoothLeAdvertisementController.service.ts ***!
    \******************************************************************************/

  /*! exports provided: BluetoothLeAdvertisementControllerService */

  /***/
  function srcAppSharedSdkApiBluetoothLeAdvertisementControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "BluetoothLeAdvertisementControllerService", function () {
      return BluetoothLeAdvertisementControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var BluetoothLeAdvertisementControllerService = /*#__PURE__*/function () {
      function BluetoothLeAdvertisementControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, BluetoothLeAdvertisementControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(BluetoothLeAdvertisementControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this3 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this3.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this3.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "bluetoothLeAdvertisementControllerCount",
        value: function bluetoothLeAdvertisementControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/bluetooth-le-advertisements/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerCreate",
        value: function bluetoothLeAdvertisementControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/bluetooth-le-advertisements"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerDeleteById",
        value: function bluetoothLeAdvertisementControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/bluetooth-le-advertisements/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerFind",
        value: function bluetoothLeAdvertisementControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/bluetooth-le-advertisements"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerFindById",
        value: function bluetoothLeAdvertisementControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/bluetooth-le-advertisements/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerReplaceById",
        value: function bluetoothLeAdvertisementControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/bluetooth-le-advertisements/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerUpdateAll",
        value: function bluetoothLeAdvertisementControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/bluetooth-le-advertisements"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "bluetoothLeAdvertisementControllerUpdateById",
        value: function bluetoothLeAdvertisementControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling bluetoothLeAdvertisementControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/bluetooth-le-advertisements/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return BluetoothLeAdvertisementControllerService;
    }();

    BluetoothLeAdvertisementControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    BluetoothLeAdvertisementControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], BluetoothLeAdvertisementControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/documentController.service.ts":
  /*!**************************************************************!*\
    !*** ./src/app/shared/sdk/api/documentController.service.ts ***!
    \**************************************************************/

  /*! exports provided: DocumentControllerService */

  /***/
  function srcAppSharedSdkApiDocumentControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DocumentControllerService", function () {
      return DocumentControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var DocumentControllerService = /*#__PURE__*/function () {
      function DocumentControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, DocumentControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(DocumentControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this4 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this4.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this4.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "documentControllerCount",
        value: function documentControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/documents/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerCreate",
        value: function documentControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/documents"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerDeleteById",
        value: function documentControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling documentControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/documents/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerFind",
        value: function documentControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/documents"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerFindById",
        value: function documentControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling documentControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/documents/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerReplaceById",
        value: function documentControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling documentControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/documents/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerUpdateAll",
        value: function documentControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/documents"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "documentControllerUpdateById",
        value: function documentControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling documentControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/documents/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return DocumentControllerService;
    }();

    DocumentControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    DocumentControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], DocumentControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/geolocationController.service.ts":
  /*!*****************************************************************!*\
    !*** ./src/app/shared/sdk/api/geolocationController.service.ts ***!
    \*****************************************************************/

  /*! exports provided: GeolocationControllerService */

  /***/
  function srcAppSharedSdkApiGeolocationControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "GeolocationControllerService", function () {
      return GeolocationControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var GeolocationControllerService = /*#__PURE__*/function () {
      function GeolocationControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, GeolocationControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(GeolocationControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this5 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this5.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this5.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "geolocationControllerCount",
        value: function geolocationControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/geolocations/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerCreate",
        value: function geolocationControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/geolocations"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerDeleteById",
        value: function geolocationControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling geolocationControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/geolocations/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerFind",
        value: function geolocationControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/geolocations"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerFindById",
        value: function geolocationControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling geolocationControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/geolocations/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerReplaceById",
        value: function geolocationControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling geolocationControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/geolocations/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerUpdateAll",
        value: function geolocationControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/geolocations"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "geolocationControllerUpdateById",
        value: function geolocationControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling geolocationControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/geolocations/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return GeolocationControllerService;
    }();

    GeolocationControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    GeolocationControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], GeolocationControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/healthCenterController.service.ts":
  /*!******************************************************************!*\
    !*** ./src/app/shared/sdk/api/healthCenterController.service.ts ***!
    \******************************************************************/

  /*! exports provided: HealthCenterControllerService */

  /***/
  function srcAppSharedSdkApiHealthCenterControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HealthCenterControllerService", function () {
      return HealthCenterControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var HealthCenterControllerService = /*#__PURE__*/function () {
      function HealthCenterControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, HealthCenterControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(HealthCenterControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this6 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this6.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this6.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "healthCenterControllerCount",
        value: function healthCenterControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/health-centers/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerCreate",
        value: function healthCenterControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/health-centers"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerDeleteById",
        value: function healthCenterControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling healthCenterControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/health-centers/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerFind",
        value: function healthCenterControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/health-centers"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerFindById",
        value: function healthCenterControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling healthCenterControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/health-centers/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerReplaceById",
        value: function healthCenterControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling healthCenterControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/health-centers/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerUpdateAll",
        value: function healthCenterControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/health-centers"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "healthCenterControllerUpdateById",
        value: function healthCenterControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling healthCenterControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/health-centers/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return HealthCenterControllerService;
    }();

    HealthCenterControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    HealthCenterControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], HealthCenterControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/leaveRequestController.service.ts":
  /*!******************************************************************!*\
    !*** ./src/app/shared/sdk/api/leaveRequestController.service.ts ***!
    \******************************************************************/

  /*! exports provided: LeaveRequestControllerService */

  /***/
  function srcAppSharedSdkApiLeaveRequestControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LeaveRequestControllerService", function () {
      return LeaveRequestControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var LeaveRequestControllerService = /*#__PURE__*/function () {
      function LeaveRequestControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, LeaveRequestControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(LeaveRequestControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this7 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this7.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this7.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "leaveRequestControllerCount",
        value: function leaveRequestControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/leave-requests/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerCreate",
        value: function leaveRequestControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/leave-requests"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerDeleteById",
        value: function leaveRequestControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling leaveRequestControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/leave-requests/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerFind",
        value: function leaveRequestControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/leave-requests"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerFindById",
        value: function leaveRequestControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling leaveRequestControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/leave-requests/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerFindByToken",
        value: function leaveRequestControllerFindByToken(token) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling leaveRequestControllerFindByToken.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/leave-requests/token/").concat(encodeURIComponent(String(token))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerGetLeaveRequestsByPatientId",
        value: function leaveRequestControllerGetLeaveRequestsByPatientId(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling leaveRequestControllerGetLeaveRequestsByPatientId.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/patients/").concat(encodeURIComponent(String(id)), "/leaveRequests"), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerReplaceById",
        value: function leaveRequestControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling leaveRequestControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/leave-requests/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerSetAtHome",
        value: function leaveRequestControllerSetAtHome(token) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling leaveRequestControllerSetAtHome.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/leave-requests/token/").concat(encodeURIComponent(String(token)), "/set-at-home"), null, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerSetOutOfHome",
        value: function leaveRequestControllerSetOutOfHome(token) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling leaveRequestControllerSetOutOfHome.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/leave-requests/token/").concat(encodeURIComponent(String(token)), "/set-out-home"), null, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerUpdateAll",
        value: function leaveRequestControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/leave-requests"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "leaveRequestControllerUpdateById",
        value: function leaveRequestControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling leaveRequestControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/leave-requests/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return LeaveRequestControllerService;
    }();

    LeaveRequestControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    LeaveRequestControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], LeaveRequestControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/patientController.service.ts":
  /*!*************************************************************!*\
    !*** ./src/app/shared/sdk/api/patientController.service.ts ***!
    \*************************************************************/

  /*! exports provided: PatientControllerService */

  /***/
  function srcAppSharedSdkApiPatientControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientControllerService", function () {
      return PatientControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var PatientControllerService = /*#__PURE__*/function () {
      function PatientControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, PatientControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(PatientControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this8 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this8.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this8.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "patientControllerCount",
        value: function patientControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/patients/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerCreate",
        value: function patientControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/patients"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerDeleteById",
        value: function patientControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling patientControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/patients/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerFind",
        value: function patientControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/patients"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerFindById",
        value: function patientControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling patientControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/patients/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerGetByQrCode",
        value: function patientControllerGetByQrCode(qrcode) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (qrcode === null || qrcode === undefined) {
            throw new Error('Required parameter qrcode was null or undefined when calling patientControllerGetByQrCode.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/patients/scan/").concat(encodeURIComponent(String(qrcode))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerReplaceById",
        value: function patientControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling patientControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/patients/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerUpdateAll",
        value: function patientControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/patients"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerUpdateById",
        value: function patientControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling patientControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/patients/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerUpdateStatus",
        value: function patientControllerUpdateStatus(id, body) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling patientControllerUpdateStatus.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/patients/").concat(encodeURIComponent(String(id)), "/status"), body, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "patientControllerUpdateStatusByDocumentNumber",
        value: function patientControllerUpdateStatusByDocumentNumber(inlineObject) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/patients/status"), inlineObject, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return PatientControllerService;
    }();

    PatientControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    PatientControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], PatientControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/pingController.service.ts":
  /*!**********************************************************!*\
    !*** ./src/app/shared/sdk/api/pingController.service.ts ***!
    \**********************************************************/

  /*! exports provided: PingControllerService */

  /***/
  function srcAppSharedSdkApiPingControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PingControllerService", function () {
      return PingControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var PingControllerService = /*#__PURE__*/function () {
      function PingControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, PingControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(PingControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this9 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this9.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this9.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "pingControllerHeartbeat",
        value: function pingControllerHeartbeat() {
          var observe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
          var reportProgress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var options = arguments.length > 2 ? arguments[2] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/heartbeat"), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "pingControllerPing",
        value: function pingControllerPing() {
          var observe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
          var reportProgress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var options = arguments.length > 2 ? arguments[2] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/ping"), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return PingControllerService;
    }();

    PingControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    PingControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], PingControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/policeOfficerController.service.ts":
  /*!*******************************************************************!*\
    !*** ./src/app/shared/sdk/api/policeOfficerController.service.ts ***!
    \*******************************************************************/

  /*! exports provided: PoliceOfficerControllerService */

  /***/
  function srcAppSharedSdkApiPoliceOfficerControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PoliceOfficerControllerService", function () {
      return PoliceOfficerControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var PoliceOfficerControllerService = /*#__PURE__*/function () {
      function PoliceOfficerControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, PoliceOfficerControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(PoliceOfficerControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this10 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this10.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this10.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "policeOfficerControllerCount",
        value: function policeOfficerControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/police-officers/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerCreate",
        value: function policeOfficerControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/police-officers"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerDeleteById",
        value: function policeOfficerControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling policeOfficerControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/police-officers/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerFind",
        value: function policeOfficerControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/police-officers"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerFindById",
        value: function policeOfficerControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling policeOfficerControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/police-officers/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerReplaceById",
        value: function policeOfficerControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling policeOfficerControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/police-officers/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerUpdateAll",
        value: function policeOfficerControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/police-officers"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "policeOfficerControllerUpdateById",
        value: function policeOfficerControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling policeOfficerControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/police-officers/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return PoliceOfficerControllerService;
    }();

    PoliceOfficerControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    PoliceOfficerControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], PoliceOfficerControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/sanitarianController.service.ts":
  /*!****************************************************************!*\
    !*** ./src/app/shared/sdk/api/sanitarianController.service.ts ***!
    \****************************************************************/

  /*! exports provided: SanitarianControllerService */

  /***/
  function srcAppSharedSdkApiSanitarianControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SanitarianControllerService", function () {
      return SanitarianControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var SanitarianControllerService = /*#__PURE__*/function () {
      function SanitarianControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, SanitarianControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(SanitarianControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this11 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this11.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this11.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "sanitarianControllerCount",
        value: function sanitarianControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/sanitarians/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerCreate",
        value: function sanitarianControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/sanitarians"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerDeleteById",
        value: function sanitarianControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling sanitarianControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/sanitarians/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerFind",
        value: function sanitarianControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/sanitarians"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerFindById",
        value: function sanitarianControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling sanitarianControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/sanitarians/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerReplaceById",
        value: function sanitarianControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling sanitarianControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/sanitarians/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerUpdateAll",
        value: function sanitarianControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/sanitarians"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "sanitarianControllerUpdateById",
        value: function sanitarianControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling sanitarianControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/sanitarians/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return SanitarianControllerService;
    }();

    SanitarianControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    SanitarianControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], SanitarianControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/testAppointmentController.service.ts":
  /*!*********************************************************************!*\
    !*** ./src/app/shared/sdk/api/testAppointmentController.service.ts ***!
    \*********************************************************************/

  /*! exports provided: TestAppointmentControllerService */

  /***/
  function srcAppSharedSdkApiTestAppointmentControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TestAppointmentControllerService", function () {
      return TestAppointmentControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var TestAppointmentControllerService = /*#__PURE__*/function () {
      function TestAppointmentControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, TestAppointmentControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(TestAppointmentControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this12 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this12.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this12.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "testAppointmentControllerCount",
        value: function testAppointmentControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-appointments/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerCreate",
        value: function testAppointmentControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/test-appointments"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerDeleteById",
        value: function testAppointmentControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testAppointmentControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/test-appointments/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerFind",
        value: function testAppointmentControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-appointments"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerFindById",
        value: function testAppointmentControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testAppointmentControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-appointments/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerFindLatestByPatientId",
        value: function testAppointmentControllerFindLatestByPatientId(patientId) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (patientId === null || patientId === undefined) {
            throw new Error('Required parameter patientId was null or undefined when calling testAppointmentControllerFindLatestByPatientId.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-appointments/patient-id/").concat(encodeURIComponent(String(patientId))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerReplaceById",
        value: function testAppointmentControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testAppointmentControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/test-appointments/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerUpdateAll",
        value: function testAppointmentControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/test-appointments"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testAppointmentControllerUpdateById",
        value: function testAppointmentControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testAppointmentControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/test-appointments/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return TestAppointmentControllerService;
    }();

    TestAppointmentControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    TestAppointmentControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], TestAppointmentControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/testQuestionController.service.ts":
  /*!******************************************************************!*\
    !*** ./src/app/shared/sdk/api/testQuestionController.service.ts ***!
    \******************************************************************/

  /*! exports provided: TestQuestionControllerService */

  /***/
  function srcAppSharedSdkApiTestQuestionControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TestQuestionControllerService", function () {
      return TestQuestionControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var TestQuestionControllerService = /*#__PURE__*/function () {
      function TestQuestionControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, TestQuestionControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(TestQuestionControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this13 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this13.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this13.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "testQuestionControllerCount",
        value: function testQuestionControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-questions/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerCreate",
        value: function testQuestionControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/test-questions"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerDeleteById",
        value: function testQuestionControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testQuestionControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/test-questions/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerFind",
        value: function testQuestionControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-questions"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerFindById",
        value: function testQuestionControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testQuestionControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-questions/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerFindByQuestionId",
        value: function testQuestionControllerFindByQuestionId(questionId) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (questionId === null || questionId === undefined) {
            throw new Error('Required parameter questionId was null or undefined when calling testQuestionControllerFindByQuestionId.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-questions/question-id/").concat(encodeURIComponent(String(questionId))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerReplaceById",
        value: function testQuestionControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testQuestionControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/test-questions/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerUpdateAll",
        value: function testQuestionControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/test-questions"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testQuestionControllerUpdateById",
        value: function testQuestionControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testQuestionControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/test-questions/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return TestQuestionControllerService;
    }();

    TestQuestionControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    TestQuestionControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], TestQuestionControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/testResultController.service.ts":
  /*!****************************************************************!*\
    !*** ./src/app/shared/sdk/api/testResultController.service.ts ***!
    \****************************************************************/

  /*! exports provided: TestResultControllerService */

  /***/
  function srcAppSharedSdkApiTestResultControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TestResultControllerService", function () {
      return TestResultControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * coronavirus-server - coronavirus-server
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var TestResultControllerService = /*#__PURE__*/function () {
      function TestResultControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, TestResultControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(TestResultControllerService, [{
        key: "addToHttpParams",
        value: function addToHttpParams(httpParams, value, key) {
          if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
          } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
          }

          return httpParams;
        }
      }, {
        key: "addToHttpParamsRecursive",
        value: function addToHttpParamsRecursive(httpParams, value, key) {
          var _this14 = this;

          if (value == null) {
            return httpParams;
          }

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              value.forEach(function (elem) {
                return httpParams = _this14.addToHttpParamsRecursive(httpParams, elem, key);
              });
            } else if (value instanceof Date) {
              if (key != null) {
                httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
              } else {
                throw Error("key may not be null if value is Date");
              }
            } else {
              Object.keys(value).forEach(function (k) {
                return httpParams = _this14.addToHttpParamsRecursive(httpParams, value[k], key != null ? "".concat(key, ".").concat(k) : k);
              });
            }
          } else if (key != null) {
            httpParams = httpParams.append(key, value);
          } else {
            throw Error("key may not be null if value is not object or array");
          }

          return httpParams;
        }
      }, {
        key: "testResultControllerCount",
        value: function testResultControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-results/count"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerCreate",
        value: function testResultControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/test-results"), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerDeleteById",
        value: function testResultControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testResultControllerDeleteById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/test-results/").concat(encodeURIComponent(String(id))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerFind",
        value: function testResultControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-results"), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerFindById",
        value: function testResultControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testResultControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = this.addToHttpParams(queryParameters, filter, 'filter');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-results/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerFindLatestByPatientId",
        value: function testResultControllerFindLatestByPatientId(patientId) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var options = arguments.length > 3 ? arguments[3] : undefined;

          if (patientId === null || patientId === undefined) {
            throw new Error('Required parameter patientId was null or undefined when calling testResultControllerFindLatestByPatientId.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/test-results/patient-id/").concat(encodeURIComponent(String(patientId))), {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerReplaceById",
        value: function testResultControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testResultControllerReplaceById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/test-results/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerUpdateAll",
        value: function testResultControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = this.addToHttpParams(queryParameters, where, 'where');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = ['application/json'];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/test-results"), requestBody, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "testResultControllerUpdateById",
        value: function testResultControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var options = arguments.length > 4 ? arguments[4] : undefined;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling testResultControllerUpdateById.');
          }

          var headers = this.defaultHeaders;
          var httpHeaderAcceptSelected = options && options.httpHeaderAccept;

          if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            var httpHeaderAccepts = [];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          }

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          var responseType = 'json';

          if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/test-results/").concat(encodeURIComponent(String(id))), requestBody, {
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return TestResultControllerService;
    }();

    TestResultControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    TestResultControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], TestResultControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/api/userController.service.ts":
  /*!**********************************************************!*\
    !*** ./src/app/shared/sdk/api/userController.service.ts ***!
    \**********************************************************/

  /*! exports provided: UserControllerService */

  /***/
  function srcAppSharedSdkApiUserControllerServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "UserControllerService", function () {
      return UserControllerService;
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


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../encoder */
    "./src/app/shared/sdk/encoder.ts");
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../configuration */
    "./src/app/shared/sdk/configuration.ts");
    /**
     * LoopBack Application
     * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
     *
     * The version of the OpenAPI document: 1.0.0
     *
     *
     * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
     * https://openapi-generator.tech
     * Do not edit the class manually.
     */

    /* tslint:disable:no-unused-variable member-ordering */


    var UserControllerService = /*#__PURE__*/function () {
      function UserControllerService(httpClient, basePath, configuration) {
        _classCallCheck(this, UserControllerService);

        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        this.configuration = new _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]();

        if (configuration) {
          this.configuration = configuration;
        }

        if (typeof this.configuration.basePath !== 'string') {
          if (typeof basePath !== 'string') {
            basePath = this.basePath;
          }

          this.configuration.basePath = basePath;
        }

        this.encoder = this.configuration.encoder || new _encoder__WEBPACK_IMPORTED_MODULE_3__["CustomHttpParameterCodec"]();
      }

      _createClass(UserControllerService, [{
        key: "userControllerCount",
        value: function userControllerCount(where) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = queryParameters.set('where', where);
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = ['application/json'];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/users/count"), {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerCreate",
        value: function userControllerCreate(requestBody) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = ['application/json'];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          return this.httpClient.post("".concat(this.configuration.basePath, "/user"), requestBody, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerDeleteById",
        value: function userControllerDeleteById(id) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling patientControllerDeleteById.');
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = [];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          return this.httpClient["delete"]("".concat(this.configuration.basePath, "/users/").concat(encodeURIComponent(String(id))), {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerFind",
        value: function userControllerFind(filter) {
          var observe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
          var reportProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = queryParameters.set('filter', filter);
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = ['application/json'];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/user"), {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerFindById",
        value: function userControllerFindById(id, filter) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling userControllerFindById.');
          }

          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (filter !== undefined && filter !== null) {
            queryParameters = queryParameters.set('filter', filter);
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = ['application/json'];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          }

          return this.httpClient.get("".concat(this.configuration.basePath, "/users/").concat(encodeURIComponent(String(id))), {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerReplaceById",
        value: function userControllerReplaceById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling userControllerReplaceById.');
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = [];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          return this.httpClient.put("".concat(this.configuration.basePath, "/users/").concat(encodeURIComponent(String(id))), requestBody, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerUpdateAll",
        value: function userControllerUpdateAll(where, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            encoder: this.encoder
          });

          if (where !== undefined && where !== null) {
            queryParameters = queryParameters.set('where', where);
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = ['application/json'];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/patients"), requestBody, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }, {
        key: "userControllerUpdateById",
        value: function userControllerUpdateById(id, requestBody) {
          var observe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
          var reportProgress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

          if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling userControllerUpdateById.');
          }

          var headers = this.defaultHeaders; // to determine the Accept header

          var httpHeaderAccepts = [];
          var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);

          if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
          } // to determine the Content-Type header


          var consumes = ['application/json'];
          var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);

          if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
          }

          return this.httpClient.patch("".concat(this.configuration.basePath, "/users/").concat(encodeURIComponent(String(id))), requestBody, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
          });
        }
      }]);

      return UserControllerService;
    }();

    UserControllerService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: String,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: [_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"]]
        }]
      }, {
        type: _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"],
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"]
        }]
      }];
    };

    UserControllerService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_variables__WEBPACK_IMPORTED_MODULE_4__["BASE_PATH"])), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], String, _configuration__WEBPACK_IMPORTED_MODULE_5__["Configuration"]])], UserControllerService);
    /***/
  },

  /***/
  "./src/app/shared/sdk/configuration.ts":
  /*!*********************************************!*\
    !*** ./src/app/shared/sdk/configuration.ts ***!
    \*********************************************/

  /*! exports provided: Configuration */

  /***/
  function srcAppSharedSdkConfigurationTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "Configuration", function () {
      return Configuration;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");

    var Configuration = /*#__PURE__*/function () {
      function Configuration() {
        var configurationParameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Configuration);

        this.apiKeys = configurationParameters.apiKeys;
        this.username = configurationParameters.username;
        this.password = configurationParameters.password;
        this.accessToken = configurationParameters.accessToken;
        this.basePath = configurationParameters.basePath;
        this.withCredentials = configurationParameters.withCredentials;
        this.encoder = configurationParameters.encoder;
      }
      /**
       * Select the correct content-type to use for a request.
       * Uses {@link Configuration#isJsonMime} to determine the correct content-type.
       * If no content type is found return the first found type if the contentTypes is not empty
       * @param contentTypes - the array of content types that are available for selection
       * @returns the selected content-type or <code>undefined</code> if no selection could be made.
       */


      _createClass(Configuration, [{
        key: "selectHeaderContentType",
        value: function selectHeaderContentType(contentTypes) {
          var _this15 = this;

          if (contentTypes.length === 0) {
            return undefined;
          }

          var type = contentTypes.find(function (x) {
            return _this15.isJsonMime(x);
          });

          if (type === undefined) {
            return contentTypes[0];
          }

          return type;
        }
        /**
         * Select the correct accept content-type to use for a request.
         * Uses {@link Configuration#isJsonMime} to determine the correct accept content-type.
         * If no content type is found return the first found type if the contentTypes is not empty
         * @param accepts - the array of content types that are available for selection.
         * @returns the selected content-type or <code>undefined</code> if no selection could be made.
         */

      }, {
        key: "selectHeaderAccept",
        value: function selectHeaderAccept(accepts) {
          var _this16 = this;

          if (accepts.length === 0) {
            return undefined;
          }

          var type = accepts.find(function (x) {
            return _this16.isJsonMime(x);
          });

          if (type === undefined) {
            return accepts[0];
          }

          return type;
        }
        /**
         * Check if the given MIME is a JSON MIME.
         * JSON MIME examples:
         *   application/json
         *   application/json; charset=UTF8
         *   APPLICATION/JSON
         *   application/vnd.company+json
         * @param mime - MIME (Multipurpose Internet Mail Extensions)
         * @return True if the given MIME is JSON, false otherwise.
         */

      }, {
        key: "isJsonMime",
        value: function isJsonMime(mime) {
          var jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
          return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
        }
      }]);

      return Configuration;
    }();
    /***/

  },

  /***/
  "./src/app/shared/sdk/encoder.ts":
  /*!***************************************!*\
    !*** ./src/app/shared/sdk/encoder.ts ***!
    \***************************************/

  /*! exports provided: CustomHttpParameterCodec */

  /***/
  function srcAppSharedSdkEncoderTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "CustomHttpParameterCodec", function () {
      return CustomHttpParameterCodec;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /**
     * Custom HttpParameterCodec
     * Workaround for https://github.com/angular/angular/issues/18261
     */


    var CustomHttpParameterCodec = /*#__PURE__*/function () {
      function CustomHttpParameterCodec() {
        _classCallCheck(this, CustomHttpParameterCodec);
      }

      _createClass(CustomHttpParameterCodec, [{
        key: "encodeKey",
        value: function encodeKey(k) {
          return encodeURIComponent(k);
        }
      }, {
        key: "encodeValue",
        value: function encodeValue(v) {
          return encodeURIComponent(v);
        }
      }, {
        key: "decodeKey",
        value: function decodeKey(k) {
          return decodeURIComponent(k);
        }
      }, {
        key: "decodeValue",
        value: function decodeValue(v) {
          return decodeURIComponent(v);
        }
      }]);

      return CustomHttpParameterCodec;
    }();
    /***/

  },

  /***/
  "./src/app/shared/sdk/index.ts":
  /*!*************************************!*\
    !*** ./src/app/shared/sdk/index.ts ***!
    \*************************************/

  /*! exports provided: BASE_PATH, COLLECTION_FORMATS, Configuration, AuthControllerService, PoliceOfficerControllerService, APIS, ApiModule, BluetoothLeAdvertisementControllerService, DocumentControllerService, GeolocationControllerService, HealthCenterControllerService, LeaveRequestControllerService, PatientControllerService, PingControllerService, SanitarianControllerService, TestAppointmentControllerService, TestQuestionControllerService, TestResultControllerService */

  /***/
  function srcAppSharedSdkIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _api_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./api/api */
    "./src/app/shared/sdk/api/api.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "AuthControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["AuthControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "PoliceOfficerControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["PoliceOfficerControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "APIS", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["APIS"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "BluetoothLeAdvertisementControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["BluetoothLeAdvertisementControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "DocumentControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["DocumentControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "GeolocationControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["GeolocationControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "HealthCenterControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["HealthCenterControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "LeaveRequestControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["LeaveRequestControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "PatientControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["PatientControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "PingControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["PingControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "SanitarianControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["SanitarianControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "TestAppointmentControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["TestAppointmentControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "TestQuestionControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["TestQuestionControllerService"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "TestResultControllerService", function () {
      return _api_api__WEBPACK_IMPORTED_MODULE_1__["TestResultControllerService"];
    });
    /* harmony import */


    var _variables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./variables */
    "./src/app/shared/sdk/variables.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "BASE_PATH", function () {
      return _variables__WEBPACK_IMPORTED_MODULE_2__["BASE_PATH"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "COLLECTION_FORMATS", function () {
      return _variables__WEBPACK_IMPORTED_MODULE_2__["COLLECTION_FORMATS"];
    });
    /* harmony import */


    var _configuration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./configuration */
    "./src/app/shared/sdk/configuration.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "Configuration", function () {
      return _configuration__WEBPACK_IMPORTED_MODULE_3__["Configuration"];
    });
    /* harmony import */


    var _api_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./api.module */
    "./src/app/shared/sdk/api.module.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "ApiModule", function () {
      return _api_module__WEBPACK_IMPORTED_MODULE_4__["ApiModule"];
    });
    /***/

  },

  /***/
  "./src/app/shared/sdk/variables.ts":
  /*!*****************************************!*\
    !*** ./src/app/shared/sdk/variables.ts ***!
    \*****************************************/

  /*! exports provided: BASE_PATH, COLLECTION_FORMATS */

  /***/
  function srcAppSharedSdkVariablesTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "BASE_PATH", function () {
      return BASE_PATH;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "COLLECTION_FORMATS", function () {
      return COLLECTION_FORMATS;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");

    var BASE_PATH = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["InjectionToken"]('basePath');
    var COLLECTION_FORMATS = {
      'csv': ',',
      'tsv': '   ',
      'ssv': ' ',
      'pipes': '|'
    };
    /***/
  },

  /***/
  "./src/app/shared/sdkconfiguration.provider.ts":
  /*!*****************************************************!*\
    !*** ./src/app/shared/sdkconfiguration.provider.ts ***!
    \*****************************************************/

  /*! exports provided: sdkConfigurationProvider */

  /***/
  function srcAppSharedSdkconfigurationProviderTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "sdkConfigurationProvider", function () {
      return sdkConfigurationProvider;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./sdk */
    "./src/app/shared/sdk/index.ts");

    var sdkConfigurationFactory = function sdkConfigurationFactory(environment) {
      var returnValue = new _sdk__WEBPACK_IMPORTED_MODULE_1__["Configuration"]();
      returnValue.basePath = environment.apiBasePath;
      return returnValue;
    };

    var sdkConfigurationProvider = {
      provide: _sdk__WEBPACK_IMPORTED_MODULE_1__["Configuration"],
      useFactory: sdkConfigurationFactory,
      deps: ['environment']
    };
    /***/
  },

  /***/
  "./src/app/shared/services/user.service.ts":
  /*!*************************************************!*\
    !*** ./src/app/shared/services/user.service.ts ***!
    \*************************************************/

  /*! exports provided: UserService */

  /***/
  function srcAppSharedServicesUserServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "UserService", function () {
      return UserService;
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


    var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @ionic-native/native-storage/ngx */
    "./node_modules/@ionic-native/native-storage/ngx/index.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
    /* harmony import */


    var _sdk_api_userController_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../sdk/api/userController.service */
    "./src/app/shared/sdk/api/userController.service.ts");
    /* harmony import */


    var _sdk_api_authController_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../sdk/api/authController.service */
    "./src/app/shared/sdk/api/authController.service.ts");
    /* harmony import */


    var _sdk_api_policeOfficerController_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ../sdk/api/policeOfficerController.service */
    "./src/app/shared/sdk/api/policeOfficerController.service.ts");

    var UserService_1;

    var UserService = UserService_1 = /*#__PURE__*/function () {
      function UserService(authController, policeController, userController, environment, router, platform, nativeStorage) {
        var _this17 = this;

        _classCallCheck(this, UserService);

        this.authController = authController;
        this.policeController = policeController;
        this.userController = userController;
        this.environment = environment;
        this.router = router;
        this.platform = platform;
        this.nativeStorage = nativeStorage;
        this.userToken = null;
        this._user = null;
        this.userLoaded$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](false);
        platform.ready().then(function () {
          if (_this17.environment.production) {
            _this17.nativeStorage.getItem(UserService_1.USER_TOKEN_KEY).then(function (data) {
              _this17.loadUser(data);
            });
          } else {
            _this17.loadUser('1');
          }
        });
      }

      _createClass(UserService, [{
        key: "loadUser",
        value: function loadUser(userToken) {
          var _this18 = this;

          this.setUserToken(userToken).subscribe(function (success) {
            if (success) {
              _this18.userLoaded$.next(true);
            } else {
              _this18.router.navigate(['/login']);
            }
          });
        }
      }, {
        key: "setUserToken",
        value: function setUserToken(userToken) {
          var _this19 = this;

          var returnValue = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
          this.policeController.policeOfficerControllerFindById(userToken).subscribe(function (user) {
            if (user != null) {
              _this19._user = user;
              _this19.userToken = userToken;
              returnValue.next(true);
            } else {
              returnValue.next(false);
            }
          });
          return returnValue;
        }
      }, {
        key: "login",
        value: function login(userCredentials) {
          var _this20 = this;

          var returnValue = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
          this.authController.authControllerPoliceOfficerLogin({
            uniqueId: userCredentials.uniqueId,
            password: userCredentials.password
          }).subscribe(function (res) {
            if (res) {
              _this20.loadUser(res.id);

              _this20.nativeStorage.setItem(UserService_1.USER_TOKEN_KEY, res.id).then(function (result) {});

              returnValue.next(res);
            } else {
              returnValue.next(false);
            }
          }, function (err) {
            returnValue.next(false);
          });
          return returnValue;
        }
      }, {
        key: "user",
        get: function get() {
          return this._user;
        },
        set: function set(value) {
          this._user = value;
        }
      }]);

      return UserService;
    }();

    UserService.USER_TOKEN_KEY = 'userToken';

    UserService.ctorParameters = function () {
      return [{
        type: _sdk_api_authController_service__WEBPACK_IMPORTED_MODULE_7__["AuthControllerService"]
      }, {
        type: _sdk_api_policeOfficerController_service__WEBPACK_IMPORTED_MODULE_8__["PoliceOfficerControllerService"]
      }, {
        type: _sdk_api_userController_service__WEBPACK_IMPORTED_MODULE_6__["UserControllerService"]
      }, {
        type: undefined,
        decorators: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
          args: ['environment']
        }]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]
      }, {
        type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["Platform"]
      }, {
        type: _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__["NativeStorage"]
      }];
    };

    UserService = UserService_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](3, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])('environment')), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_sdk_api_authController_service__WEBPACK_IMPORTED_MODULE_7__["AuthControllerService"], _sdk_api_policeOfficerController_service__WEBPACK_IMPORTED_MODULE_8__["PoliceOfficerControllerService"], _sdk_api_userController_service__WEBPACK_IMPORTED_MODULE_6__["UserControllerService"], Object, _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["Platform"], _ionic_native_native_storage_ngx__WEBPACK_IMPORTED_MODULE_3__["NativeStorage"]])], UserService);
    /***/
  },

  /***/
  "./src/environments/environment.ts":
  /*!*****************************************!*\
    !*** ./src/environments/environment.ts ***!
    \*****************************************/

  /*! exports provided: environment */

  /***/
  function srcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js"); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.


    var environment = {
      production: false,
      apiBasePath: 'http://localhost:3000'
    };
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "./src/main.ts":
  /*!*********************!*\
    !*** ./src/main.ts ***!
    \*********************/

  /*! no exports provided */

  /***/
  function srcMainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/platform-browser-dynamic */
    "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
    /* harmony import */


    var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./app/app.module */
    "./src/app/app.module.ts");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./environments/environment */
    "./src/environments/environment.ts");

    if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
    }

    Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])["catch"](function (err) {
      return console.log(err);
    });
    /***/
  },

  /***/
  0:
  /*!***************************!*\
    !*** multi ./src/main.ts ***!
    \***************************/

  /*! no static exports found */

  /***/
  function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! /Users/ordas/www/coronavirus-app-real/app-health/src/main.ts */
    "./src/main.ts");
    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map