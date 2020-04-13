function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["ios-transition-b4752795-js"], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ios.transition-b4752795.js":
  /*!**********************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ios.transition-b4752795.js ***!
    \**********************************************************************/

  /*! exports provided: iosTransitionAnimation, shadow */

  /***/
  function node_modulesIonicCoreDistEsmIosTransitionB4752795Js(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "iosTransitionAnimation", function () {
      return iosTransitionAnimation;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "shadow", function () {
      return shadow;
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


    var _constants_3c3e1099_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./constants-3c3e1099.js */
    "./node_modules/@ionic/core/dist/esm/constants-3c3e1099.js");
    /* harmony import */


    var _index_1469ea79_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./index-1469ea79.js */
    "./node_modules/@ionic/core/dist/esm/index-1469ea79.js");

    var DURATION = 540;

    var getClonedElement = function getClonedElement(tagName) {
      return document.querySelector("".concat(tagName, ".ion-cloned-element"));
    };

    var shadow = function shadow(el) {
      return el.shadowRoot || el;
    };

    var getLargeTitle = function getLargeTitle(refEl) {
      var tabs = refEl.tagName === 'ION-TABS' ? refEl : refEl.querySelector('ion-tabs');
      var query = 'ion-header:not(.header-collapse-condense-inactive) ion-title[size=large]';

      if (tabs != null) {
        var activeTab = tabs.querySelector('ion-tab:not(.tab-hidden), .ion-page:not(.ion-page-hidden)');
        return activeTab.querySelector(query);
      }

      return refEl.querySelector(query);
    };

    var getBackButton = function getBackButton(refEl, backDirection) {
      var tabs = refEl.tagName === 'ION-TABS' ? refEl : refEl.querySelector('ion-tabs');
      var buttonsList = [];

      if (tabs != null) {
        var activeTab = tabs.querySelector('ion-tab:not(.tab-hidden), .ion-page:not(.ion-page-hidden)');
        buttonsList = activeTab.querySelectorAll('ion-buttons');
      } else {
        buttonsList = refEl.querySelectorAll('ion-buttons');
      }

      var _iterator = _createForOfIteratorHelper(buttonsList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var buttons = _step.value;
          var parentHeader = buttons.closest('ion-header');
          var activeHeader = parentHeader && !parentHeader.classList.contains('header-collapse-condense-inactive');
          var backButton = buttons.querySelector('ion-back-button');
          var buttonsCollapse = buttons.classList.contains('buttons-collapse');
          var startSlot = buttons.slot === 'start' || buttons.slot === '';

          if (backButton !== null && startSlot && (buttonsCollapse && activeHeader && backDirection || !buttonsCollapse)) {
            return backButton;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    };

    var createLargeTitleTransition = function createLargeTitleTransition(rootAnimation, rtl, backDirection, enteringEl, leavingEl) {
      var enteringBackButton = getBackButton(enteringEl, backDirection);
      var leavingLargeTitle = getLargeTitle(leavingEl);
      var enteringLargeTitle = getLargeTitle(enteringEl);
      var leavingBackButton = getBackButton(leavingEl, backDirection);
      var shouldAnimationForward = enteringBackButton !== null && leavingLargeTitle !== null && !backDirection;
      var shouldAnimationBackward = enteringLargeTitle !== null && leavingBackButton !== null && backDirection;

      if (shouldAnimationForward) {
        var leavingLargeTitleBox = leavingLargeTitle.getBoundingClientRect();
        var enteringBackButtonBox = enteringBackButton.getBoundingClientRect();
        animateLargeTitle(rootAnimation, rtl, backDirection, leavingLargeTitle, leavingLargeTitleBox, enteringBackButtonBox);
        animateBackButton(rootAnimation, rtl, backDirection, enteringBackButton, leavingLargeTitleBox, enteringBackButtonBox);
      } else if (shouldAnimationBackward) {
        var enteringLargeTitleBox = enteringLargeTitle.getBoundingClientRect();
        var leavingBackButtonBox = leavingBackButton.getBoundingClientRect();
        animateLargeTitle(rootAnimation, rtl, backDirection, enteringLargeTitle, enteringLargeTitleBox, leavingBackButtonBox);
        animateBackButton(rootAnimation, rtl, backDirection, leavingBackButton, enteringLargeTitleBox, leavingBackButtonBox);
      }

      return {
        forward: shouldAnimationForward,
        backward: shouldAnimationBackward
      };
    };

    var animateBackButton = function animateBackButton(rootAnimation, rtl, backDirection, backButtonEl, largeTitleBox, backButtonBox) {
      var BACK_BUTTON_START_OFFSET = rtl ? "calc(100% - ".concat(backButtonBox.right + 4, "px)") : "".concat(backButtonBox.left - 4, "px");
      var START_TEXT_TRANSLATE = rtl ? '7px' : '-7px';
      var END_TEXT_TRANSLATE = rtl ? '-4px' : '4px';
      var ICON_TRANSLATE = rtl ? '-4px' : '4px';
      var TEXT_ORIGIN_X = rtl ? 'right' : 'left';
      var ICON_ORIGIN_X = rtl ? 'left' : 'right';
      var FORWARD_TEXT_KEYFRAMES = [{
        offset: 0,
        opacity: 0,
        transform: "translate3d(".concat(START_TEXT_TRANSLATE, ", ").concat(largeTitleBox.top - 40, "px, 0) scale(2.1)")
      }, {
        offset: 1,
        opacity: 1,
        transform: "translate3d(".concat(END_TEXT_TRANSLATE, ", ").concat(backButtonBox.top - 46, "px, 0) scale(1)")
      }];
      var BACKWARD_TEXT_KEYFRAMES = [{
        offset: 0,
        opacity: 1,
        transform: "translate3d(".concat(END_TEXT_TRANSLATE, ", ").concat(backButtonBox.top - 46, "px, 0) scale(1)")
      }, {
        offset: 0.6,
        opacity: 0
      }, {
        offset: 1,
        opacity: 0,
        transform: "translate3d(".concat(START_TEXT_TRANSLATE, ", ").concat(largeTitleBox.top - 40, "px, 0) scale(2.1)")
      }];
      var TEXT_KEYFRAMES = backDirection ? BACKWARD_TEXT_KEYFRAMES : FORWARD_TEXT_KEYFRAMES;
      var FORWARD_ICON_KEYFRAMES = [{
        offset: 0,
        opacity: 0,
        transform: "translate3d(".concat(ICON_TRANSLATE, ", ").concat(backButtonBox.top - 41, "px, 0) scale(0.6)")
      }, {
        offset: 1,
        opacity: 1,
        transform: "translate3d(".concat(ICON_TRANSLATE, ", ").concat(backButtonBox.top - 46, "px, 0) scale(1)")
      }];
      var BACKWARD_ICON_KEYFRAMES = [{
        offset: 0,
        opacity: 1,
        transform: "translate3d(".concat(ICON_TRANSLATE, ", ").concat(backButtonBox.top - 46, "px, 0) scale(1)")
      }, {
        offset: 0.2,
        opacity: 0,
        transform: "translate3d(".concat(ICON_TRANSLATE, ", ").concat(backButtonBox.top - 41, "px, 0) scale(0.6)")
      }, {
        offset: 1,
        opacity: 0,
        transform: "translate3d(".concat(ICON_TRANSLATE, ", ").concat(backButtonBox.top - 41, "px, 0) scale(0.6)")
      }];
      var ICON_KEYFRAMES = backDirection ? BACKWARD_ICON_KEYFRAMES : FORWARD_ICON_KEYFRAMES;
      var enteringBackButtonTextAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var enteringBackButtonIconAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      var clonedBackButtonEl = getClonedElement('ion-back-button');
      var backButtonTextEl = shadow(clonedBackButtonEl).querySelector('.button-text');
      var backButtonIconEl = shadow(clonedBackButtonEl).querySelector('ion-icon');
      clonedBackButtonEl.text = backButtonEl.text;
      clonedBackButtonEl.mode = backButtonEl.mode;
      clonedBackButtonEl.icon = backButtonEl.icon;
      clonedBackButtonEl.color = backButtonEl.color;
      clonedBackButtonEl.disabled = backButtonEl.disabled;
      clonedBackButtonEl.style.setProperty('display', 'block');
      clonedBackButtonEl.style.setProperty('position', 'fixed');
      enteringBackButtonIconAnimation.addElement(backButtonIconEl);
      enteringBackButtonTextAnimation.addElement(backButtonTextEl);
      enteringBackButtonTextAnimation.beforeStyles({
        'transform-origin': "".concat(TEXT_ORIGIN_X, " center")
      }).beforeAddWrite(function () {
        backButtonEl.style.setProperty('display', 'none');
        clonedBackButtonEl.style.setProperty(TEXT_ORIGIN_X, BACK_BUTTON_START_OFFSET);
      }).afterAddWrite(function () {
        backButtonEl.style.setProperty('display', '');
        clonedBackButtonEl.style.setProperty('display', 'none');
        clonedBackButtonEl.style.removeProperty(TEXT_ORIGIN_X);
      }).keyframes(TEXT_KEYFRAMES);
      enteringBackButtonIconAnimation.beforeStyles({
        'transform-origin': "".concat(ICON_ORIGIN_X, " center")
      }).keyframes(ICON_KEYFRAMES);
      rootAnimation.addAnimation([enteringBackButtonTextAnimation, enteringBackButtonIconAnimation]);
    };

    var animateLargeTitle = function animateLargeTitle(rootAnimation, rtl, backDirection, largeTitleEl, largeTitleBox, backButtonBox) {
      var TITLE_START_OFFSET = rtl ? "calc(100% - ".concat(largeTitleBox.right, "px)") : "".concat(largeTitleBox.left, "px");
      var START_TRANSLATE = rtl ? '-18px' : '18px';
      var ORIGIN_X = rtl ? 'right' : 'left';
      var BACKWARDS_KEYFRAMES = [{
        offset: 0,
        opacity: 0,
        transform: "translate3d(".concat(START_TRANSLATE, ", ").concat(backButtonBox.top - 4, "px, 0) scale(0.49)")
      }, {
        offset: 0.1,
        opacity: 0
      }, {
        offset: 1,
        opacity: 1,
        transform: "translate3d(0, ".concat(largeTitleBox.top - 2, "px, 0) scale(1)")
      }];
      var FORWARDS_KEYFRAMES = [{
        offset: 0,
        opacity: 0.99,
        transform: "translate3d(0, ".concat(largeTitleBox.top - 2, "px, 0) scale(1)")
      }, {
        offset: 0.6,
        opacity: 0
      }, {
        offset: 1,
        opacity: 0,
        transform: "translate3d(".concat(START_TRANSLATE, ", ").concat(backButtonBox.top - 4, "px, 0) scale(0.5)")
      }];
      var KEYFRAMES = backDirection ? BACKWARDS_KEYFRAMES : FORWARDS_KEYFRAMES;
      var clonedTitleEl = getClonedElement('ion-title');
      var clonedLargeTitleAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
      clonedTitleEl.innerText = largeTitleEl.innerText;
      clonedTitleEl.size = largeTitleEl.size;
      clonedTitleEl.color = largeTitleEl.color;
      clonedLargeTitleAnimation.addElement(clonedTitleEl);
      clonedLargeTitleAnimation.beforeStyles(_defineProperty({
        'transform-origin': "".concat(ORIGIN_X, " center"),
        'height': '46px',
        'display': '',
        'position': 'relative'
      }, ORIGIN_X, TITLE_START_OFFSET)).beforeAddWrite(function () {
        largeTitleEl.style.setProperty('display', 'none');
      }).afterAddWrite(function () {
        largeTitleEl.style.setProperty('display', '');
        clonedTitleEl.style.setProperty('display', 'none');
      }).keyframes(KEYFRAMES);
      rootAnimation.addAnimation(clonedLargeTitleAnimation);
    };

    var iosTransitionAnimation = function iosTransitionAnimation(navEl, opts) {
      try {
        var EASING = 'cubic-bezier(0.32,0.72,0,1)';
        var OPACITY = 'opacity';
        var TRANSFORM = 'transform';
        var CENTER = '0%';
        var OFF_OPACITY = 0.8;
        var isRTL = navEl.ownerDocument.dir === 'rtl';
        var OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
        var OFF_LEFT = isRTL ? '33%' : '-33%';
        var enteringEl = opts.enteringEl;
        var leavingEl = opts.leavingEl;
        var backDirection = opts.direction === 'back';
        var contentEl = enteringEl.querySelector(':scope > ion-content');
        var headerEls = enteringEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *');
        var enteringToolBarEls = enteringEl.querySelectorAll(':scope > ion-header > ion-toolbar');
        var rootAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
        var enteringContentAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
        rootAnimation.addElement(enteringEl).duration(opts.duration || DURATION).easing(opts.easing || EASING).fill('both').beforeRemoveClass('ion-page-invisible');

        if (leavingEl && navEl) {
          var navDecorAnimation = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          navDecorAnimation.addElement(navEl);
          rootAnimation.addAnimation(navDecorAnimation);
        }

        if (!contentEl && enteringToolBarEls.length === 0 && headerEls.length === 0) {
          enteringContentAnimation.addElement(enteringEl.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs')); // REVIEW
        } else {
          enteringContentAnimation.addElement(contentEl); // REVIEW

          enteringContentAnimation.addElement(headerEls);
        }

        rootAnimation.addAnimation(enteringContentAnimation);

        if (backDirection) {
          enteringContentAnimation.beforeClearStyles([OPACITY]).fromTo('transform', "translateX(".concat(OFF_LEFT, ")"), "translateX(".concat(CENTER, ")")).fromTo(OPACITY, OFF_OPACITY, 1);
        } else {
          // entering content, forward direction
          enteringContentAnimation.beforeClearStyles([OPACITY]).fromTo('transform', "translateX(".concat(OFF_RIGHT, ")"), "translateX(".concat(CENTER, ")"));
        }

        if (contentEl) {
          var enteringTransitionEffectEl = shadow(contentEl).querySelector('.transition-effect');

          if (enteringTransitionEffectEl) {
            var enteringTransitionCoverEl = enteringTransitionEffectEl.querySelector('.transition-cover');
            var enteringTransitionShadowEl = enteringTransitionEffectEl.querySelector('.transition-shadow');
            var enteringTransitionEffect = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            var enteringTransitionCover = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            var enteringTransitionShadow = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            enteringTransitionEffect.addElement(enteringTransitionEffectEl).beforeStyles({
              opacity: '1',
              display: 'block'
            }).afterStyles({
              opacity: '',
              display: ''
            });
            enteringTransitionCover.addElement(enteringTransitionCoverEl) // REVIEW
            .beforeClearStyles([OPACITY]).fromTo(OPACITY, 0, 0.1);
            enteringTransitionShadow.addElement(enteringTransitionShadowEl) // REVIEW
            .beforeClearStyles([OPACITY]).fromTo(OPACITY, 0.03, 0.70);
            enteringTransitionEffect.addAnimation([enteringTransitionCover, enteringTransitionShadow]);
            enteringContentAnimation.addAnimation([enteringTransitionEffect]);
          }
        }

        var enteringContentHasLargeTitle = enteringEl.querySelector('ion-header.header-collapse-condense');

        var _createLargeTitleTran = createLargeTitleTransition(rootAnimation, isRTL, backDirection, enteringEl, leavingEl),
            forward = _createLargeTitleTran.forward,
            backward = _createLargeTitleTran.backward;

        enteringToolBarEls.forEach(function (enteringToolBarEl) {
          var enteringToolBar = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          enteringToolBar.addElement(enteringToolBarEl);
          rootAnimation.addAnimation(enteringToolBar);
          var enteringTitle = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          enteringTitle.addElement(enteringToolBarEl.querySelector('ion-title')); // REVIEW

          var enteringToolBarButtons = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          var buttons = Array.from(enteringToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));
          var parentHeader = enteringToolBarEl.closest('ion-header');
          var inactiveHeader = parentHeader && parentHeader.classList.contains('header-collapse-condense-inactive');
          var buttonsToAnimate;

          if (backDirection) {
            buttonsToAnimate = buttons.filter(function (button) {
              var isCollapseButton = button.classList.contains('buttons-collapse');
              return isCollapseButton && !inactiveHeader || !isCollapseButton;
            });
          } else {
            buttonsToAnimate = buttons.filter(function (button) {
              return !button.classList.contains('buttons-collapse');
            });
          }

          enteringToolBarButtons.addElement(buttonsToAnimate);
          var enteringToolBarItems = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          enteringToolBarItems.addElement(enteringToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])'));
          var enteringToolBarBg = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          enteringToolBarBg.addElement(shadow(enteringToolBarEl).querySelector('.toolbar-background')); // REVIEW

          var enteringBackButton = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          var backButtonEl = enteringToolBarEl.querySelector('ion-back-button');

          if (backButtonEl) {
            enteringBackButton.addElement(backButtonEl);
          }

          enteringToolBar.addAnimation([enteringTitle, enteringToolBarButtons, enteringToolBarItems, enteringToolBarBg, enteringBackButton]);
          enteringToolBarButtons.fromTo(OPACITY, 0.01, 1);
          enteringToolBarItems.fromTo(OPACITY, 0.01, 1);

          if (backDirection) {
            if (!inactiveHeader) {
              enteringTitle.fromTo('transform', "translateX(".concat(OFF_LEFT, ")"), "translateX(".concat(CENTER, ")")).fromTo(OPACITY, 0.01, 1);
            }

            enteringToolBarItems.fromTo('transform', "translateX(".concat(OFF_LEFT, ")"), "translateX(".concat(CENTER, ")")); // back direction, entering page has a back button

            enteringBackButton.fromTo(OPACITY, 0.01, 1);
          } else {
            // entering toolbar, forward direction
            if (!enteringContentHasLargeTitle) {
              enteringTitle.fromTo('transform', "translateX(".concat(OFF_RIGHT, ")"), "translateX(".concat(CENTER, ")")).fromTo(OPACITY, 0.01, 1);
            }

            enteringToolBarItems.fromTo('transform', "translateX(".concat(OFF_RIGHT, ")"), "translateX(".concat(CENTER, ")"));
            enteringToolBarBg.beforeClearStyles([OPACITY, 'transform']);
            var translucentHeader = parentHeader === null || parentHeader === void 0 ? void 0 : parentHeader.translucent;

            if (!translucentHeader) {
              enteringToolBarBg.fromTo(OPACITY, 0.01, 1);
            } else {
              enteringToolBarBg.fromTo('transform', isRTL ? 'translateX(-100%)' : 'translateX(100%)', 'translateX(0px)');
            } // forward direction, entering page has a back button


            if (!forward) {
              enteringBackButton.fromTo(OPACITY, 0.01, 1);
            }

            if (backButtonEl && !forward) {
              var enteringBackBtnText = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
              enteringBackBtnText.addElement(shadow(backButtonEl).querySelector('.button-text')) // REVIEW
              .fromTo("transform", isRTL ? 'translateX(-100px)' : 'translateX(100px)', 'translateX(0px)');
              enteringToolBar.addAnimation(enteringBackBtnText);
            }
          }
        }); // setup leaving view

        if (leavingEl) {
          var leavingContent = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
          var leavingContentEl = leavingEl.querySelector(':scope > ion-content');
          leavingContent.addElement(leavingContentEl); // REVIEW

          leavingContent.addElement(leavingEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *'));
          rootAnimation.addAnimation(leavingContent);

          if (backDirection) {
            // leaving content, back direction
            leavingContent.beforeClearStyles([OPACITY]).fromTo('transform', "translateX(".concat(CENTER, ")"), isRTL ? 'translateX(-100%)' : 'translateX(100%)');
            var leavingPage = Object(_index_1469ea79_js__WEBPACK_IMPORTED_MODULE_5__["g"])(leavingEl);
            rootAnimation.afterAddWrite(function () {
              if (rootAnimation.getDirection() === 'normal') {
                leavingPage.style.setProperty('display', 'none');
              }
            });
          } else {
            // leaving content, forward direction
            leavingContent.fromTo('transform', "translateX(".concat(CENTER, ")"), "translateX(".concat(OFF_LEFT, ")")).fromTo(OPACITY, 1, OFF_OPACITY);
          }

          if (leavingContentEl) {
            var leavingTransitionEffectEl = shadow(leavingContentEl).querySelector('.transition-effect');

            if (leavingTransitionEffectEl) {
              var leavingTransitionCoverEl = leavingTransitionEffectEl.querySelector('.transition-cover');
              var leavingTransitionShadowEl = leavingTransitionEffectEl.querySelector('.transition-shadow');
              var leavingTransitionEffect = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
              var leavingTransitionCover = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
              var leavingTransitionShadow = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
              leavingTransitionEffect.addElement(leavingTransitionEffectEl).beforeStyles({
                opacity: '1',
                display: 'block'
              }).afterStyles({
                opacity: '',
                display: ''
              });
              leavingTransitionCover.addElement(leavingTransitionCoverEl) // REVIEW
              .beforeClearStyles([OPACITY]).fromTo(OPACITY, 0.1, 0);
              leavingTransitionShadow.addElement(leavingTransitionShadowEl) // REVIEW
              .beforeClearStyles([OPACITY]).fromTo(OPACITY, 0.70, 0.03);
              leavingTransitionEffect.addAnimation([leavingTransitionCover, leavingTransitionShadow]);
              leavingContent.addAnimation([leavingTransitionEffect]);
            }
          }

          var leavingToolBarEls = leavingEl.querySelectorAll(':scope > ion-header > ion-toolbar');
          leavingToolBarEls.forEach(function (leavingToolBarEl) {
            var leavingToolBar = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            leavingToolBar.addElement(leavingToolBarEl);
            var leavingTitle = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            leavingTitle.addElement(leavingToolBarEl.querySelector('ion-title')); // REVIEW

            var leavingToolBarButtons = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            var buttons = leavingToolBarEl.querySelectorAll('ion-buttons,[menuToggle]');
            var parentHeader = leavingToolBarEl.closest('ion-header');
            var inactiveHeader = parentHeader && parentHeader.classList.contains('header-collapse-condense-inactive');
            var buttonsToAnimate = Array.from(buttons).filter(function (button) {
              var isCollapseButton = button.classList.contains('buttons-collapse');
              return isCollapseButton && !inactiveHeader || !isCollapseButton;
            });
            leavingToolBarButtons.addElement(buttonsToAnimate);
            var leavingToolBarItems = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            var leavingToolBarItemEls = leavingToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])');

            if (leavingToolBarItemEls.length > 0) {
              leavingToolBarItems.addElement(leavingToolBarItemEls);
            }

            var leavingToolBarBg = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            leavingToolBarBg.addElement(shadow(leavingToolBarEl).querySelector('.toolbar-background')); // REVIEW

            var leavingBackButton = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
            var backButtonEl = leavingToolBarEl.querySelector('ion-back-button');

            if (backButtonEl) {
              leavingBackButton.addElement(backButtonEl);
            }

            leavingToolBar.addAnimation([leavingTitle, leavingToolBarButtons, leavingToolBarItems, leavingBackButton, leavingToolBarBg]);
            rootAnimation.addAnimation(leavingToolBar); // fade out leaving toolbar items

            leavingBackButton.fromTo(OPACITY, 0.99, 0);
            leavingToolBarButtons.fromTo(OPACITY, 0.99, 0);
            leavingToolBarItems.fromTo(OPACITY, 0.99, 0);

            if (backDirection) {
              if (!inactiveHeader) {
                // leaving toolbar, back direction
                leavingTitle.fromTo('transform', "translateX(".concat(CENTER, ")"), isRTL ? 'translateX(-100%)' : 'translateX(100%)').fromTo(OPACITY, 0.99, 0);
              }

              leavingToolBarItems.fromTo('transform', "translateX(".concat(CENTER, ")"), isRTL ? 'translateX(-100%)' : 'translateX(100%)');
              leavingToolBarBg.beforeClearStyles([OPACITY, 'transform']); // leaving toolbar, back direction, and there's no entering toolbar
              // should just slide out, no fading out

              var translucentHeader = parentHeader === null || parentHeader === void 0 ? void 0 : parentHeader.translucent;

              if (!translucentHeader) {
                leavingToolBarBg.fromTo(OPACITY, 0.99, 0);
              } else {
                leavingToolBarBg.fromTo('transform', 'translateX(0px)', isRTL ? 'translateX(-100%)' : 'translateX(100%)');
              }

              if (backButtonEl && !backward) {
                var leavingBackBtnText = Object(_animation_56279521_js__WEBPACK_IMPORTED_MODULE_3__["c"])();
                leavingBackBtnText.addElement(shadow(backButtonEl).querySelector('.button-text')) // REVIEW
                .fromTo('transform', "translateX(".concat(CENTER, ")"), "translateX(".concat((isRTL ? -124 : 124) + 'px', ")"));
                leavingToolBar.addAnimation(leavingBackBtnText);
              }
            } else {
              // leaving toolbar, forward direction
              if (!inactiveHeader) {
                leavingTitle.fromTo('transform', "translateX(".concat(CENTER, ")"), "translateX(".concat(OFF_LEFT, ")")).fromTo(OPACITY, 0.99, 0).afterClearStyles([TRANSFORM, OPACITY]);
              }

              leavingToolBarItems.fromTo('transform', "translateX(".concat(CENTER, ")"), "translateX(".concat(OFF_LEFT, ")")).afterClearStyles([TRANSFORM, OPACITY]);
              leavingBackButton.afterClearStyles([OPACITY]);
              leavingTitle.afterClearStyles([OPACITY]);
              leavingToolBarButtons.afterClearStyles([OPACITY]);
            }
          });
        }

        return rootAnimation;
      } catch (err) {
        throw err;
      }
    };
    /***/

  }
}]);
//# sourceMappingURL=ios-transition-b4752795-js-es5.js.map