function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[58], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-segment_2-md.entry.js":
  /*!*********************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-segment_2-md.entry.js ***!
    \*********************************************************************/

  /*! exports provided: ion_segment, ion_segment_button */

  /***/
  function node_modulesIonicCoreDistEsmIonSegment_2MdEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_segment", function () {
      return Segment;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_segment_button", function () {
      return SegmentButton;
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


    var _theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./theme-18cbe2cc.js */
    "./node_modules/@ionic/core/dist/esm/theme-18cbe2cc.js");

    var Segment = /*#__PURE__*/function () {
      function Segment(hostRef) {
        var _this = this;

        _classCallCheck(this, Segment);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.didInit = false;
        this.activated = false;
        /**
         * If `true`, the user cannot interact with the segment.
         */

        this.disabled = false;
        /**
         * If `true`, the segment buttons will overflow and the user can swipe to see them.
         * In addition, this will disable the gesture to drag the indicator between the buttons
         * in order to swipe to see hidden buttons.
         */

        this.scrollable = false;

        this.onClick = function (ev) {
          var current = ev.target;
          var previous = _this.checked;
          _this.value = current.value;

          if (previous && _this.scrollable) {
            _this.checkButton(previous, current);
          }

          _this.checked = current;
        };

        this.ionChange = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionChange", 7);
        this.ionSelect = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionSelect", 7);
        this.ionStyle = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionStyle", 7);
      }

      _createClass(Segment, [{
        key: "valueChanged",
        value: function valueChanged(value, oldValue) {
          this.ionSelect.emit({
            value: value
          });

          if (oldValue !== '' || this.didInit) {
            if (!this.activated) {
              this.ionChange.emit({
                value: value
              });
            } else {
              this.valueAfterGesture = value;
            }
          }
        }
      }, {
        key: "disabledChanged",
        value: function disabledChanged() {
          this.gestureChanged();
          var buttons = this.getButtons();

          var _iterator = _createForOfIteratorHelper(buttons),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var button = _step.value;
              button.disabled = this.disabled;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }, {
        key: "gestureChanged",
        value: function gestureChanged() {
          if (this.gesture && !this.scrollable) {
            this.gesture.enable(!this.disabled);
          }
        }
      }, {
        key: "connectedCallback",
        value: function connectedCallback() {
          this.emitStyle();
        }
      }, {
        key: "componentWillLoad",
        value: function componentWillLoad() {
          this.emitStyle();
        }
      }, {
        key: "componentDidLoad",
        value: function () {
          var _componentDidLoad = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var _this2 = this;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    this.setCheckedClasses();
                    _context.next = 3;
                    return Promise.resolve().then(__webpack_require__.bind(null,
                    /*! ./index-c38df685.js */
                    "./node_modules/@ionic/core/dist/esm/index-c38df685.js"));

                  case 3:
                    this.gesture = _context.sent.createGesture({
                      el: this.el,
                      gestureName: 'segment',
                      gesturePriority: 100,
                      threshold: 0,
                      passive: false,
                      onStart: function onStart(ev) {
                        return _this2.onStart(ev);
                      },
                      onMove: function onMove(ev) {
                        return _this2.onMove(ev);
                      },
                      onEnd: function onEnd(ev) {
                        return _this2.onEnd(ev);
                      }
                    });
                    this.gesture.enable(!this.scrollable);
                    this.gestureChanged();

                    if (this.disabled) {
                      this.disabledChanged();
                    }

                    this.didInit = true;

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function componentDidLoad() {
            return _componentDidLoad.apply(this, arguments);
          }

          return componentDidLoad;
        }()
      }, {
        key: "onStart",
        value: function onStart(detail) {
          this.activate(detail);
        }
      }, {
        key: "onMove",
        value: function onMove(detail) {
          this.setNextIndex(detail);
        }
      }, {
        key: "onEnd",
        value: function onEnd(detail) {
          this.setActivated(false);
          var checkedValidButton = this.setNextIndex(detail, true);
          detail.event.stopImmediatePropagation();

          if (checkedValidButton) {
            this.addRipple(detail);
          }

          var value = this.valueAfterGesture;

          if (value !== undefined) {
            this.ionChange.emit({
              value: value
            });
            this.valueAfterGesture = undefined;
          }
        }
      }, {
        key: "getButtons",
        value: function getButtons() {
          return Array.from(this.el.querySelectorAll('ion-segment-button'));
        }
        /**
         * The gesture blocks the segment button ripple. This
         * function adds the ripple based on the checked segment
         * and where the cursor ended.
         */

      }, {
        key: "addRipple",
        value: function addRipple(detail) {
          var _this3 = this;

          var useRippleEffect = _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('animated', true) && _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].getBoolean('rippleEffect', true);

          if (!useRippleEffect) {
            return;
          }

          var buttons = this.getButtons();
          var checked = buttons.find(function (button) {
            return button.value === _this3.value;
          });
          var root = checked.shadowRoot || checked;
          var ripple = root.querySelector('ion-ripple-effect');

          if (!ripple) {
            return;
          }

          var _Object = Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["p"])(detail.event),
              x = _Object.x,
              y = _Object.y;

          ripple.addRipple(x, y).then(function (remove) {
            return remove();
          });
        }
        /*
         * Activate both the segment and the buttons
         * due to a bug with ::slotted in Safari
         */

      }, {
        key: "setActivated",
        value: function setActivated(activated) {
          var buttons = this.getButtons();
          buttons.forEach(function (button) {
            if (activated) {
              button.classList.add('segment-button-activated');
            } else {
              button.classList.remove('segment-button-activated');
            }
          });
          this.activated = activated;
        }
      }, {
        key: "activate",
        value: function activate(detail) {
          var _this4 = this;

          var clicked = detail.event.target;
          var buttons = this.getButtons();
          var checked = buttons.find(function (button) {
            return button.value === _this4.value;
          }); // Make sure we are only checking for activation on a segment button
          // since disabled buttons will get the click on the segment

          if (clicked.tagName !== 'ION-SEGMENT-BUTTON') {
            return;
          } // If there are no checked buttons, set the current button to checked


          if (!checked) {
            this.value = clicked.value;
          } // If the gesture began on the clicked button with the indicator
          // then we should activate the indicator


          if (this.value === clicked.value) {
            this.setActivated(true);
          }
        }
      }, {
        key: "getIndicator",
        value: function getIndicator(button) {
          var root = button.shadowRoot || button;
          return root.querySelector('.segment-button-indicator');
        }
      }, {
        key: "checkButton",
        value: function checkButton(previous, current) {
          var previousIndicator = this.getIndicator(previous);
          var currentIndicator = this.getIndicator(current);

          if (previousIndicator === null || currentIndicator === null) {
            return;
          }

          var previousClientRect = previousIndicator.getBoundingClientRect();
          var currentClientRect = currentIndicator.getBoundingClientRect();
          var widthDelta = previousClientRect.width / currentClientRect.width;
          var xPosition = previousClientRect.left - currentClientRect.left; // Scale the indicator width to match the previous indicator width
          // and translate it on top of the previous indicator

          var transform = "translate3d(".concat(xPosition, "px, 0, 0) scaleX(").concat(widthDelta, ")");
          Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["w"])(function () {
            // Remove the transition before positioning on top of the previous indicator
            currentIndicator.classList.remove('segment-button-indicator-animated');
            currentIndicator.style.setProperty('transform', transform); // Force a repaint to ensure the transform happens

            currentIndicator.getBoundingClientRect(); // Add the transition to move the indicator into place

            currentIndicator.classList.add('segment-button-indicator-animated'); // Remove the transform to slide the indicator back to the button clicked

            currentIndicator.style.setProperty('transform', '');
          });
          this.value = current.value;
          this.setCheckedClasses();
        }
      }, {
        key: "setCheckedClasses",
        value: function setCheckedClasses() {
          var _this5 = this;

          var buttons = this.getButtons();
          var index = buttons.findIndex(function (button) {
            return button.value === _this5.value;
          });
          var next = index + 1; // Keep track of the currently checked button

          this.checked = buttons.find(function (button) {
            return button.value === _this5.value;
          });

          var _iterator2 = _createForOfIteratorHelper(buttons),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var button = _step2.value;
              button.classList.remove('segment-button-after-checked');
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          if (next < buttons.length) {
            buttons[next].classList.add('segment-button-after-checked');
          }
        }
      }, {
        key: "setNextIndex",
        value: function setNextIndex(detail) {
          var _this6 = this;

          var isEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var isRTL = document.dir === 'rtl';
          var activated = this.activated;
          var buttons = this.getButtons();
          var index = buttons.findIndex(function (button) {
            return button.value === _this6.value;
          });
          var previous = buttons[index];
          var current;
          var nextIndex;

          if (index === -1) {
            return;
          } // Get the element that the touch event started on in case
          // it was the checked button, then we will move the indicator


          var rect = previous.getBoundingClientRect();
          var left = rect.left;
          var width = rect.width; // Get the element that the gesture is on top of based on the currentX of the
          // gesture event and the Y coordinate of the starting element, since the gesture
          // can move up and down off of the segment

          var currentX = detail.currentX;
          var previousY = rect.top + rect.height / 2;
          var nextEl = document.elementFromPoint(currentX, previousY);
          var decreaseIndex = isRTL ? currentX > left + width : currentX < left;
          var increaseIndex = isRTL ? currentX < left : currentX > left + width; // If the indicator is currently activated then we have started the gesture
          // on top of the checked button so we need to slide the indicator
          // by checking the button next to it as we move

          if (activated && !isEnd) {
            // Decrease index, move left in LTR & right in RTL
            if (decreaseIndex) {
              var newIndex = index - 1;

              if (newIndex >= 0) {
                nextIndex = newIndex;
              } // Increase index, moves right in LTR & left in RTL

            } else if (increaseIndex) {
              if (activated && !isEnd) {
                var _newIndex = index + 1;

                if (_newIndex < buttons.length) {
                  nextIndex = _newIndex;
                }
              }
            }

            if (nextIndex !== undefined && !buttons[nextIndex].disabled) {
              current = buttons[nextIndex];
            }
          } // If the indicator is not activated then we will just set the indicator
          // to the element where the gesture ended


          if (!activated && isEnd) {
            current = nextEl;
          }
          /* tslint:disable-next-line */


          if (current != null) {
            /**
             * If current element is ion-segment then that means
             * user tried to select a disabled ion-segment-button,
             * and we should not update the ripple.
             */
            if (current.tagName === 'ION-SEGMENT') {
              return false;
            }

            if (previous !== current) {
              this.checkButton(previous, current);
            }
          }

          return true;
        }
      }, {
        key: "emitStyle",
        value: function emitStyle() {
          this.ionStyle.emit({
            'segment': true
          });
        }
      }, {
        key: "render",
        value: function render() {
          var _Object$assign;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            onClick: this.onClick,
            "class": Object.assign(Object.assign({}, Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["c"])(this.color)), (_Object$assign = {}, _defineProperty(_Object$assign, mode, true), _defineProperty(_Object$assign, 'in-toolbar', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["h"])('ion-toolbar', this.el)), _defineProperty(_Object$assign, 'in-toolbar-color', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["h"])('ion-toolbar[color]', this.el)), _defineProperty(_Object$assign, 'segment-activated', this.activated), _defineProperty(_Object$assign, 'segment-disabled', this.disabled), _defineProperty(_Object$assign, 'segment-scrollable', this.scrollable), _Object$assign))
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null));
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
            "value": ["valueChanged"],
            "disabled": ["disabledChanged"]
          };
        }
      }, {
        key: "style",
        get: function get() {
          return ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family,inherit);text-align:center;contain:paint}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:scroll}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:transparent}:host(.segment-scrollable) ::slotted(ion-segment-button){min-width:90px}";
        }
      }]);

      return Segment;
    }();

    var ids = 0;

    var SegmentButton = /*#__PURE__*/function () {
      function SegmentButton(hostRef) {
        var _this7 = this;

        _classCallCheck(this, SegmentButton);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.segmentEl = null;
        this.checked = false;
        /**
         * If `true`, the user cannot interact with the segment button.
         */

        this.disabled = false;
        /**
         * Set the layout of the text and icon in the segment.
         */

        this.layout = 'icon-top';
        /**
         * The type of the button.
         */

        this.type = 'button';
        /**
         * The value of the segment button.
         */

        this.value = 'ion-sb-' + ids++;

        this.updateState = function () {
          if (_this7.segmentEl) {
            _this7.checked = _this7.segmentEl.value === _this7.value;
          }
        };
      }

      _createClass(SegmentButton, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          var segmentEl = this.segmentEl = this.el.closest('ion-segment');

          if (segmentEl) {
            this.updateState();
            segmentEl.addEventListener('ionSelect', this.updateState);
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          var segmentEl = this.segmentEl;

          if (segmentEl) {
            segmentEl.removeEventListener('ionSelect', this.updateState);
            this.segmentEl = null;
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _class;

          var checked = this.checked,
              type = this.type,
              disabled = this.disabled,
              hasIcon = this.hasIcon,
              hasLabel = this.hasLabel,
              layout = this.layout;
          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "aria-disabled": disabled ? 'true' : null,
            "class": (_class = {}, _defineProperty(_class, mode, true), _defineProperty(_class, 'in-toolbar', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["h"])('ion-toolbar', this.el)), _defineProperty(_class, 'in-toolbar-color', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["h"])('ion-toolbar[color]', this.el)), _defineProperty(_class, 'in-segment', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["h"])('ion-segment', this.el)), _defineProperty(_class, 'in-segment-color', Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["h"])('ion-segment[color]', this.el)), _defineProperty(_class, 'segment-button-has-label', hasLabel), _defineProperty(_class, 'segment-button-has-icon', hasIcon), _defineProperty(_class, 'segment-button-has-label-only', hasLabel && !hasIcon), _defineProperty(_class, 'segment-button-has-icon-only', hasIcon && !hasLabel), _defineProperty(_class, 'segment-button-disabled', disabled), _defineProperty(_class, 'segment-button-checked', checked), _defineProperty(_class, "segment-button-layout-".concat(layout), true), _defineProperty(_class, 'ion-activatable', true), _defineProperty(_class, 'ion-activatable-instant', true), _defineProperty(_class, 'ion-focusable', true), _class)
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
            type: type,
            "aria-pressed": checked ? 'true' : null,
            "class": "button-native",
            disabled: disabled
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
            "class": "button-inner"
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("slot", null)), mode === 'md' && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("ion-ripple-effect", null)), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            part: "indicator",
            "class": {
              'segment-button-indicator': true,
              'segment-button-indicator-animated': true
            }
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            part: "indicator-background",
            "class": "segment-button-indicator-background"
          })));
        }
      }, {
        key: "hasLabel",
        get: function get() {
          return !!this.el.querySelector('ion-label');
        }
      }, {
        key: "hasIcon",
        get: function get() {
          return !!this.el.querySelector('ion-icon');
        }
      }, {
        key: "el",
        get: function get() {
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["e"])(this);
        }
      }], [{
        key: "style",
        get: function get() {
          return ":host{--color:initial;--color-hover:var(--color);--color-checked:var(--color);--color-disabled:var(--color);--padding-start:0;--padding-end:0;border-radius:var(--border-radius);-ms-flex:1 1 auto;flex:1 1 auto;-ms-flex-direction:column;flex-direction:column;background:var(--background);color:var(--color);text-decoration:none;text-overflow:ellipsis;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none;cursor:pointer}.button-native,:host{display:-ms-flexbox;display:flex;position:relative;height:auto}.button-native{border-radius:0;font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:var(--margin-start);margin-right:var(--margin-end);margin-top:var(--margin-top);margin-bottom:var(--margin-bottom);padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-webkit-transform:translateZ(0);transform:translateZ(0);-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-positive:1;flex-grow:1;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;min-width:inherit;max-width:inherit;min-height:inherit;max-height:inherit;-webkit-transition:var(--transition);transition:var(--transition);border:none;outline:none;background:transparent;contain:content;pointer-events:none;overflow:hidden;z-index:2}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.button-native{margin-left:unset;margin-right:unset;-webkit-margin-start:var(--margin-start);margin-inline-start:var(--margin-start);-webkit-margin-end:var(--margin-end);margin-inline-end:var(--margin-end);padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.button-native:after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:inherit;flex-flow:inherit;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;z-index:1}:host(.segment-button-checked){background:var(--background-checked);color:var(--color-checked)}:host(.segment-button-disabled){cursor:default;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native:after{background:var(--background-focused);opacity:var(--background-focused-opacity)}\@media (any-hover:hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native:after{background:var(--background-hover);opacity:var(--background-hover-opacity)}:host(.segment-button-checked:hover) .button-native{color:var(--color-checked)}}::slotted(ion-icon){-ms-flex-negative:0;flex-shrink:0;-ms-flex-order:-1;order:-1;pointer-events:none}::slotted(ion-label){display:block;-ms-flex-item-align:center;align-self:center;line-height:22px;text-overflow:ellipsis;white-space:nowrap;-webkit-box-sizing:border-box;box-sizing:border-box;pointer-events:none}:host(.segment-button-layout-icon-top) .button-native{-ms-flex-direction:column;flex-direction:column}:host(.segment-button-layout-icon-start) .button-native{-ms-flex-direction:row;flex-direction:row}:host(.segment-button-layout-icon-end) .button-native{-ms-flex-direction:row-reverse;flex-direction:row-reverse}:host(.segment-button-layout-icon-bottom) .button-native{-ms-flex-direction:column-reverse;flex-direction:column-reverse}:host(.segment-button-layout-icon-hide) ::slotted(ion-icon),:host(.segment-button-layout-label-hide) ::slotted(ion-label){display:none}ion-ripple-effect{color:var(--ripple-color,var(--color-checked))}.segment-button-indicator{-webkit-transform-origin:left;transform-origin:left;position:absolute;opacity:0;-webkit-box-sizing:border-box;box-sizing:border-box;will-change:transform,opacity;pointer-events:none}.segment-button-indicator-background{width:100%;height:var(--indicator-height);-webkit-transform:var(--indicator-transform);transform:var(--indicator-transform);-webkit-box-shadow:var(--indicator-box-shadow);box-shadow:var(--indicator-box-shadow);pointer-events:none}.segment-button-indicator-animated{-webkit-transition:var(--indicator-transition);transition:var(--indicator-transition)}:host(.segment-button-checked) .segment-button-indicator{opacity:1}\@media (prefers-reduced-motion:reduce){.segment-button-indicator-background{-webkit-transform:none;transform:none}.segment-button-indicator-animated{-webkit-transition:none;transition:none}}:host{--background:none;--background-checked:none;--background-hover:var(--color-checked);--background-focused:var(--color-checked);--background-activated-opacity:0;--background-focused-opacity:.12;--background-hover-opacity:.04;--color:rgba(var(--ion-text-color-rgb,0,0,0),0.6);--color-checked:var(--ion-color-primary,#3880ff);--indicator-box-shadow:none;--indicator-color:var(--color-checked);--indicator-height:2px;--indicator-transition:transform 250ms cubic-bezier(0.4,0,0.2,1);--indicator-transform:none;--padding-top:0;--padding-end:16px;--padding-bottom:0;--padding-start:16px;--transition:color 0.15s linear 0s,opacity 0.15s linear 0s;min-width:90px;max-width:360px;min-height:48px;border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);font-size:14px;font-weight:500;letter-spacing:.06em;line-height:40px;text-transform:uppercase}:host(.segment-button-disabled){opacity:.3}:host(.in-segment-color){background:none;color:rgba(var(--ion-text-color-rgb,0,0,0),.6)}:host(.in-segment-color) ion-ripple-effect{color:var(--ion-color-base)}:host(.in-segment-color) .segment-button-indicator-background{background:var(--ion-color-base)}:host(.in-segment-color.segment-button-checked) .button-native{color:var(--ion-color-base)}:host(.in-segment-color.ion-focused) .button-native:after{background:var(--ion-color-base)}\@media (any-hover:hover){:host(.in-segment-color:hover) .button-native{color:rgba(var(--ion-text-color-rgb,0,0,0),.6)}:host(.in-segment-color:hover) .button-native:after{background:var(--ion-color-base)}:host(.in-segment-color.segment-button-checked:hover) .button-native{color:var(--ion-color-base)}}:host(.in-toolbar:not(.in-segment-color)){--background:var(--ion-toolbar-segment-background,none);--background-checked:var(--ion-toolbar-segment-background-checked,none);--color:var(--ion-toolbar-segment-color,rgba(var(--ion-text-color-rgb,0,0,0),0.6));--color-checked:var(--ion-toolbar-segment-color-checked,var(--ion-color-primary,#3880ff));--indicator-color:var(--ion-toolbar-segment-color-checked,var(--color-checked))}:host(.in-toolbar-color:not(.in-segment-color)) .button-native{color:rgba(var(--ion-color-contrast-rgb),.6)}:host(.in-toolbar-color.segment-button-checked:not(.in-segment-color)) .button-native{color:var(--ion-color-contrast)}\@media (any-hover:hover){:host(.in-toolbar-color:not(.in-segment-color)) .button-native:after{background:var(--ion-color-contrast)}}::slotted(ion-icon){font-size:24px}::slotted(ion-icon),::slotted(ion-label){margin-top:12px;margin-bottom:12px}:host(.segment-button-layout-icon-bottom) ::slotted(ion-icon),:host(.segment-button-layout-icon-top) ::slotted(ion-label){margin-top:0}:host(.segment-button-layout-icon-bottom) ::slotted(ion-label),:host(.segment-button-layout-icon-top) ::slotted(ion-icon){margin-bottom:0}:host(.segment-button-layout-icon-start) ::slotted(ion-label){margin-left:8px;margin-right:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.segment-button-layout-icon-start) ::slotted(ion-label){margin-left:unset;margin-right:unset;-webkit-margin-start:8px;margin-inline-start:8px;-webkit-margin-end:0;margin-inline-end:0}}:host(.segment-button-layout-icon-end) ::slotted(ion-label){margin-left:0;margin-right:8px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.segment-button-layout-icon-end) ::slotted(ion-label){margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:8px;margin-inline-end:8px}}:host(.segment-button-has-icon-only) ::slotted(ion-icon),:host(.segment-button-has-label-only) ::slotted(ion-label){margin-top:12px;margin-bottom:12px}.segment-button-indicator{left:0;right:0;bottom:0}.segment-button-indicator-background{background:var(--indicator-color)}:host(.in-toolbar:not(.in-segment-color)) .segment-button-indicator-background{background:var(--ion-toolbar-segment-indicator-color,var(--indicator-color))}:host(.in-toolbar-color:not(.in-segment-color)) .segment-button-indicator-background{background:var(--ion-color-contrast)}";
        }
      }]);

      return SegmentButton;
    }();
    /***/

  }
}]);
//# sourceMappingURL=58-es5.js.map