function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[63], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-spinner.entry.js":
  /*!****************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-spinner.entry.js ***!
    \****************************************************************/

  /*! exports provided: ion_spinner */

  /***/
  function node_modulesIonicCoreDistEsmIonSpinnerEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_spinner", function () {
      return Spinner;
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


    var _theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./theme-18cbe2cc.js */
    "./node_modules/@ionic/core/dist/esm/theme-18cbe2cc.js");
    /* harmony import */


    var _spinner_configs_28520d80_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./spinner-configs-28520d80.js */
    "./node_modules/@ionic/core/dist/esm/spinner-configs-28520d80.js");

    var Spinner = /*#__PURE__*/function () {
      function Spinner(hostRef) {
        _classCallCheck(this, Spinner);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        /**
         * If `true`, the spinner's animation will be paused.
         */

        this.paused = false;
      }

      _createClass(Spinner, [{
        key: "getName",
        value: function getName() {
          var spinnerName = this.name || _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].get('spinner');

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);

          if (spinnerName) {
            return spinnerName;
          }

          return mode === 'ios' ? 'lines' : 'circular';
        }
      }, {
        key: "render",
        value: function render() {
          var _Object$assign;

          var self = this;
          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(self);
          var spinnerName = self.getName();
          var spinner = _spinner_configs_28520d80_js__WEBPACK_IMPORTED_MODULE_3__["S"][spinnerName] || _spinner_configs_28520d80_js__WEBPACK_IMPORTED_MODULE_3__["S"]['lines'];
          var duration = typeof self.duration === 'number' && self.duration > 10 ? self.duration : spinner.dur;
          var svgs = [];

          if (spinner.circles !== undefined) {
            for (var i = 0; i < spinner.circles; i++) {
              svgs.push(buildCircle(spinner, duration, i, spinner.circles));
            }
          } else if (spinner.lines !== undefined) {
            for (var _i = 0; _i < spinner.lines; _i++) {
              svgs.push(buildLine(spinner, duration, _i, spinner.lines));
            }
          }

          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": Object.assign(Object.assign({}, Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_2__["c"])(self.color)), (_Object$assign = {}, _defineProperty(_Object$assign, mode, true), _defineProperty(_Object$assign, "spinner-".concat(spinnerName), true), _defineProperty(_Object$assign, 'spinner-paused', !!self.paused || _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('_testing')), _Object$assign)),
            role: "progressbar",
            style: spinner.elmDuration ? {
              animationDuration: duration + 'ms'
            } : {}
          }, svgs);
        }
      }], [{
        key: "style",
        get: function get() {
          return ":host{display:inline-block;position:relative;width:28px;height:28px;color:var(--color);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host(.ion-color){color:var(--ion-color-base)}svg{left:0;top:0;-webkit-transform-origin:center;transform-origin:center;position:absolute;width:100%;height:100%;-webkit-transform:translateZ(0);transform:translateZ(0)}:host-context([dir=rtl]) svg,[dir=rtl] svg{left:unset;right:unset;right:0;-webkit-transform-origin:calc(100% - center);transform-origin:calc(100% - center)}:host(.spinner-lines) line,:host(.spinner-lines-small) line{stroke-width:4px;stroke-linecap:round;stroke:currentColor}:host(.spinner-lines) svg,:host(.spinner-lines-small) svg{-webkit-animation:spinner-fade-out 1s linear infinite;animation:spinner-fade-out 1s linear infinite}:host(.spinner-bubbles) svg{-webkit-animation:spinner-scale-out 1s linear infinite;animation:spinner-scale-out 1s linear infinite;fill:currentColor}:host(.spinner-circles) svg{-webkit-animation:spinner-fade-out 1s linear infinite;animation:spinner-fade-out 1s linear infinite;fill:currentColor}:host(.spinner-crescent) circle{fill:transparent;stroke-width:4px;stroke-dasharray:128px;stroke-dashoffset:82px;stroke:currentColor}:host(.spinner-crescent) svg{-webkit-animation:spinner-rotate 1s linear infinite;animation:spinner-rotate 1s linear infinite}:host(.spinner-dots) circle{stroke-width:0;fill:currentColor}:host(.spinner-dots) svg{-webkit-animation:spinner-dots 1s linear infinite;animation:spinner-dots 1s linear infinite}:host(.spinner-circular){-webkit-animation:spinner-circular linear infinite;animation:spinner-circular linear infinite}:host(.spinner-circular) circle{-webkit-animation:spinner-circular-inner ease-in-out infinite;animation:spinner-circular-inner ease-in-out infinite;stroke:currentColor;stroke-dasharray:80px,200px;stroke-dashoffset:0px;stroke-width:5.6;fill:none}:host(.spinner-paused),:host(.spinner-paused) circle,:host(.spinner-paused) svg{-webkit-animation-play-state:paused;animation-play-state:paused}\@-webkit-keyframes spinner-fade-out{0%{opacity:1}to{opacity:0}}\@keyframes spinner-fade-out{0%{opacity:1}to{opacity:0}}\@-webkit-keyframes spinner-scale-out{0%{-webkit-transform:scale(1);transform:scale(1)}to{-webkit-transform:scale(0);transform:scale(0)}}\@keyframes spinner-scale-out{0%{-webkit-transform:scale(1);transform:scale(1)}to{-webkit-transform:scale(0);transform:scale(0)}}\@-webkit-keyframes spinner-rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}\@keyframes spinner-rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}\@-webkit-keyframes spinner-dots{0%{-webkit-transform:scale(1);transform:scale(1);opacity:.9}50%{-webkit-transform:scale(.4);transform:scale(.4);opacity:.3}to{-webkit-transform:scale(1);transform:scale(1);opacity:.9}}\@keyframes spinner-dots{0%{-webkit-transform:scale(1);transform:scale(1);opacity:.9}50%{-webkit-transform:scale(.4);transform:scale(.4);opacity:.3}to{-webkit-transform:scale(1);transform:scale(1);opacity:.9}}\@-webkit-keyframes spinner-circular{to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}\@keyframes spinner-circular{to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}\@-webkit-keyframes spinner-circular-inner{0%{stroke-dasharray:1px,200px;stroke-dashoffset:0px}50%{stroke-dasharray:100px,200px;stroke-dashoffset:-15px}to{stroke-dasharray:100px,200px;stroke-dashoffset:-125px}}\@keyframes spinner-circular-inner{0%{stroke-dasharray:1px,200px;stroke-dashoffset:0px}50%{stroke-dasharray:100px,200px;stroke-dashoffset:-15px}to{stroke-dasharray:100px,200px;stroke-dashoffset:-125px}}";
        }
      }]);

      return Spinner;
    }();

    var buildCircle = function buildCircle(spinner, duration, index, total) {
      var data = spinner.fn(duration, index, total);
      data.style['animation-duration'] = duration + 'ms';
      return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("svg", {
        viewBox: data.viewBox || '0 0 64 64',
        style: data.style
      }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("circle", {
        transform: data.transform || 'translate(32,32)',
        cx: data.cx,
        cy: data.cy,
        r: data.r,
        style: spinner.elmDuration ? {
          animationDuration: duration + 'ms'
        } : {}
      }));
    };

    var buildLine = function buildLine(spinner, duration, index, total) {
      var data = spinner.fn(duration, index, total);
      data.style['animation-duration'] = duration + 'ms';
      return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("svg", {
        viewBox: data.viewBox || '0 0 64 64',
        style: data.style
      }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("line", {
        transform: "translate(32,32)",
        y1: data.y1,
        y2: data.y2
      }));
    };
    /***/

  }
}]);
//# sourceMappingURL=63-es5.js.map