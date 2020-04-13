function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[39], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-modal-md.entry.js":
  /*!*****************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-modal-md.entry.js ***!
    \*****************************************************************/

  /*! exports provided: ion_modal */

  /***/
  function node_modulesIonicCoreDistEsmIonModalMdEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_modal", function () {
      return Modal;
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


    var _cubic_bezier_1d592096_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./cubic-bezier-1d592096.js */
    "./node_modules/@ionic/core/dist/esm/cubic-bezier-1d592096.js");
    /* harmony import */


    var _index_c38df685_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./index-c38df685.js */
    "./node_modules/@ionic/core/dist/esm/index-c38df685.js");
    /* harmony import */


    var _constants_3c3e1099_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./constants-3c3e1099.js */
    "./node_modules/@ionic/core/dist/esm/constants-3c3e1099.js");
    /* harmony import */


    var _hardware_back_button_1ed0083a_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./hardware-back-button-1ed0083a.js */
    "./node_modules/@ionic/core/dist/esm/hardware-back-button-1ed0083a.js");
    /* harmony import */


    var _overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./overlays-e336664a.js */
    "./node_modules/@ionic/core/dist/esm/overlays-e336664a.js");
    /* harmony import */


    var _theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ./theme-18cbe2cc.js */
    "./node_modules/@ionic/core/dist/esm/theme-18cbe2cc.js");
    /* harmony import */


    var _framework_delegate_c2e2e1f4_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ./framework-delegate-c2e2e1f4.js */
    "./node_modules/@ionic/core/dist/esm/framework-delegate-c2e2e1f4.js");
    /* harmony import */


    var _index_1469ea79_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ./index-1469ea79.js */
    "./node_modules/@ionic/core/dist/esm/index-1469ea79.js"); // Defaults for the card swipe animation


    var SwipeToCloseDefaults = {
      MIN_PRESENTING_SCALE: 0.93
    };

    var createSwipeToCloseGesture = function createSwipeToCloseGesture(el, animation, onDismiss) {
      var height = el.offsetHeight;
      var isOpen = false;

      var canStart = function canStart(detail) {
        var target = detail.event.target;

        if (target === null || !target.closest) {
          return true;
        }

        var content = target.closest('ion-content');

        if (content === null) {
          return true;
        } // Target is in the content so we don't start the gesture.
        // We could be more nuanced here and allow it for content that
        // does not need to scroll.


        return false;
      };

      var onStart = function onStart() {
        animation.progressStart(true, isOpen ? 1 : 0);
      };

      var onMove = function onMove(detail) {
        var step = detail.deltaY / height;

        if (step < 0) {
          return;
        }

        animation.progressStep(step);
      };

      var onEnd = function onEnd(detail) {
        var velocity = detail.velocityY;
        var step = detail.deltaY / height;

        if (step < 0) {
          return;
        }

        var threshold = (detail.deltaY + velocity * 1000) / height;
        var shouldComplete = threshold >= 0.5;
        var newStepValue = shouldComplete ? -0.001 : 0.001;

        if (!shouldComplete) {
          animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
          newStepValue += Object(_cubic_bezier_1d592096_js__WEBPACK_IMPORTED_MODULE_4__["g"])([0, 0], [1, 0], [0.68, 0.28], [1, 1], step)[0];
        } else {
          animation.easing('cubic-bezier(0.32, 0.72, 0, 1)');
          newStepValue += Object(_cubic_bezier_1d592096_js__WEBPACK_IMPORTED_MODULE_4__["g"])([0, 0], [0.32, 0.72], [0, 1], [1, 1], step)[0];
        }

        var duration = shouldComplete ? computeDuration(step * height, velocity) : computeDuration((1 - step) * height, velocity);
        isOpen = shouldComplete;
        gesture.enable(false);
        animation.onFinish(function () {
          if (!shouldComplete) {
            gesture.enable(true);
          }
        }).progressEnd(shouldComplete ? 1 : 0, newStepValue, duration);

        if (shouldComplete) {
          onDismiss();
        }
      };

      var gesture = Object(_index_c38df685_js__WEBPACK_IMPORTED_MODULE_5__["createGesture"])({
        el: el,
        gestureName: 'modalSwipeToClose',
        gesturePriority: 40,
        direction: 'y',
        threshold: 10,
        canStart: canStart,
        onStart: onStart,
        onMove: onMove,
        onEnd: onEnd
      });
      return gesture;
    };

    var computeDuration = function computeDuration(remaining, velocity) {
      return Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["c"])(400, remaining / Math.abs(velocity * 1.1), 500);
    };
    /**
     * iOS Modal Enter Animation for the Card presentation style
     */


    var iosEnterAnimation = function iosEnterAnimation(baseEl, presentingEl) {
      // The top translate Y for the presenting element
      var backdropAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(baseEl.querySelector('ion-backdrop')).fromTo('opacity', 0.01, 'var(--backdrop-opacity)').beforeStyles({
        'pointer-events': 'none'
      }).afterClearStyles(['pointer-events']);
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(baseEl.querySelector('.modal-wrapper')).beforeStyles({
        'opacity': 1
      }).fromTo('transform', 'translateY(100vh)', 'translateY(0vh)');
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(baseEl).easing('cubic-bezier(0.32,0.72,0,1)').duration(500).beforeAddClass('show-modal').addAnimation([backdropAnimation, wrapperAnimation]);

      if (presentingEl) {
        /**
         * Fallback for browsers that does not support `max()` (ex: Firefox)
         * No need to wrry about statusbar padding since engines like Gecko
         * are not used as the engine for standlone Cordova/Capacitor apps
         */
        var transformOffset = !CSS.supports('width', 'max(0px, 1px)') ? '30px' : 'max(30px, var(--ion-safe-area-top))';
        var modalTransform = presentingEl.tagName === 'ION-MODAL' && presentingEl.presentingElement !== undefined ? '-10px' : transformOffset;
        var bodyEl = document.body;
        var toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
        var finalTransform = "translateY(".concat(modalTransform, ") scale(").concat(toPresentingScale, ")");
        var presentingAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().beforeStyles({
          'transform': 'translateY(0)',
          'transform-origin': 'top center',
          'overflow': 'hidden'
        }).afterStyles({
          'transform': finalTransform
        }).beforeAddWrite(function () {
          return bodyEl.style.setProperty('background-color', 'black');
        }).addElement(presentingEl).keyframes([{
          offset: 0,
          filter: 'contrast(1)',
          transform: 'translateY(0px) scale(1)',
          borderRadius: '0px'
        }, {
          offset: 1,
          filter: 'contrast(0.85)',
          transform: finalTransform,
          borderRadius: '10px 10px 0 0'
        }]);
        baseAnimation.addAnimation(presentingAnimation);
      }

      return baseAnimation;
    };
    /**
     * iOS Modal Leave Animation
     */


    var iosLeaveAnimation = function iosLeaveAnimation(baseEl, presentingEl) {
      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
      var backdropAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(baseEl.querySelector('ion-backdrop')).fromTo('opacity', 'var(--backdrop-opacity)', 0.0);
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(baseEl.querySelector('.modal-wrapper')).beforeStyles({
        'opacity': 1
      }).fromTo('transform', 'translateY(0vh)', 'translateY(100vh)');
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(baseEl).easing('cubic-bezier(0.32,0.72,0,1)').duration(duration).addAnimation([backdropAnimation, wrapperAnimation]);

      if (presentingEl) {
        var transformOffset = !CSS.supports('width', 'max(0px, 1px)') ? '30px' : 'max(30px, var(--ion-safe-area-top))';
        var modalTransform = presentingEl.tagName === 'ION-MODAL' && presentingEl.presentingElement !== undefined ? '-10px' : transformOffset;
        var bodyEl = document.body;
        var currentPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
        var presentingAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])().addElement(presentingEl).beforeClearStyles(['transform']).afterClearStyles(['transform']).onFinish(function (currentStep) {
          // only reset background color if this is the last card-style modal
          if (currentStep !== 1) {
            return;
          }

          presentingEl.style.setProperty('overflow', '');
          var numModals = Array.from(bodyEl.querySelectorAll('ion-modal')).filter(function (m) {
            return m.presentingElement !== undefined;
          }).length;

          if (numModals <= 1) {
            bodyEl.style.setProperty('background-color', '');
          }
        }).keyframes([{
          offset: 0,
          filter: 'contrast(0.85)',
          transform: "translateY(".concat(modalTransform, ") scale(").concat(currentPresentingScale, ")"),
          borderRadius: '10px 10px 0 0'
        }, {
          offset: 1,
          filter: 'contrast(1)',
          transform: 'translateY(0px) scale(1)',
          borderRadius: '0px'
        }]);
        baseAnimation.addAnimation(presentingAnimation);
      }

      return baseAnimation;
    };
    /**
     * Md Modal Enter Animation
     */


    var mdEnterAnimation = function mdEnterAnimation(baseEl) {
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var backdropAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      backdropAnimation.addElement(baseEl.querySelector('ion-backdrop')).fromTo('opacity', 0.01, 'var(--backdrop-opacity)').beforeStyles({
        'pointer-events': 'none'
      }).afterClearStyles(['pointer-events']);
      wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper')).keyframes([{
        offset: 0,
        opacity: 0.01,
        transform: 'translateY(40px)'
      }, {
        offset: 1,
        opacity: 1,
        transform: 'translateY(0px)'
      }]);
      return baseAnimation.addElement(baseEl).easing('cubic-bezier(0.36,0.66,0.04,1)').duration(280).beforeAddClass('show-modal').addAnimation([backdropAnimation, wrapperAnimation]);
    };
    /**
     * Md Modal Leave Animation
     */


    var mdLeaveAnimation = function mdLeaveAnimation(baseEl) {
      var baseAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var backdropAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var wrapperEl = baseEl.querySelector('.modal-wrapper');
      backdropAnimation.addElement(baseEl.querySelector('ion-backdrop')).fromTo('opacity', 'var(--backdrop-opacity)', 0.0);
      wrapperAnimation.addElement(wrapperEl).keyframes([{
        offset: 0,
        opacity: 0.99,
        transform: 'translateY(0px)'
      }, {
        offset: 1,
        opacity: 0,
        transform: 'translateY(40px)'
      }]);
      return baseAnimation.addElement(baseEl).easing('cubic-bezier(0.47,0,0.745,0.715)').duration(200).addAnimation([backdropAnimation, wrapperAnimation]);
    };

    var Modal = /*#__PURE__*/function () {
      function Modal(hostRef) {
        var _this = this;

        _classCallCheck(this, Modal);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef); // Whether or not modal is being dismissed via gesture

        this.gestureAnimationDismissing = false;
        this.presented = false;
        this.mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */

        this.keyboardClose = true;
        /**
         * If `true`, the modal will be dismissed when the backdrop is clicked.
         */

        this.backdropDismiss = true;
        /**
         * If `true`, a backdrop will be displayed behind the modal.
         */

        this.showBackdrop = true;
        /**
         * If `true`, the modal will animate.
         */

        this.animated = true;
        /**
         * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
         */

        this.swipeToClose = false;

        this.onBackdropTap = function () {
          _this.dismiss(undefined, _overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["B"]);
        };

        this.onDismiss = function (ev) {
          ev.stopPropagation();
          ev.preventDefault();

          _this.dismiss();
        };

        this.onLifecycle = function (modalEvent) {
          var el = _this.usersElement;
          var name = LIFECYCLE_MAP[modalEvent.type];

          if (el && name) {
            var ev = new CustomEvent(name, {
              bubbles: false,
              cancelable: false,
              detail: modalEvent.detail
            });
            el.dispatchEvent(ev);
          }
        };

        Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["d"])(this.el);
        this.didPresent = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionModalDidPresent", 7);
        this.willPresent = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionModalWillPresent", 7);
        this.willDismiss = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionModalWillDismiss", 7);
        this.didDismiss = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionModalDidDismiss", 7);
      }
      /**
       * Present the modal overlay after it has been created.
       */


      _createClass(Modal, [{
        key: "present",
        value: function () {
          var _present = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _this2 = this;

            var container, componentProps, mode, animationBuilder, ani;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!this.presented) {
                      _context2.next = 2;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 2:
                    container = this.el.querySelector(".modal-wrapper");

                    if (container) {
                      _context2.next = 5;
                      break;
                    }

                    throw new Error('container is undefined');

                  case 5:
                    componentProps = Object.assign(Object.assign({}, this.componentProps), {
                      modal: this.el
                    });
                    _context2.next = 8;
                    return Object(_framework_delegate_c2e2e1f4_js__WEBPACK_IMPORTED_MODULE_10__["a"])(this.delegate, container, this.component, ['ion-page'], componentProps);

                  case 8:
                    this.usersElement = _context2.sent;
                    _context2.next = 11;
                    return Object(_index_1469ea79_js__WEBPACK_IMPORTED_MODULE_11__["d"])(this.usersElement);

                  case 11:
                    _context2.next = 13;
                    return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["e"])(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, this.presentingElement);

                  case 13:
                    mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);

                    if (this.swipeToClose && mode === 'ios') {
                      // All of the elements needed for the swipe gesture
                      // should be in the DOM and referenced by now, except
                      // for the presenting el
                      animationBuilder = this.leaveAnimation || _config_3c7f3790_js__WEBPACK_IMPORTED_MODULE_1__["b"].get('modalLeave', iosLeaveAnimation);
                      ani = this.animation = animationBuilder(this.el, this.presentingElement);
                      this.gesture = createSwipeToCloseGesture(this.el, ani, function () {
                        /**
                         * While the gesture animation is finishing
                         * it is possible for a user to tap the backdrop.
                         * This would result in the dismiss animation
                         * being played again. Typically this is avoided
                         * by setting `presented = false` on the overlay
                         * component; however, we cannot do that here as
                         * that would prevent the element from being
                         * removed from the DOM.
                         */
                        _this2.gestureAnimationDismissing = true;

                        _this2.animation.onFinish( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return _this2.dismiss(undefined, 'gesture');

                                case 2:
                                  _this2.gestureAnimationDismissing = false;

                                case 3:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));
                      });
                      this.gesture.enable(true);
                    }

                  case 15:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function present() {
            return _present.apply(this, arguments);
          }

          return present;
        }()
        /**
         * Dismiss the modal overlay after it has been presented.
         *
         * @param data Any data to emit in the dismiss events.
         * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
         */

      }, {
        key: "dismiss",
        value: function () {
          var _dismiss = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, role) {
            var enteringAnimation, dismissed;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!(this.gestureAnimationDismissing && role !== 'gesture')) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt("return", false);

                  case 2:
                    enteringAnimation = _overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["h"].get(this) || [];
                    _context3.next = 5;
                    return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["f"])(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation, this.presentingElement);

                  case 5:
                    dismissed = _context3.sent;

                    if (!dismissed) {
                      _context3.next = 11;
                      break;
                    }

                    _context3.next = 9;
                    return Object(_framework_delegate_c2e2e1f4_js__WEBPACK_IMPORTED_MODULE_10__["d"])(this.delegate, this.usersElement);

                  case 9:
                    if (this.animation) {
                      this.animation.destroy();
                    }

                    enteringAnimation.forEach(function (ani) {
                      return ani.destroy();
                    });

                  case 11:
                    this.animation = undefined;
                    return _context3.abrupt("return", dismissed);

                  case 13:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          function dismiss(_x, _x2) {
            return _dismiss.apply(this, arguments);
          }

          return dismiss;
        }()
        /**
         * Returns a promise that resolves when the modal did dismiss.
         */

      }, {
        key: "onDidDismiss",
        value: function onDidDismiss() {
          return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["g"])(this.el, 'ionModalDidDismiss');
        }
        /**
         * Returns a promise that resolves when the modal will dismiss.
         */

      }, {
        key: "onWillDismiss",
        value: function onWillDismiss() {
          return Object(_overlays_e336664a_js__WEBPACK_IMPORTED_MODULE_8__["g"])(this.el, 'ionModalWillDismiss');
        }
      }, {
        key: "render",
        value: function render() {
          var _Object$assign;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "no-router": true,
            "aria-modal": "true",
            "class": Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, mode, true), _defineProperty(_Object$assign, "modal-card", this.presentingElement !== undefined && mode === 'ios'), _Object$assign), Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_9__["g"])(this.cssClass)),
            style: {
              zIndex: "".concat(20000 + this.overlayIndex)
            },
            onIonBackdropTap: this.onBackdropTap,
            onIonDismiss: this.onDismiss,
            onIonModalDidPresent: this.onLifecycle,
            onIonModalWillPresent: this.onLifecycle,
            onIonModalWillDismiss: this.onLifecycle,
            onIonModalDidDismiss: this.onLifecycle
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("ion-backdrop", {
            visible: this.showBackdrop,
            tappable: this.backdropDismiss
          }), Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
            role: "dialog",
            "class": "modal-wrapper"
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
          return ".sc-ion-modal-md-h{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color,#fff);--box-shadow:none;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:strict}.overlay-hidden.sc-ion-modal-md-h{display:none}.modal-wrapper.sc-ion-modal-md{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}\@media only screen and (min-width:768px) and (min-height:600px){.sc-ion-modal-md-h{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}\@media only screen and (min-width:768px) and (min-height:768px){.sc-ion-modal-md-h{--width:600px;--height:600px}}.sc-ion-modal-md-h{--backdrop-opacity:var(--ion-backdrop-opacity,0.32)}\@media only screen and (min-width:768px) and (min-height:600px){.sc-ion-modal-md-h{--border-radius:2px;--box-shadow:0 28px 48px rgba(0,0,0,0.4)}}.modal-wrapper.sc-ion-modal-md{-webkit-transform:translate3d(0,40px,0);transform:translate3d(0,40px,0);opacity:.01}";
        }
      }]);

      return Modal;
    }();

    var LIFECYCLE_MAP = {
      'ionModalDidPresent': 'ionViewDidEnter',
      'ionModalWillPresent': 'ionViewWillEnter',
      'ionModalWillDismiss': 'ionViewWillLeave',
      'ionModalDidDismiss': 'ionViewDidLeave'
    };
    /***/
  }
}]);
//# sourceMappingURL=39-es5.js.map