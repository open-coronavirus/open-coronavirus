function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-backdrop-ios.entry.js":
  /*!*********************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-backdrop-ios.entry.js ***!
    \*********************************************************************/

  /*! exports provided: ion_backdrop */

  /***/
  function node_modulesIonicCoreDistEsmIonBackdropIosEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_backdrop", function () {
      return Backdrop;
    });
    /* harmony import */


    var _core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./core-0a8d4d2e.js */
    "./node_modules/@ionic/core/dist/esm/core-0a8d4d2e.js");
    /* harmony import */


    var _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./config-3c7f3790.js */
    "./node_modules/@ionic/core/dist/esm/config-3c7f3790.js");
    /* harmony import */


    var _helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./helpers-46f4a262.js */
    "./node_modules/@ionic/core/dist/esm/helpers-46f4a262.js");
    /* harmony import */


    var _index_c38df685_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./index-c38df685.js */
    "./node_modules/@ionic/core/dist/esm/index-c38df685.js");

    var Backdrop = /*#__PURE__*/function () {
      function Backdrop(hostRef) {
        _classCallCheck(this, Backdrop);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.lastClick = -10000;
        this.blocker = _index_c38df685_js__WEBPACK_IMPORTED_MODULE_3__["GESTURE_CONTROLLER"].createBlocker({
          disableScroll: true
        });
        /**
         * If `true`, the backdrop will be visible.
         */

        this.visible = true;
        /**
         * If `true`, the backdrop will can be clicked and will emit the `ionBackdropTap` event.
         */

        this.tappable = true;
        /**
         * If `true`, the backdrop will stop propagation on tap.
         */

        this.stopPropagation = true;
        this.ionBackdropTap = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionBackdropTap", 7);
      }

      _createClass(Backdrop, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          if (this.stopPropagation) {
            this.blocker.block();
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          this.blocker.unblock();
        }
      }, {
        key: "onTouchStart",
        value: function onTouchStart(ev) {
          this.lastClick = Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["n"])(ev);
          this.emitTap(ev);
        }
      }, {
        key: "onMouseDown",
        value: function onMouseDown(ev) {
          if (this.lastClick < Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["n"])(ev) - 2500) {
            this.emitTap(ev);
          }
        }
      }, {
        key: "emitTap",
        value: function emitTap(ev) {
          if (this.stopPropagation) {
            ev.preventDefault();
            ev.stopPropagation();
          }

          if (this.tappable) {
            this.ionBackdropTap.emit();
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _class;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            tabindex: "-1",
            "class": (_class = {}, _defineProperty(_class, mode, true), _defineProperty(_class, 'backdrop-hide', !this.visible), _defineProperty(_class, 'backdrop-no-tappable', !this.tappable), _class)
          });
        }
      }], [{
        key: "style",
        get: function get() {
          return ":host{left:0;right:0;top:0;bottom:0;display:block;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);contain:strict;cursor:pointer;opacity:.01;-ms-touch-action:none;touch-action:none;z-index:2}:host(.backdrop-hide){background:transparent}:host(.backdrop-no-tappable){cursor:auto}:host{background-color:var(--ion-backdrop-color,#000)}";
        }
      }]);

      return Backdrop;
    }();
    /***/

  }
}]);
//# sourceMappingURL=10-es5.js.map