function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[72], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-toast-ios.entry.js":
  /*!******************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-toast-ios.entry.js ***!
    \******************************************************************/

  /*! exports provided: ion_toast */

  /***/
  function node_modulesIonicCoreDistEsmIonToastIosEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_toast", function () {
      return Toast;
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


    var _animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./animation-56279521.js */
    "./node_modules/@ionic/core/dist/esm/animation-56279521.js");
    /* harmony import */


    var _hardware_back_button_1ed0083a_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./hardware-back-button-1ed0083a.js */
    "./node_modules/@ionic/core/dist/esm/hardware-back-button-1ed0083a.js");
    /* harmony import */


    var _overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./overlays-e336664a.js */
    "./node_modules/@ionic/core/dist/esm/overlays-e336664a.js");
    /* harmony import */


    var _theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./theme-18cbe2cc.js */
    "./node_modules/@ionic/core/dist/esm/theme-18cbe2cc.js");
    /* harmony import */


    var _index_3476b023_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./index-3476b023.js */
    "./node_modules/@ionic/core/dist/esm/index-3476b023.js");
    /**
     * iOS Toast Enter Animation
     */


    var iosEnterAnimation = function iosEnterAnimation(baseEl, position) {
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var hostEl = baseEl.host || baseEl;
      var wrapperEl = baseEl.querySelector('.toast-wrapper');
      var bottom = "calc(-10px - var(--ion-safe-area-bottom, 0px))";
      var top = "calc(10px + var(--ion-safe-area-top, 0px))";
      wrapperAnimation.addElement(wrapperEl);

      switch (position) {
        case 'top':
          wrapperAnimation.fromTo('transform', 'translateY(-100%)', "translateY(".concat(top, ")"));
          break;

        case 'middle':
          var topPosition = Math.floor(hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
          wrapperEl.style.top = "".concat(topPosition, "px");
          wrapperAnimation.fromTo('opacity', 0.01, 1);
          break;

        default:
          wrapperAnimation.fromTo('transform', 'translateY(100%)', "translateY(".concat(bottom, ")"));
          break;
      }

      return baseAnimation.addElement(hostEl).easing('cubic-bezier(.155,1.105,.295,1.12)').duration(400).addAnimation(wrapperAnimation);
    };
    /**
     * iOS Toast Leave Animation
     */


    var iosLeaveAnimation = function iosLeaveAnimation(baseEl, position) {
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var hostEl = baseEl.host || baseEl;
      var wrapperEl = baseEl.querySelector('.toast-wrapper');
      var bottom = "calc(-10px - var(--ion-safe-area-bottom, 0px))";
      var top = "calc(10px + var(--ion-safe-area-top, 0px))";
      wrapperAnimation.addElement(wrapperEl);

      switch (position) {
        case 'top':
          wrapperAnimation.fromTo('transform', "translateY(".concat(top, ")"), 'translateY(-100%)');
          break;

        case 'middle':
          wrapperAnimation.fromTo('opacity', 0.99, 0);
          break;

        default:
          wrapperAnimation.fromTo('transform', "translateY(".concat(bottom, ")"), 'translateY(100%)');
          break;
      }

      return baseAnimation.addElement(hostEl).easing('cubic-bezier(.36,.66,.04,1)').duration(300).addAnimation(wrapperAnimation);
    };
    /**
     * MD Toast Enter Animation
     */


    var mdEnterAnimation = function mdEnterAnimation(baseEl, position) {
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var hostEl = baseEl.host || baseEl;
      var wrapperEl = baseEl.querySelector('.toast-wrapper');
      var bottom = "calc(8px + var(--ion-safe-area-bottom, 0px))";
      var top = "calc(8px + var(--ion-safe-area-top, 0px))";
      wrapperAnimation.addElement(wrapperEl);

      switch (position) {
        case 'top':
          wrapperEl.style.top = top;
          wrapperAnimation.fromTo('opacity', 0.01, 1);
          break;

        case 'middle':
          var topPosition = Math.floor(hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
          wrapperEl.style.top = "".concat(topPosition, "px");
          wrapperAnimation.fromTo('opacity', 0.01, 1);
          break;

        default:
          wrapperEl.style.bottom = bottom;
          wrapperAnimation.fromTo('opacity', 0.01, 1);
          break;
      }

      return baseAnimation.addElement(hostEl).easing('cubic-bezier(.36,.66,.04,1)').duration(400).addAnimation(wrapperAnimation);
    };
    /**
     * md Toast Leave Animation
     */


    var mdLeaveAnimation = function mdLeaveAnimation(baseEl) {
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var hostEl = baseEl.host || baseEl;
      var wrapperEl = baseEl.querySelector('.toast-wrapper');
      wrapperAnimation.addElement(wrapperEl).fromTo('opacity', 0.99, 0);
      return baseAnimation.addElement(hostEl).easing('cubic-bezier(.36,.66,.04,1)').duration(300).addAnimation(wrapperAnimation);
    };

    var Toast = /*#__PURE__*/function () {
      function Toast(hostRef) {
        var _this = this;

        _classCallCheck(this, Toast);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.presented = false;
        this.mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
        /**
         * How many milliseconds to wait before hiding the toast. By default, it will show
         * until `dismiss()` is called.
         */

        this.duration = 0;
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */

        this.keyboardClose = false;
        /**
         * The position of the toast on the screen.
         */

        this.position = 'bottom';
        /**
         * If `true`, the toast will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         */

        this.translucent = false;
        /**
         * If `true`, the toast will animate.
         */

        this.animated = true;

        this.dispatchCancelHandler = function (ev) {
          var role = ev.detail.role;

          if (Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["i"])(role)) {
            var cancelButton = _this.getButtons().find(function (b) {
              return b.role === 'cancel';
            });

            _this.callButtonHandler(cancelButton);
          }
        };

        Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["d"])(this.el);
        this.didPresent = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionToastDidPresent", 7);
        this.willPresent = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionToastWillPresent", 7);
        this.willDismiss = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionToastWillDismiss", 7);
        this.didDismiss = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionToastDidDismiss", 7);
      }
      /**
       * Present the toast overlay after it has been created.
       */


      _createClass(Toast, [{
        key: "present",
        value: function () {
          var _present = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var _this2 = this;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["e"])(this, 'toastEnter', iosEnterAnimation, mdEnterAnimation, this.position);

                  case 2:
                    if (this.duration > 0) {
                      this.durationTimeout = setTimeout(function () {
                        return _this2.dismiss(undefined, 'timeout');
                      }, this.duration);
                    }

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function present() {
            return _present.apply(this, arguments);
          }

          return present;
        }()
        /**
         * Dismiss the toast overlay after it has been presented.
         *
         * @param data Any data to emit in the dismiss events.
         * @param role The role of the element that is dismissing the toast.
         * This can be useful in a button handler for determining which button was
         * clicked to dismiss the toast.
         * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
         */

      }, {
        key: "dismiss",
        value: function dismiss(data, role) {
          if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
          }

          return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["f"])(this, data, role, 'toastLeave', iosLeaveAnimation, mdLeaveAnimation, this.position);
        }
        /**
         * Returns a promise that resolves when the toast did dismiss.
         */

      }, {
        key: "onDidDismiss",
        value: function onDidDismiss() {
          return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["g"])(this.el, 'ionToastDidDismiss');
        }
        /**
         * Returns a promise that resolves when the toast will dismiss.
         */

      }, {
        key: "onWillDismiss",
        value: function onWillDismiss() {
          return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["g"])(this.el, 'ionToastWillDismiss');
        }
      }, {
        key: "getButtons",
        value: function getButtons() {
          var buttons = this.buttons ? this.buttons.map(function (b) {
            return typeof b === 'string' ? {
              text: b
            } : b;
          }) : [];
          return buttons;
        }
      }, {
        key: "buttonClick",
        value: function () {
          var _buttonClick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(button) {
            var role, shouldDismiss;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    role = button.role;

                    if (!Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["i"])(role)) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.abrupt("return", this.dismiss(undefined, role));

                  case 3:
                    _context2.next = 5;
                    return this.callButtonHandler(button);

                  case 5:
                    shouldDismiss = _context2.sent;

                    if (!shouldDismiss) {
                      _context2.next = 8;
                      break;
                    }

                    return _context2.abrupt("return", this.dismiss(undefined, role));

                  case 8:
                    return _context2.abrupt("return", Promise.resolve());

                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function buttonClick(_x) {
            return _buttonClick.apply(this, arguments);
          }

          return buttonClick;
        }()
      }, {
        key: "callButtonHandler",
        value: function () {
          var _callButtonHandler = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(button) {
            var rtn;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!(button && button.handler)) {
                      _context3.next = 12;
                      break;
                    }

                    _context3.prev = 1;
                    _context3.next = 4;
                    return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_5__["s"])(button.handler);

                  case 4:
                    rtn = _context3.sent;

                    if (!(rtn === false)) {
                      _context3.next = 7;
                      break;
                    }

                    return _context3.abrupt("return", false);

                  case 7:
                    _context3.next = 12;
                    break;

                  case 9:
                    _context3.prev = 9;
                    _context3.t0 = _context3["catch"](1);
                    console.error(_context3.t0);

                  case 12:
                    return _context3.abrupt("return", true);

                  case 13:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, null, [[1, 9]]);
          }));

          function callButtonHandler(_x2) {
            return _callButtonHandler.apply(this, arguments);
          }

          return callButtonHandler;
        }()
      }, {
        key: "renderButtons",
        value: function renderButtons(buttons, side) {
          var _this3 = this;

          if (buttons.length === 0) {
            return;
          }

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);

          var buttonGroupsClasses = _defineProperty({
            'toast-button-group': true
          }, "toast-button-group-".concat(side), true);

          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": buttonGroupsClasses
          }, buttons.map(function (b) {
            return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
              type: "button",
              "class": buttonClass(b),
              tabIndex: 0,
              onClick: function onClick() {
                return _this3.buttonClick(b);
              },
              part: "button"
            }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
              "class": "toast-button-inner"
            }, b.icon && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("ion-icon", {
              icon: b.icon,
              slot: b.text === undefined ? 'icon-only' : undefined,
              "class": "toast-icon"
            }), b.text), mode === 'md' && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("ion-ripple-effect", {
              type: b.icon !== undefined && b.text === undefined ? 'unbounded' : 'bounded'
            }));
          }));
        }
      }, {
        key: "render",
        value: function render() {
          var allButtons = this.getButtons();
          var startButtons = allButtons.filter(function (b) {
            return b.side === 'start';
          });
          var endButtons = allButtons.filter(function (b) {
            return b.side !== 'start';
          });
          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);

          var wrapperClass = _defineProperty({
            'toast-wrapper': true
          }, "toast-".concat(this.position), true);

          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            style: {
              zIndex: "".concat(60000 + this.overlayIndex)
            },
            "class": Object.assign(Object.assign(Object.assign(_defineProperty({}, mode, true), Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_6__["c"])(this.color)), Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_6__["g"])(this.cssClass)), {
              'toast-translucent': this.translucent
            }),
            onIonToastWillDismiss: this.dispatchCancelHandler
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": wrapperClass
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toast-container",
            part: "container"
          }, this.renderButtons(startButtons, 'start'), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toast-content"
          }, this.header !== undefined && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toast-header",
            part: "header"
          }, this.header), this.message !== undefined && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toast-message",
            part: "message",
            innerHTML: Object(_index_3476b023_js__WEBPACK_IMPORTED_MODULE_7__["s"])(this.message)
          })), this.renderButtons(endButtons, 'end'))));
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "style",
        get: function get() {
          return ":host{--border-width:0;--border-style:none;--border-color:initial;--box-shadow:none;--min-width:auto;--width:auto;--min-height:auto;--height:auto;--max-height:auto;left:0;top:0;display:block;position:absolute;width:100%;height:100%;color:var(--color);font-family:var(--ion-font-family,inherit);contain:strict;z-index:1001;pointer-events:none}:host-context([dir=rtl]){left:unset;right:unset;right:0}:host(.overlay-hidden){display:none}:host(.ion-color){--button-color:inherit;color:var(--ion-color-contrast)}:host(.ion-color) .toast-button-cancel{color:inherit}:host(.ion-color) .toast-wrapper{background:var(--ion-color-base)}.toast-wrapper{border-radius:var(--border-radius);left:var(--start);right:var(--end);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow)}:host-context([dir=rtl]) .toast-wrapper,[dir=rtl] .toast-wrapper{left:unset;right:unset;left:var(--end);right:var(--start)}.toast-container{-ms-flex-align:center;align-items:center;pointer-events:auto;height:inherit;min-height:inherit;max-height:inherit;contain:content}.toast-container,.toast-content{display:-ms-flexbox;display:flex}.toast-content{-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.toast-message{-ms-flex:1;flex:1;white-space:pre-wrap}.toast-button-group{display:-ms-flexbox;display:flex}.toast-button{outline:none;color:var(--button-color);z-index:0}.toast-icon{font-size:1.4em}.toast-button-inner{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}\@media (any-hover:hover){.toast-button:hover{cursor:pointer}}:host{--background:var(--ion-color-step-50,#f2f2f2);--border-radius:14px;--button-color:var(--ion-color-primary,#3880ff);--color:var(--ion-color-step-850,#262626);--max-width:700px;--start:10px;--end:10px;font-size:14px}.toast-wrapper{margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;display:block;position:absolute;z-index:10}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toast-wrapper{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}\@supports ((-webkit-backdrop-filter:blur(0)) or (backdrop-filter:blur(0))){:host(.toast-translucent) .toast-wrapper{background:rgba(var(--ion-background-color-rgb,255,255,255),.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}}.toast-wrapper.toast-top{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);top:0}.toast-wrapper.toast-middle{opacity:.01}.toast-wrapper.toast-bottom{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);bottom:0}.toast-content{padding-left:15px;padding-right:15px;padding-top:15px;padding-bottom:15px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toast-content{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-header{margin-bottom:2px;font-weight:500}.toast-button{padding-left:15px;padding-right:15px;padding-top:10px;padding-bottom:10px;height:44px;-webkit-transition:background-color,opacity .1s linear;transition:background-color,opacity .1s linear;border:0;background-color:transparent;font-family:var(--ion-font-family);font-size:17px;font-weight:500;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toast-button{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-button.ion-activated{opacity:.4}\@media (any-hover:hover){.toast-button:hover{opacity:.6}}";
        }
      }]);

      return Toast;
    }();

    var buttonClass = function buttonClass(button) {
      var _Object$assign2;

      return Object.assign((_Object$assign2 = {
        'toast-button': true,
        'toast-button-icon-only': button.icon !== undefined && button.text === undefined
      }, _defineProperty(_Object$assign2, "toast-button-".concat(button.role), button.role !== undefined), _defineProperty(_Object$assign2, 'ion-focusable', true), _defineProperty(_Object$assign2, 'ion-activatable', true), _Object$assign2), Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_6__["g"])(button.cssClass));
    };
    /***/

  }
}]);
//# sourceMappingURL=72-es5.js.map