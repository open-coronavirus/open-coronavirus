function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-app_8-ios.entry.js":
  /*!******************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-app_8-ios.entry.js ***!
    \******************************************************************/

  /*! exports provided: ion_app, ion_buttons, ion_content, ion_footer, ion_header, ion_router_outlet, ion_title, ion_toolbar */

  /***/
  function node_modulesIonicCoreDistEsmIonApp_8IosEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_app", function () {
      return App;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_buttons", function () {
      return Buttons;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_content", function () {
      return Content;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_footer", function () {
      return Footer;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_header", function () {
      return Header;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_router_outlet", function () {
      return RouterOutlet;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_title", function () {
      return ToolbarTitle;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_toolbar", function () {
      return Toolbar;
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


    var _cubic_bezier_1d592096_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./cubic-bezier-1d592096.js */
    "./node_modules/@ionic/core/dist/esm/cubic-bezier-1d592096.js");
    /* harmony import */


    var _constants_3c3e1099_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./constants-3c3e1099.js */
    "./node_modules/@ionic/core/dist/esm/constants-3c3e1099.js");
    /* harmony import */


    var _theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./theme-18cbe2cc.js */
    "./node_modules/@ionic/core/dist/esm/theme-18cbe2cc.js");
    /* harmony import */


    var _framework_delegate_c2e2e1f4_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./framework-delegate-c2e2e1f4.js */
    "./node_modules/@ionic/core/dist/esm/framework-delegate-c2e2e1f4.js");
    /* harmony import */


    var _index_1469ea79_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./index-1469ea79.js */
    "./node_modules/@ionic/core/dist/esm/index-1469ea79.js");

    var App = /*#__PURE__*/function () {
      function App(hostRef) {
        _classCallCheck(this, App);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
      }

      _createClass(App, [{
        key: "componentDidLoad",
        value: function componentDidLoad() {
          {
            rIC(function () {
              var isHybrid = Object(_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["i"])(window, 'hybrid');

              if (!_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('_testing')) {
                __webpack_require__.e(
                /*! import() | tap-click-606f325e-js */
                "tap-click-606f325e-js").then(__webpack_require__.bind(null,
                /*! ./tap-click-606f325e.js */
                "./node_modules/@ionic/core/dist/esm/tap-click-606f325e.js")).then(function (module) {
                  return module.startTapClick(_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"]);
                });
              }

              if (_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('statusTap', isHybrid)) {
                __webpack_require__.e(
                /*! import() | status-tap-2ec46489-js */
                "status-tap-2ec46489-js").then(__webpack_require__.bind(null,
                /*! ./status-tap-2ec46489.js */
                "./node_modules/@ionic/core/dist/esm/status-tap-2ec46489.js")).then(function (module) {
                  return module.startStatusTap();
                });
              }

              if (_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('inputShims', needInputShims())) {
                __webpack_require__.e(
                /*! import() | input-shims-a4fc53ac-js */
                "input-shims-a4fc53ac-js").then(__webpack_require__.bind(null,
                /*! ./input-shims-a4fc53ac.js */
                "./node_modules/@ionic/core/dist/esm/input-shims-a4fc53ac.js")).then(function (module) {
                  return module.startInputShims(_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"]);
                });
              }

              if (_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('hardwareBackButton', isHybrid)) {
                Promise.resolve().then(__webpack_require__.bind(null,
                /*! ./hardware-back-button-1ed0083a.js */
                "./node_modules/@ionic/core/dist/esm/hardware-back-button-1ed0083a.js")).then(function (module) {
                  return module.startHardwareBackButton();
                });
              }

              __webpack_require__.e(
              /*! import() | focus-visible-70713a0c-js */
              "focus-visible-70713a0c-js").then(__webpack_require__.bind(null,
              /*! ./focus-visible-70713a0c.js */
              "./node_modules/@ionic/core/dist/esm/focus-visible-70713a0c.js")).then(function (module) {
                return module.startFocusVisible();
              });
            });
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _class;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": (_class = {}, _defineProperty(_class, mode, true), _defineProperty(_class, 'ion-page', true), _defineProperty(_class, 'force-statusbar-padding', _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('_forceStatusbarPadding')), _class)
          });
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "style",
        get: function get() {
          return "html.plt-mobile ion-app{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ion-app.force-statusbar-padding{--ion-safe-area-top:20px}";
        }
      }]);

      return App;
    }();

    var needInputShims = function needInputShims() {
      return Object(_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["i"])(window, 'ios') && Object(_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["i"])(window, 'mobile');
    };

    var rIC = function rIC(callback) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
      } else {
        setTimeout(callback, 32);
      }
    };

    var Buttons = /*#__PURE__*/function () {
      function Buttons(hostRef) {
        _classCallCheck(this, Buttons);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        /**
         * If true, buttons will disappear when its
         * parent toolbar has fully collapsed if the toolbar
         * is not the first toolbar. If the toolbar is the
         * first toolbar, the buttons will be hidden and will
         * only be shown once all toolbars have fully collapsed.
         *
         * Only applies in `ios` mode with `collapse` set to
         * `true` on `ion-header`.
         *
         * Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)
         */

        this.collapse = false;
      }

      _createClass(Buttons, [{
        key: "render",
        value: function render() {
          var _class2;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": (_class2 = {}, _defineProperty(_class2, mode, true), _defineProperty(_class2, 'buttons-collapse', this.collapse), _class2)
          });
        }
      }], [{
        key: "style",
        get: function get() {
          return ".sc-ion-buttons-ios-h{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:99}.sc-ion-buttons-ios-s  ion-button {--padding-top:0;--padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;--padding-start:5px;--padding-end:5px;margin-left:2px;margin-right:2px;height:32px;font-size:17px;font-weight:400}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.sc-ion-buttons-ios-s  ion-button {margin-left:unset;margin-right:unset;-webkit-margin-start:2px;margin-inline-start:2px;-webkit-margin-end:2px;margin-inline-end:2px}}.sc-ion-buttons-ios-s  ion-button:not(.button-round) {--border-radius:4px}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s  .button , .ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s  .button {--color:initial;--border-color:initial;--background-focused:var(--ion-color-contrast)}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s  .button-solid , .ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s  .button-solid {--background:var(--ion-color-contrast);--background-focused:#000;--background-focused-opacity:.12;--background-activated:#000;--background-activated-opacity:.12;--background-hover:var(--ion-color-base);--background-hover-opacity:0.45;--color:var(--ion-color-base);--color-focused:var(--ion-color-base)}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s  .button-clear , .ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s  .button-clear {--color-activated:var(--ion-color-contrast);--color-focused:var(--ion-color-contrast)}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s  .button-outline , .ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s  .button-outline {--color-activated:var(--ion-color-base);--color-focused:var(--ion-color-contrast)}.sc-ion-buttons-ios-s  .button-clear , .sc-ion-buttons-ios-s  .button-outline {--background-activated:transparent;--background-focused:currentColor;--background-hover:transparent}.sc-ion-buttons-ios-s  .button-solid:not(.ion-color) {--background-focused:#000;--background-focused-opacity:.12;--background-activated:#000;--background-activated-opacity:.12}.sc-ion-buttons-ios-s  ion-icon[slot=start] {margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;margin-right:.3em;font-size:24px;line-height:.67}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.sc-ion-buttons-ios-s  ion-icon[slot=start] {margin-right:unset;-webkit-margin-end:.3em;margin-inline-end:.3em}}.sc-ion-buttons-ios-s  ion-icon[slot=end] {margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;margin-left:.4em;font-size:24px;line-height:.67}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.sc-ion-buttons-ios-s  ion-icon[slot=end] {margin-left:unset;-webkit-margin-start:.4em;margin-inline-start:.4em}}.sc-ion-buttons-ios-s  ion-icon[slot=icon-only] {padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;font-size:28px;line-height:.67}";
        }
      }]);

      return Buttons;
    }();

    var Content = /*#__PURE__*/function () {
      function Content(hostRef) {
        _classCallCheck(this, Content);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.isScrolling = false;
        this.lastScroll = 0;
        this.queued = false;
        this.cTop = -1;
        this.cBottom = -1;
        this.mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this); // Detail is used in a hot loop in the scroll event, by allocating it here
        // V8 will be able to inline any read/write to it since it's a monomorphic class.
        // https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html

        this.detail = {
          scrollTop: 0,
          scrollLeft: 0,
          type: 'scroll',
          event: undefined,
          startX: 0,
          startY: 0,
          startTime: 0,
          currentX: 0,
          currentY: 0,
          velocityX: 0,
          velocityY: 0,
          deltaX: 0,
          deltaY: 0,
          currentTime: 0,
          data: undefined,
          isScrolling: true
        };
        /**
         * If `true`, the content will scroll behind the headers
         * and footers. This effect can easily be seen by setting the toolbar
         * to transparent.
         */

        this.fullscreen = false;
        /**
         * If you want to enable the content scrolling in the X axis, set this property to `true`.
         */

        this.scrollX = false;
        /**
         * If you want to disable the content scrolling in the Y axis, set this property to `false`.
         */

        this.scrollY = true;
        /**
         * Because of performance reasons, ionScroll events are disabled by default, in order to enable them
         * and start listening from (ionScroll), set this property to `true`.
         */

        this.scrollEvents = false;
        this.ionScrollStart = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionScrollStart", 7);
        this.ionScroll = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionScroll", 7);
        this.ionScrollEnd = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionScrollEnd", 7);
      }

      _createClass(Content, [{
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          this.onScrollEnd();
        }
      }, {
        key: "componentDidLoad",
        value: function componentDidLoad() {
          this.resize();
        }
      }, {
        key: "onClick",
        value: function onClick(ev) {
          if (this.isScrolling) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        }
      }, {
        key: "shouldForceOverscroll",
        value: function shouldForceOverscroll() {
          var forceOverscroll = this.forceOverscroll,
              mode = this.mode;
          return forceOverscroll === undefined ? mode === 'ios' && Object(_config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["i"])('ios') : forceOverscroll;
        }
      }, {
        key: "resize",
        value: function resize() {
          if (this.fullscreen) {
            Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["f"])(this.readDimensions.bind(this));
          } else if (this.cTop !== 0 || this.cBottom !== 0) {
            this.cTop = this.cBottom = 0;
            this.el.forceUpdate();
          }
        }
      }, {
        key: "readDimensions",
        value: function readDimensions() {
          var page = getPageElement(this.el);
          var top = Math.max(this.el.offsetTop, 0);
          var bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
          var dirty = top !== this.cTop || bottom !== this.cBottom;

          if (dirty) {
            this.cTop = top;
            this.cBottom = bottom;
            this.el.forceUpdate();
          }
        }
      }, {
        key: "onScroll",
        value: function onScroll(ev) {
          var _this = this;

          var timeStamp = Date.now();
          var shouldStart = !this.isScrolling;
          this.lastScroll = timeStamp;

          if (shouldStart) {
            this.onScrollStart();
          }

          if (!this.queued && this.scrollEvents) {
            this.queued = true;
            Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["f"])(function (ts) {
              _this.queued = false;
              _this.detail.event = ev;
              updateScrollDetail(_this.detail, _this.scrollEl, ts, shouldStart);

              _this.ionScroll.emit(_this.detail);
            });
          }
        }
        /**
         * Get the element where the actual scrolling takes place.
         * This element can be used to subscribe to `scroll` events or manually modify
         * `scrollTop`. However, it's recommended to use the API provided by `ion-content`:
         *
         * i.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events
         * and `scrollToPoint()` to scroll the content into a certain point.
         */

      }, {
        key: "getScrollElement",
        value: function getScrollElement() {
          return Promise.resolve(this.scrollEl);
        }
        /**
         * Scroll to the top of the component.
         *
         * @param duration The amount of time to take scrolling to the top. Defaults to `0`.
         */

      }, {
        key: "scrollToTop",
        value: function scrollToTop() {
          var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          return this.scrollToPoint(undefined, 0, duration);
        }
        /**
         * Scroll to the bottom of the component.
         *
         * @param duration The amount of time to take scrolling to the bottom. Defaults to `0`.
         */

      }, {
        key: "scrollToBottom",
        value: function scrollToBottom() {
          var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var y = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
          return this.scrollToPoint(undefined, y, duration);
        }
        /**
         * Scroll by a specified X/Y distance in the component.
         *
         * @param x The amount to scroll by on the horizontal axis.
         * @param y The amount to scroll by on the vertical axis.
         * @param duration The amount of time to take scrolling by that amount.
         */

      }, {
        key: "scrollByPoint",
        value: function scrollByPoint(x, y, duration) {
          return this.scrollToPoint(x + this.scrollEl.scrollLeft, y + this.scrollEl.scrollTop, duration);
        }
        /**
         * Scroll to a specified X/Y location in the component.
         *
         * @param x The point to scroll to on the horizontal axis.
         * @param y The point to scroll to on the vertical axis.
         * @param duration The amount of time to take scrolling to that point. Defaults to `0`.
         */

      }, {
        key: "scrollToPoint",
        value: function () {
          var _scrollToPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(x, y) {
            var duration,
                el,
                resolve,
                startTime,
                promise,
                fromY,
                fromX,
                deltaY,
                deltaX,
                step,
                _args = arguments;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    duration = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0;
                    el = this.scrollEl;

                    if (!(duration < 32)) {
                      _context.next = 6;
                      break;
                    }

                    if (y != null) {
                      el.scrollTop = y;
                    }

                    if (x != null) {
                      el.scrollLeft = x;
                    }

                    return _context.abrupt("return");

                  case 6:
                    startTime = 0;
                    promise = new Promise(function (r) {
                      return resolve = r;
                    });
                    fromY = el.scrollTop;
                    fromX = el.scrollLeft;
                    deltaY = y != null ? y - fromY : 0;
                    deltaX = x != null ? x - fromX : 0; // scroll loop

                    step = function step(timeStamp) {
                      var linearTime = Math.min(1, (timeStamp - startTime) / duration) - 1;
                      var easedT = Math.pow(linearTime, 3) + 1;

                      if (deltaY !== 0) {
                        el.scrollTop = Math.floor(easedT * deltaY + fromY);
                      }

                      if (deltaX !== 0) {
                        el.scrollLeft = Math.floor(easedT * deltaX + fromX);
                      }

                      if (easedT < 1) {
                        // do not use DomController here
                        // must use nativeRaf in order to fire in the next frame
                        // TODO: remove as any
                        requestAnimationFrame(step);
                      } else {
                        resolve();
                      }
                    }; // chill out for a frame first


                    requestAnimationFrame(function (ts) {
                      startTime = ts;
                      step(ts);
                    });
                    return _context.abrupt("return", promise);

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function scrollToPoint(_x, _x2) {
            return _scrollToPoint.apply(this, arguments);
          }

          return scrollToPoint;
        }()
      }, {
        key: "onScrollStart",
        value: function onScrollStart() {
          var _this2 = this;

          this.isScrolling = true;
          this.ionScrollStart.emit({
            isScrolling: true
          });

          if (this.watchDog) {
            clearInterval(this.watchDog);
          } // watchdog


          this.watchDog = setInterval(function () {
            if (_this2.lastScroll < Date.now() - 120) {
              _this2.onScrollEnd();
            }
          }, 100);
        }
      }, {
        key: "onScrollEnd",
        value: function onScrollEnd() {
          clearInterval(this.watchDog);
          this.watchDog = null;

          if (this.isScrolling) {
            this.isScrolling = false;
            this.ionScrollEnd.emit({
              isScrolling: false
            });
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _Object$assign,
              _this3 = this;

          var scrollX = this.scrollX,
              scrollY = this.scrollY;
          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          var forceOverscroll = this.shouldForceOverscroll();

          var transitionShadow = mode === 'ios' && _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('experimentalTransitionShadow', true);

          this.resize();
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": Object.assign(Object.assign({}, Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_5__["c"])(this.color)), (_Object$assign = {}, _defineProperty(_Object$assign, mode, true), _defineProperty(_Object$assign, 'content-sizing', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_5__["h"])('ion-popover', this.el)), _defineProperty(_Object$assign, 'overscroll', forceOverscroll), _Object$assign)),
            style: {
              '--offset-top': "".concat(this.cTop, "px"),
              '--offset-bottom': "".concat(this.cBottom, "px")
            }
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            id: "background-content"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("main", {
            "class": {
              'inner-scroll': true,
              'scroll-x': scrollX,
              'scroll-y': scrollY,
              'overscroll': (scrollX || scrollY) && forceOverscroll
            },
            ref: function ref(el) {
              return _this3.scrollEl = el;
            },
            onScroll: this.scrollEvents ? function (ev) {
              return _this3.onScroll(ev);
            } : undefined
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null)), transitionShadow ? Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "transition-effect"
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "transition-cover"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "transition-shadow"
          })) : null, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", {
            name: "fixed"
          }));
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "style",
        get: function get() {
          return ":host{--background:var(--ion-background-color,#fff);--color:var(--ion-text-color,#000);--padding-top:0px;--padding-bottom:0px;--padding-start:0px;--padding-end:0px;--keyboard-offset:0px;--offset-top:0px;--offset-bottom:0px;--overflow:auto;display:block;position:relative;-ms-flex:1;flex:1;width:100%;height:100%;margin:0!important;padding:0!important;font-family:var(--ion-font-family,inherit);contain:size style}:host(.ion-color) .inner-scroll{background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.outer-content){--background:var(--ion-color-step-50,#f2f2f2)}#background-content{background:var(--background)}#background-content,.inner-scroll{left:0;right:0;top:calc(var(--offset-top) * -1);bottom:calc(var(--offset-bottom) * -1);position:absolute}.inner-scroll{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:calc(var(--padding-top) + var(--offset-top));padding-bottom:calc(var(--padding-bottom) + var(--keyboard-offset) + var(--offset-bottom));color:var(--color);-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.inner-scroll{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.scroll-x,.scroll-y{-webkit-overflow-scrolling:touch;will-change:scroll-position;-ms-scroll-chaining:none;overscroll-behavior:contain}.scroll-y{-ms-touch-action:pan-y;touch-action:pan-y;overflow-y:var(--overflow)}.scroll-x{-ms-touch-action:pan-x;touch-action:pan-x;overflow-x:var(--overflow)}.scroll-x.scroll-y{-ms-touch-action:auto;touch-action:auto}.overscroll:after,.overscroll:before{position:absolute;width:1px;height:1px;content:\"\"}.overscroll:before{bottom:-1px}.overscroll:after{top:-1px}:host(.content-sizing){contain:none}:host(.content-sizing) .inner-scroll{position:relative}.transition-effect{display:none;left:-100%;opacity:0;pointer-events:none}.transition-cover,.transition-effect{position:absolute;width:100%;height:100%}.transition-cover{right:0;background:#000;opacity:.1}.transition-shadow{display:block;position:absolute;right:0;width:10px;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTE3MDgzRkQ5QTkyMTFFOUEwNzQ5MkJFREE1NUY2MjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTE3MDgzRkU5QTkyMTFFOUEwNzQ5MkJFREE1NUY2MjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTcwODNGQjlBOTIxMUU5QTA3NDkyQkVEQTU1RjYyNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTcwODNGQzlBOTIxMUU5QTA3NDkyQkVEQTU1RjYyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmePEuQAAABNSURBVHjaYvz//z8DIxAwMDAwATGMhmFmPDQuOSZks0AMmoJBaQHjkPfB0Lfg/2gQjVow+HPy/yHvg9GiYjQfjMbBqAWjFgy/4hogwADYqwdzxy5BuwAAAABJRU5ErkJggg==);background-repeat:repeat-y;background-size:10px 16px}::slotted([slot=fixed]){position:absolute}";
        }
      }]);

      return Content;
    }();

    var getParentElement = function getParentElement(el) {
      if (el.parentElement) {
        // normal element with a parent element
        return el.parentElement;
      }

      if (el.parentNode && el.parentNode.host) {
        // shadow dom's document fragment
        return el.parentNode.host;
      }

      return null;
    };

    var getPageElement = function getPageElement(el) {
      var tabs = el.closest('ion-tabs');

      if (tabs) {
        return tabs;
      }

      var page = el.closest('ion-app,ion-page,.ion-page,page-inner');

      if (page) {
        return page;
      }

      return getParentElement(el);
    }; // ******** DOM READ ****************


    var updateScrollDetail = function updateScrollDetail(detail, el, timestamp, shouldStart) {
      var prevX = detail.currentX;
      var prevY = detail.currentY;
      var prevT = detail.currentTime;
      var currentX = el.scrollLeft;
      var currentY = el.scrollTop;
      var timeDelta = timestamp - prevT;

      if (shouldStart) {
        // remember the start positions
        detail.startTime = timestamp;
        detail.startX = currentX;
        detail.startY = currentY;
        detail.velocityX = detail.velocityY = 0;
      }

      detail.currentTime = timestamp;
      detail.currentX = detail.scrollLeft = currentX;
      detail.currentY = detail.scrollTop = currentY;
      detail.deltaX = currentX - detail.startX;
      detail.deltaY = currentY - detail.startY;

      if (timeDelta > 0 && timeDelta < 100) {
        var velocityX = (currentX - prevX) / timeDelta;
        var velocityY = (currentY - prevY) / timeDelta;
        detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
        detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
      }
    };

    var Footer = /*#__PURE__*/function () {
      function Footer(hostRef) {
        _classCallCheck(this, Footer);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        /**
         * If `true`, the footer will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         *
         * Note: In order to scroll content behind the footer, the `fullscreen`
         * attribute needs to be set on the content.
         */

        this.translucent = false;
      }

      _createClass(Footer, [{
        key: "render",
        value: function render() {
          var _class3;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          var translucent = this.translucent;
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            role: "contentinfo",
            "class": (_class3 = {}, _defineProperty(_class3, mode, true), _defineProperty(_class3, "footer-".concat(mode), true), _defineProperty(_class3, "footer-translucent", translucent), _defineProperty(_class3, "footer-translucent-".concat(mode), translucent), _class3)
          }, mode === 'ios' && translucent && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "footer-background"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null));
        }
      }], [{
        key: "style",
        get: function get() {
          return "ion-footer{display:block;position:relative;-ms-flex-order:1;order:1;width:100%;z-index:10}ion-footer ion-toolbar:last-of-type{padding-bottom:var(--ion-safe-area-bottom,0)}.footer-ios ion-toolbar:first-of-type{--border-width:0.55px 0 0}\@supports ((-webkit-backdrop-filter:blur(0)) or (backdrop-filter:blur(0))){.footer-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.footer-translucent-ios ion-toolbar{--opacity:.8}}.footer-ios.ion-no-border ion-toolbar:first-of-type{--border-width:0}";
        }
      }]);

      return Footer;
    }();

    var TRANSITION = 'all 0.2s ease-in-out';

    var cloneElement = function cloneElement(tagName) {
      var getCachedEl = document.querySelector("".concat(tagName, ".ion-cloned-element"));

      if (getCachedEl !== null) {
        return getCachedEl;
      }

      var clonedEl = document.createElement(tagName);
      clonedEl.classList.add('ion-cloned-element');
      clonedEl.style.setProperty('display', 'none');
      document.body.appendChild(clonedEl);
      return clonedEl;
    };

    var createHeaderIndex = function createHeaderIndex(headerEl) {
      if (!headerEl) {
        return;
      }

      var toolbars = headerEl.querySelectorAll('ion-toolbar');
      return {
        el: headerEl,
        toolbars: Array.from(toolbars).map(function (toolbar) {
          var ionTitleEl = toolbar.querySelector('ion-title');
          return {
            el: toolbar,
            background: toolbar.shadowRoot.querySelector('.toolbar-background'),
            ionTitleEl: ionTitleEl,
            innerTitleEl: ionTitleEl ? ionTitleEl.shadowRoot.querySelector('.toolbar-title') : null,
            ionButtonsEl: Array.from(toolbar.querySelectorAll('ion-buttons')) || []
          };
        }) || []
      };
    };

    var handleContentScroll = function handleContentScroll(scrollEl, scrollHeaderIndex, contentEl) {
      Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["f"])(function () {
        var scrollTop = scrollEl.scrollTop;
        var scale = Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["c"])(1, 1 + -scrollTop / 500, 1.1); // Native refresher should not cause titles to scale

        var nativeRefresher = contentEl.querySelector('ion-refresher.refresher-native');

        if (nativeRefresher === null) {
          Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["w"])(function () {
            scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
          });
        }
      });
    };

    var setToolbarBackgroundOpacity = function setToolbarBackgroundOpacity(toolbar, opacity) {
      if (opacity === undefined) {
        toolbar.background.style.removeProperty('--opacity');
      } else {
        toolbar.background.style.setProperty('--opacity', opacity.toString());
      }
    };

    var handleToolbarBorderIntersection = function handleToolbarBorderIntersection(ev, mainHeaderIndex) {
      if (!ev[0].isIntersecting) {
        return;
      }
      /**
       * There is a bug in Safari where overflow scrolling on a non-body element
       * does not always reset the scrollTop position to 0 when letting go. It will
       * set to 1 once the rubber band effect has ended. This causes the background to
       * appear slightly on certain app setups.
       */


      var scale = ev[0].intersectionRatio > 0.9 ? 0 : (1 - ev[0].intersectionRatio) * 100 / 75;
      mainHeaderIndex.toolbars.forEach(function (toolbar) {
        setToolbarBackgroundOpacity(toolbar, scale === 1 ? undefined : scale);
      });
    };
    /**
     * If toolbars are intersecting, hide the scrollable toolbar content
     * and show the primary toolbar content. If the toolbars are not intersecting,
     * hide the primary toolbar content and show the scrollable toolbar content
     */


    var handleToolbarIntersection = function handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex) {
      Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["w"])(function () {
        handleToolbarBorderIntersection(ev, mainHeaderIndex);
        var event = ev[0];
        var intersection = event.intersectionRect;
        var intersectionArea = intersection.width * intersection.height;
        var rootArea = event.rootBounds.width * event.rootBounds.height;
        var isPageHidden = intersectionArea === 0 && rootArea === 0;
        var leftDiff = Math.abs(intersection.left - event.boundingClientRect.left);
        var rightDiff = Math.abs(intersection.right - event.boundingClientRect.right);
        var isPageTransitioning = intersectionArea > 0 && (leftDiff >= 5 || rightDiff >= 5);

        if (isPageHidden || isPageTransitioning) {
          return;
        }

        if (event.isIntersecting) {
          setHeaderActive(mainHeaderIndex, false);
          setHeaderActive(scrollHeaderIndex);
        } else {
          /**
           * There is a bug with IntersectionObserver on Safari
           * where `event.isIntersecting === false` when cancelling
           * a swipe to go back gesture. Checking the intersection
           * x, y, width, and height provides a workaround. This bug
           * does not happen when using Safari + Web Animations,
           * only Safari + CSS Animations.
           */
          var hasValidIntersection = intersection.x === 0 && intersection.y === 0 || intersection.width !== 0 && intersection.height !== 0;

          if (hasValidIntersection) {
            setHeaderActive(mainHeaderIndex);
            setHeaderActive(scrollHeaderIndex, false);
            setToolbarBackgroundOpacity(mainHeaderIndex.toolbars[0]);
          }
        }
      });
    };

    var setHeaderActive = function setHeaderActive(headerIndex) {
      var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (active) {
        headerIndex.el.classList.remove('header-collapse-condense-inactive');
      } else {
        headerIndex.el.classList.add('header-collapse-condense-inactive');
      }
    };

    var scaleLargeTitles = function scaleLargeTitles() {
      var toolbars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var transition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      toolbars.forEach(function (toolbar) {
        var ionTitle = toolbar.ionTitleEl;
        var titleDiv = toolbar.innerTitleEl;

        if (!ionTitle || ionTitle.size !== 'large') {
          return;
        }

        titleDiv.style.transformOrigin = 'left center';
        titleDiv.style.transition = transition ? TRANSITION : '';
        titleDiv.style.transform = "scale3d(".concat(scale, ", ").concat(scale, ", 1)");
      });
    };

    var Header = /*#__PURE__*/function () {
      function Header(hostRef) {
        _classCallCheck(this, Header);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.collapsibleHeaderInitialized = false;
        /**
         * If `true`, the header will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         *
         * Note: In order to scroll content behind the header, the `fullscreen`
         * attribute needs to be set on the content.
         */

        this.translucent = false;
      }

      _createClass(Header, [{
        key: "componentDidLoad",
        value: function () {
          var _componentDidLoad = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return this.checkCollapsibleHeader();

                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function componentDidLoad() {
            return _componentDidLoad.apply(this, arguments);
          }

          return componentDidLoad;
        }()
      }, {
        key: "componentDidUpdate",
        value: function () {
          var _componentDidUpdate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return this.checkCollapsibleHeader();

                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          function componentDidUpdate() {
            return _componentDidUpdate.apply(this, arguments);
          }

          return componentDidUpdate;
        }()
      }, {
        key: "componentDidUnload",
        value: function componentDidUnload() {
          this.destroyCollapsibleHeader();
        }
      }, {
        key: "checkCollapsibleHeader",
        value: function () {
          var _checkCollapsibleHeader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var hasCollapse, canCollapse, pageEl, contentEl;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    // Determine if the header can collapse
                    hasCollapse = this.collapse === 'condense';
                    canCollapse = hasCollapse && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this) === 'ios' ? hasCollapse : false;

                    if (!(!canCollapse && this.collapsibleHeaderInitialized)) {
                      _context4.next = 6;
                      break;
                    }

                    this.destroyCollapsibleHeader();
                    _context4.next = 11;
                    break;

                  case 6:
                    if (!(canCollapse && !this.collapsibleHeaderInitialized)) {
                      _context4.next = 11;
                      break;
                    }

                    pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
                    contentEl = pageEl ? pageEl.querySelector('ion-content') : null;
                    _context4.next = 11;
                    return this.setupCollapsibleHeader(contentEl, pageEl);

                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          function checkCollapsibleHeader() {
            return _checkCollapsibleHeader.apply(this, arguments);
          }

          return checkCollapsibleHeader;
        }()
      }, {
        key: "destroyCollapsibleHeader",
        value: function destroyCollapsibleHeader() {
          if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = undefined;
          }

          if (this.scrollEl && this.contentScrollCallback) {
            this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
            this.contentScrollCallback = undefined;
          }

          if (this.collapsibleMainHeader) {
            this.collapsibleMainHeader.classList.remove('header-collapse-main');
            this.collapsibleMainHeader = undefined;
          }
        }
      }, {
        key: "setupCollapsibleHeader",
        value: function () {
          var _setupCollapsibleHeader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(contentEl, pageEl) {
            var _this4 = this;

            var headers, mainHeaderIndex, scrollHeaderIndex, toolbarIntersection;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!(!contentEl || !pageEl)) {
                      _context5.next = 3;
                      break;
                    }

                    console.error('ion-header requires a content to collapse, make sure there is an ion-content.');
                    return _context5.abrupt("return");

                  case 3:
                    _context5.next = 5;
                    return contentEl.getScrollElement();

                  case 5:
                    this.scrollEl = _context5.sent;
                    headers = pageEl.querySelectorAll('ion-header');
                    this.collapsibleMainHeader = Array.from(headers).find(function (header) {
                      return header.collapse !== 'condense';
                    });

                    if (this.collapsibleMainHeader) {
                      _context5.next = 10;
                      break;
                    }

                    return _context5.abrupt("return");

                  case 10:
                    mainHeaderIndex = createHeaderIndex(this.collapsibleMainHeader);
                    scrollHeaderIndex = createHeaderIndex(this.el);

                    if (!(!mainHeaderIndex || !scrollHeaderIndex)) {
                      _context5.next = 14;
                      break;
                    }

                    return _context5.abrupt("return");

                  case 14:
                    setHeaderActive(mainHeaderIndex, false);
                    mainHeaderIndex.toolbars.forEach(function (toolbar) {
                      setToolbarBackgroundOpacity(toolbar, 0);
                    });
                    /**
                     * Handle interaction between toolbar collapse and
                     * showing/hiding content in the primary ion-header
                     * as well as progressively showing/hiding the main header
                     * border as the top-most toolbar collapses or expands.
                     */

                    toolbarIntersection = function toolbarIntersection(ev) {
                      handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex);
                    };

                    this.intersectionObserver = new IntersectionObserver(toolbarIntersection, {
                      root: contentEl,
                      threshold: [0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
                    });
                    this.intersectionObserver.observe(scrollHeaderIndex.toolbars[scrollHeaderIndex.toolbars.length - 1].el);
                    /**
                     * Handle scaling of large iOS titles and
                     * showing/hiding border on last toolbar
                     * in primary header
                     */

                    this.contentScrollCallback = function () {
                      handleContentScroll(_this4.scrollEl, scrollHeaderIndex, contentEl);
                    };

                    this.scrollEl.addEventListener('scroll', this.contentScrollCallback);
                    Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["w"])(function () {
                      cloneElement('ion-title');
                      cloneElement('ion-back-button');

                      if (_this4.collapsibleMainHeader !== undefined) {
                        _this4.collapsibleMainHeader.classList.add('header-collapse-main');
                      }
                    });
                    this.collapsibleHeaderInitialized = true;

                  case 23:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));

          function setupCollapsibleHeader(_x3, _x4) {
            return _setupCollapsibleHeader.apply(this, arguments);
          }

          return setupCollapsibleHeader;
        }()
      }, {
        key: "render",
        value: function render() {
          var _class4;

          var translucent = this.translucent;
          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          var collapse = this.collapse || 'none';
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            role: "banner",
            "class": (_class4 = {}, _defineProperty(_class4, mode, true), _defineProperty(_class4, "header-".concat(mode), true), _defineProperty(_class4, "header-translucent", this.translucent), _defineProperty(_class4, "header-collapse-".concat(collapse), true), _defineProperty(_class4, "header-translucent-".concat(mode), this.translucent), _class4)
          }, mode === 'ios' && translucent && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "header-background"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null));
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "style",
        get: function get() {
          return "ion-header{display:block;position:relative;-ms-flex-order:-1;order:-1;width:100%;z-index:10}ion-header ion-toolbar:first-of-type{padding-top:var(--ion-safe-area-top,0)}.header-ios ion-toolbar:last-of-type{--border-width:0 0 0.55px}\@supports ((-webkit-backdrop-filter:blur(0)) or (backdrop-filter:blur(0))){.header-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.header-translucent-ios ion-toolbar{--opacity:.8}.header-collapse-condense-inactive .header-background{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}}.header-ios.ion-no-border ion-toolbar:last-of-type{--border-width:0}.header-collapse-condense{z-index:9}.header-collapse-condense ion-toolbar{position:-webkit-sticky;position:sticky;top:0}.header-collapse-condense ion-toolbar:first-of-type{padding-top:7px;z-index:1}.header-collapse-condense ion-toolbar{--background:var(--ion-background-color,#fff);z-index:0}.header-collapse-condense ion-toolbar ion-searchbar{height:48px;padding-top:0;padding-bottom:13px}.header-collapse-main ion-toolbar.in-toolbar ion-buttons,.header-collapse-main ion-toolbar.in-toolbar ion-title{-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.in-toolbar ion-buttons.buttons-collapse,.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.in-toolbar ion-title{opacity:0;pointer-events:none}.header-collapse-condense-inactive.header-collapse-condense ion-toolbar.in-toolbar ion-buttons.buttons-collapse,.header-collapse-condense-inactive.header-collapse-condense ion-toolbar.in-toolbar ion-title{visibility:hidden}";
        }
      }]);

      return Header;
    }();

    var RouterOutlet = /*#__PURE__*/function () {
      function RouterOutlet(hostRef) {
        _classCallCheck(this, RouterOutlet);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.animationEnabled = true;
        /**
         * The mode determines which platform styles to use.
         */

        this.mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
        /**
         * If `true`, the router-outlet should animate the transition of components.
         */

        this.animated = true;
        this.ionNavWillLoad = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionNavWillLoad", 7);
        this.ionNavWillChange = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionNavWillChange", 3);
        this.ionNavDidChange = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionNavDidChange", 3);
      }

      _createClass(RouterOutlet, [{
        key: "swipeHandlerChanged",
        value: function swipeHandlerChanged() {
          if (this.gesture) {
            this.gesture.enable(this.swipeHandler !== undefined);
          }
        }
      }, {
        key: "connectedCallback",
        value: function () {
          var _connectedCallback = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var _this5 = this;

            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return __webpack_require__.e(
                    /*! import() | swipe-back-d2cdbf9a-js */
                    "swipe-back-d2cdbf9a-js").then(__webpack_require__.bind(null,
                    /*! ./swipe-back-d2cdbf9a.js */
                    "./node_modules/@ionic/core/dist/esm/swipe-back-d2cdbf9a.js"));

                  case 2:
                    this.gesture = _context6.sent.createSwipeBackGesture(this.el, function () {
                      return !!_this5.swipeHandler && _this5.swipeHandler.canStart() && _this5.animationEnabled;
                    }, function () {
                      return _this5.swipeHandler && _this5.swipeHandler.onStart();
                    }, function (step) {
                      return _this5.ani && _this5.ani.progressStep(step);
                    }, function (shouldComplete, step, dur) {
                      if (_this5.ani) {
                        _this5.animationEnabled = false;

                        _this5.ani.onFinish(function () {
                          _this5.animationEnabled = true;

                          if (_this5.swipeHandler) {
                            _this5.swipeHandler.onEnd(shouldComplete);
                          }
                        }, {
                          oneTimeCallback: true
                        }); // Account for rounding errors in JS


                        var newStepValue = shouldComplete ? -0.001 : 0.001;
                        /**
                         * Animation will be reversed here, so need to
                         * reverse the easing curve as well
                         *
                         * Additionally, we need to account for the time relative
                         * to the new easing curve, as `stepValue` is going to be given
                         * in terms of a linear curve.
                         */

                        if (!shouldComplete) {
                          _this5.ani.easing('cubic-bezier(1, 0, 0.68, 0.28)');

                          newStepValue += Object(_cubic_bezier_1d592096_js__WEBPACK_IMPORTED_MODULE_3__["g"])([0, 0], [1, 0], [0.68, 0.28], [1, 1], step)[0];
                        } else {
                          newStepValue += Object(_cubic_bezier_1d592096_js__WEBPACK_IMPORTED_MODULE_3__["g"])([0, 0], [0.32, 0.72], [0, 1], [1, 1], step)[0];
                        }

                        _this5.ani.progressEnd(shouldComplete ? 1 : 0, newStepValue, dur);
                      }
                    });
                    this.swipeHandlerChanged();

                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this);
          }));

          function connectedCallback() {
            return _connectedCallback.apply(this, arguments);
          }

          return connectedCallback;
        }()
      }, {
        key: "componentWillLoad",
        value: function componentWillLoad() {
          this.ionNavWillLoad.emit();
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
          }
        }
        /** @internal */

      }, {
        key: "commit",
        value: function () {
          var _commit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(enteringEl, leavingEl, opts) {
            var unlock, changed;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return this.lock();

                  case 2:
                    unlock = _context7.sent;
                    changed = false;
                    _context7.prev = 4;
                    _context7.next = 7;
                    return this.transition(enteringEl, leavingEl, opts);

                  case 7:
                    changed = _context7.sent;
                    _context7.next = 13;
                    break;

                  case 10:
                    _context7.prev = 10;
                    _context7.t0 = _context7["catch"](4);
                    console.error(_context7.t0);

                  case 13:
                    unlock();
                    return _context7.abrupt("return", changed);

                  case 15:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this, [[4, 10]]);
          }));

          function commit(_x5, _x6, _x7) {
            return _commit.apply(this, arguments);
          }

          return commit;
        }()
        /** @internal */

      }, {
        key: "setRouteId",
        value: function () {
          var _setRouteId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id, params, direction) {
            var changed;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return this.setRoot(id, params, {
                      duration: direction === 'root' ? 0 : undefined,
                      direction: direction === 'back' ? 'back' : 'forward'
                    });

                  case 2:
                    changed = _context8.sent;
                    return _context8.abrupt("return", {
                      changed: changed,
                      element: this.activeEl
                    });

                  case 4:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));

          function setRouteId(_x8, _x9, _x10) {
            return _setRouteId.apply(this, arguments);
          }

          return setRouteId;
        }()
        /** @internal */

      }, {
        key: "getRouteId",
        value: function () {
          var _getRouteId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var active;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    active = this.activeEl;
                    return _context9.abrupt("return", active ? {
                      id: active.tagName,
                      element: active
                    } : undefined);

                  case 2:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9, this);
          }));

          function getRouteId() {
            return _getRouteId.apply(this, arguments);
          }

          return getRouteId;
        }()
      }, {
        key: "setRoot",
        value: function () {
          var _setRoot = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(component, params, opts) {
            var leavingEl, enteringEl;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    if (!(this.activeComponent === component)) {
                      _context10.next = 2;
                      break;
                    }

                    return _context10.abrupt("return", false);

                  case 2:
                    // attach entering view to DOM
                    leavingEl = this.activeEl;
                    _context10.next = 5;
                    return Object(_framework_delegate_c2e2e1f4_js__WEBPACK_IMPORTED_MODULE_6__["a"])(this.delegate, this.el, component, ['ion-page', 'ion-page-invisible'], params);

                  case 5:
                    enteringEl = _context10.sent;
                    this.activeComponent = component;
                    this.activeEl = enteringEl; // commit animation

                    _context10.next = 10;
                    return this.commit(enteringEl, leavingEl, opts);

                  case 10:
                    _context10.next = 12;
                    return Object(_framework_delegate_c2e2e1f4_js__WEBPACK_IMPORTED_MODULE_6__["d"])(this.delegate, leavingEl);

                  case 12:
                    return _context10.abrupt("return", true);

                  case 13:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10, this);
          }));

          function setRoot(_x11, _x12, _x13) {
            return _setRoot.apply(this, arguments);
          }

          return setRoot;
        }()
      }, {
        key: "transition",
        value: function () {
          var _transition = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(enteringEl, leavingEl) {
            var _this6 = this;

            var opts,
                el,
                mode,
                animated,
                animationBuilder,
                _args11 = arguments;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    opts = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : {};

                    if (!(leavingEl === enteringEl)) {
                      _context11.next = 3;
                      break;
                    }

                    return _context11.abrupt("return", false);

                  case 3:
                    // emit nav will change event
                    this.ionNavWillChange.emit();
                    el = this.el, mode = this.mode;
                    animated = this.animated && _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('animated', true);
                    animationBuilder = this.animation || opts.animationBuilder || _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].get('navAnimation');
                    _context11.next = 9;
                    return Object(_index_1469ea79_js__WEBPACK_IMPORTED_MODULE_7__["t"])(Object.assign({
                      mode: mode,
                      animated: animated,
                      animationBuilder: animationBuilder,
                      enteringEl: enteringEl,
                      leavingEl: leavingEl,
                      baseEl: el,
                      progressCallback: opts.progressAnimation ? function (ani) {
                        return _this6.ani = ani;
                      } : undefined
                    }, opts));

                  case 9:
                    // emit nav changed event
                    this.ionNavDidChange.emit();
                    return _context11.abrupt("return", true);

                  case 11:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee11, this);
          }));

          function transition(_x14, _x15) {
            return _transition.apply(this, arguments);
          }

          return transition;
        }()
      }, {
        key: "lock",
        value: function () {
          var _lock = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
            var p, resolve;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    p = this.waitPromise;
                    this.waitPromise = new Promise(function (r) {
                      return resolve = r;
                    });

                    if (!(p !== undefined)) {
                      _context12.next = 5;
                      break;
                    }

                    _context12.next = 5;
                    return p;

                  case 5:
                    return _context12.abrupt("return", resolve);

                  case 6:
                  case "end":
                    return _context12.stop();
                }
              }
            }, _callee12, this);
          }));

          function lock() {
            return _lock.apply(this, arguments);
          }

          return lock;
        }()
      }, {
        key: "render",
        value: function render() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null);
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "watchers",
        get: function get() {
          return {
            "swipeHandler": ["swipeHandlerChanged"]
          };
        }
      }, {
        key: "style",
        get: function get() {
          return ":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:layout size style;overflow:hidden;z-index:0}";
        }
      }]);

      return RouterOutlet;
    }();

    var ToolbarTitle = /*#__PURE__*/function () {
      function ToolbarTitle(hostRef) {
        _classCallCheck(this, ToolbarTitle);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.ionStyle = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionStyle", 7);
      }

      _createClass(ToolbarTitle, [{
        key: "sizeChanged",
        value: function sizeChanged() {
          this.emitStyle();
        }
      }, {
        key: "connectedCallback",
        value: function connectedCallback() {
          this.emitStyle();
        }
      }, {
        key: "emitStyle",
        value: function emitStyle() {
          var size = this.getSize();
          this.ionStyle.emit(_defineProperty({}, "title-".concat(size), true));
        }
      }, {
        key: "getSize",
        value: function getSize() {
          return this.size !== undefined ? this.size : 'default';
        }
      }, {
        key: "render",
        value: function render() {
          var _Object$assign2;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          var size = this.getSize();
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": Object.assign((_Object$assign2 = {}, _defineProperty(_Object$assign2, mode, true), _defineProperty(_Object$assign2, "title-".concat(size), true), _Object$assign2), Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_5__["c"])(this.color))
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toolbar-title"
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null)));
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "watchers",
        get: function get() {
          return {
            "size": ["sizeChanged"]
          };
        }
      }, {
        key: "style",
        get: function get() {
          return ":host{--color:initial;display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-align:center;align-items:center;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}.toolbar-title{display:block;width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;pointer-events:auto}:host(.title-small) .toolbar-title{white-space:normal}:host{left:0;top:0;padding-left:90px;padding-right:90px;padding-top:0;padding-bottom:0;position:absolute;width:100%;height:100%;-webkit-transform:translateZ(0);transform:translateZ(0);font-size:17px;font-weight:600;text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;pointer-events:none}:host-context([dir=rtl]){left:unset;right:unset;right:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:90px;padding-inline-start:90px;-webkit-padding-end:90px;padding-inline-end:90px}}:host(.title-small){padding-left:9px;padding-right:9px;padding-top:6px;padding-bottom:16px;position:relative;font-size:13px;font-weight:400}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.title-small){padding-left:unset;padding-right:unset;-webkit-padding-start:9px;padding-inline-start:9px;-webkit-padding-end:9px;padding-inline-end:9px}}:host(.title-large){padding-left:16px;padding-right:16px;padding-top:0;padding-bottom:0;bottom:0;-ms-flex-align:end;align-items:flex-end;min-width:100%;padding-bottom:6px;font-size:34px;font-weight:700;text-align:start}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.title-large){padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}";
        }
      }]);

      return ToolbarTitle;
    }();

    var Toolbar = /*#__PURE__*/function () {
      function Toolbar(hostRef) {
        _classCallCheck(this, Toolbar);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.childrenStyles = new Map();
      }

      _createClass(Toolbar, [{
        key: "componentWillLoad",
        value: function componentWillLoad() {
          var buttons = Array.from(this.el.querySelectorAll('ion-buttons'));
          var firstButtons = buttons.find(function (button) {
            return button.slot === 'start';
          });

          if (firstButtons) {
            firstButtons.classList.add('buttons-first-slot');
          }

          var buttonsReversed = buttons.reverse();
          var lastButtons = buttonsReversed.find(function (button) {
            return button.slot === 'end';
          }) || buttonsReversed.find(function (button) {
            return button.slot === 'primary';
          }) || buttonsReversed.find(function (button) {
            return button.slot === 'secondary';
          });

          if (lastButtons) {
            lastButtons.classList.add('buttons-last-slot');
          }
        }
      }, {
        key: "childrenStyle",
        value: function childrenStyle(ev) {
          ev.stopPropagation();
          var tagName = ev.target.tagName;
          var updatedStyles = ev.detail;
          var newStyles = {};
          var childStyles = this.childrenStyles.get(tagName) || {};
          var hasStyleChange = false;
          Object.keys(updatedStyles).forEach(function (key) {
            var childKey = "toolbar-".concat(key);
            var newValue = updatedStyles[key];

            if (newValue !== childStyles[childKey]) {
              hasStyleChange = true;
            }

            if (newValue) {
              newStyles[childKey] = true;
            }
          });

          if (hasStyleChange) {
            this.childrenStyles.set(tagName, newStyles);
            this.el.forceUpdate();
          }
        }
      }, {
        key: "render",
        value: function render() {
          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          var childStyles = {};
          this.childrenStyles.forEach(function (value) {
            Object.assign(childStyles, value);
          });
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "class": Object.assign(Object.assign(_defineProperty({
              'in-toolbar': Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_5__["h"])('ion-toolbar', this.el)
            }, mode, true), childStyles), Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_5__["c"])(this.color))
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toolbar-background"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toolbar-container"
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", {
            name: "start"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", {
            name: "secondary"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            "class": "toolbar-content"
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null)), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", {
            name: "primary"
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", {
            name: "end"
          })));
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "style",
        get: function get() {
          return ":host{--border-width:0;--border-style:solid;--opacity:1;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:var(--ion-safe-area-left);padding-right:var(--ion-safe-area-right);display:block;position:relative;width:100%;color:var(--color);font-family:var(--ion-font-family,inherit);contain:content;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--ion-safe-area-left);padding-inline-start:var(--ion-safe-area-left);-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}}:host(.ion-color){color:var(--ion-color-contrast)}:host(.ion-color) .toolbar-background{background:var(--ion-color-base)}.toolbar-container{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;width:100%;min-height:var(--min-height);contain:content;overflow:hidden;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toolbar-container{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.toolbar-background{top:0;-webkit-transform:translateZ(0);transform:translateZ(0);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);contain:strict;opacity:var(--opacity);z-index:-1;pointer-events:none}.toolbar-background,::slotted(ion-progress-bar){left:0;right:0;bottom:0;position:absolute}:host{--background:var(--ion-toolbar-background,var(--ion-color-step-50,#fff));--color:var(--ion-toolbar-color,var(--ion-text-color,#000));--border-color:var(--ion-toolbar-border-color,var(--ion-border-color,var(--ion-color-step-150,rgba(0,0,0,0.2))));--padding-top:3px;--padding-bottom:3px;--padding-start:4px;--padding-end:4px;--min-height:44px}.toolbar-content{-ms-flex:1;flex:1;-ms-flex-order:4;order:4;min-width:0}:host(.toolbar-segment) .toolbar-content{display:-ms-inline-flexbox;display:inline-flex}:host(.toolbar-searchbar) .toolbar-container{padding-top:0;padding-bottom:0}:host(.toolbar-searchbar) ::slotted(*){-ms-flex-item-align:start;align-self:start}:host(.toolbar-searchbar) ::slotted(ion-chip){margin-top:3px}:host(.toolbar-searchbar) ::slotted(ion-back-button){height:38px}::slotted(ion-buttons){min-height:38px}::slotted([slot=start]){-ms-flex-order:2;order:2}::slotted([slot=secondary]){-ms-flex-order:3;order:3}::slotted([slot=primary]){-ms-flex-order:5;order:5;text-align:end}::slotted([slot=end]){-ms-flex-order:6;order:6;text-align:end}:host(.toolbar-title-large) .toolbar-container{-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:start;align-items:flex-start}:host(.toolbar-title-large) .toolbar-content ion-title{-ms-flex:1;flex:1;-ms-flex-order:8;order:8;min-width:100%}";
        }
      }]);

      return Toolbar;
    }();
    /***/

  }
}]);
//# sourceMappingURL=4-es5.js.map