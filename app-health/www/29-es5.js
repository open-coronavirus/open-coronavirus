function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[29], {
  /***/
  "./node_modules/@ionic/core/dist/esm/ion-input-md.entry.js":
  /*!*****************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/ion-input-md.entry.js ***!
    \*****************************************************************/

  /*! exports provided: ion_input */

  /***/
  function node_modulesIonicCoreDistEsmIonInputMdEntryJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ion_input", function () {
      return Input;
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

    var Input = /*#__PURE__*/function () {
      function Input(hostRef) {
        var _this = this;

        _classCallCheck(this, Input);

        Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        this.inputId = "ion-input-".concat(inputIds++);
        this.didBlurAfterEdit = false;
        this.hasFocus = false;
        /**
         * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
         */

        this.autocapitalize = 'off';
        /**
         * Indicates whether the value of the control can be automatically completed by the browser.
         */

        this.autocomplete = 'off';
        /**
         * Whether auto correction should be enabled when the user is entering/editing the text value.
         */

        this.autocorrect = 'off';
        /**
         * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
         */

        this.autofocus = false;
        /**
         * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
         */

        this.clearInput = false;
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
         */

        this.debounce = 0;
        /**
         * If `true`, the user cannot interact with the input.
         */

        this.disabled = false;
        /**
         * The name of the control, which is submitted with the form data.
         */

        this.name = this.inputId;
        /**
         * If `true`, the user cannot modify the value.
         */

        this.readonly = false;
        /**
         * If `true`, the user must fill in a value before submitting a form.
         */

        this.required = false;
        /**
         * If `true`, the element will have its spelling and grammar checked.
         */

        this.spellcheck = false;
        /**
         * The type of control to display. The default type is text.
         */

        this.type = 'text';
        /**
         * The value of the input.
         */

        this.value = '';

        this.onInput = function (ev) {
          var input = ev.target;

          if (input) {
            _this.value = input.value || '';
          }

          _this.ionInput.emit(ev);
        };

        this.onBlur = function () {
          _this.hasFocus = false;

          _this.focusChanged();

          _this.emitStyle();

          _this.ionBlur.emit();
        };

        this.onFocus = function () {
          _this.hasFocus = true;

          _this.focusChanged();

          _this.emitStyle();

          _this.ionFocus.emit();
        };

        this.onKeydown = function (ev) {
          if (_this.shouldClearOnEdit()) {
            // Did the input value change after it was blurred and edited?
            // Do not clear if user is hitting Enter to submit form
            if (_this.didBlurAfterEdit && _this.hasValue() && ev.key !== 'Enter') {
              // Clear the input
              _this.clearTextInput();
            } // Reset the flag


            _this.didBlurAfterEdit = false;
          }
        };

        this.clearTextInput = function (ev) {
          if (_this.clearInput && !_this.readonly && !_this.disabled && ev) {
            ev.preventDefault();
            ev.stopPropagation();
          }

          _this.value = '';
          /**
           * This is needed for clearOnEdit
           * Otherwise the value will not be cleared
           * if user is inside the input
           */

          if (_this.nativeInput) {
            _this.nativeInput.value = '';
          }
        };

        this.ionInput = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionInput", 7);
        this.ionChange = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionChange", 7);
        this.ionBlur = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionBlur", 7);
        this.ionFocus = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionFocus", 7);
        this.ionInputDidLoad = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionInputDidLoad", 7);
        this.ionInputDidUnload = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionInputDidUnload", 7);
        this.ionStyle = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["d"])(this, "ionStyle", 7);
      }

      _createClass(Input, [{
        key: "debounceChanged",
        value: function debounceChanged() {
          this.ionChange = Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["d"])(this.ionChange, this.debounce);
        }
      }, {
        key: "disabledChanged",
        value: function disabledChanged() {
          this.emitStyle();
        }
        /**
         * Update the native input element when the value changes
         */

      }, {
        key: "valueChanged",
        value: function valueChanged() {
          this.emitStyle();
          this.ionChange.emit({
            value: this.value == null ? this.value : this.value.toString()
          });
        }
      }, {
        key: "connectedCallback",
        value: function connectedCallback() {
          this.emitStyle();
          this.debounceChanged();
          {
            this.el.dispatchEvent(new CustomEvent('ionInputDidLoad', {
              detail: this.el
            }));
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          {
            document.dispatchEvent(new CustomEvent('ionInputDidUnload', {
              detail: this.el
            }));
          }
        }
        /**
         * Sets focus on the specified `ion-input`. Use this method instead of the global
         * `input.focus()`.
         */

      }, {
        key: "setFocus",
        value: function () {
          var _setFocus = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (this.nativeInput) {
                      this.nativeInput.focus();
                    }

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function setFocus() {
            return _setFocus.apply(this, arguments);
          }

          return setFocus;
        }()
        /**
         * Returns the native `<input>` element used under the hood.
         */

      }, {
        key: "getInputElement",
        value: function getInputElement() {
          return Promise.resolve(this.nativeInput);
        }
      }, {
        key: "shouldClearOnEdit",
        value: function shouldClearOnEdit() {
          var type = this.type,
              clearOnEdit = this.clearOnEdit;
          return clearOnEdit === undefined ? type === 'password' : clearOnEdit;
        }
      }, {
        key: "getValue",
        value: function getValue() {
          return typeof this.value === 'number' ? this.value.toString() : (this.value || '').toString();
        }
      }, {
        key: "emitStyle",
        value: function emitStyle() {
          this.ionStyle.emit({
            'interactive': true,
            'input': true,
            'has-placeholder': this.placeholder != null,
            'has-value': this.hasValue(),
            'has-focus': this.hasFocus,
            'interactive-disabled': this.disabled
          });
        }
      }, {
        key: "focusChanged",
        value: function focusChanged() {
          // If clearOnEdit is enabled and the input blurred but has a value, set a flag
          if (!this.hasFocus && this.shouldClearOnEdit() && this.hasValue()) {
            this.didBlurAfterEdit = true;
          }
        }
      }, {
        key: "hasValue",
        value: function hasValue() {
          return this.getValue().length > 0;
        }
      }, {
        key: "render",
        value: function render() {
          var _Object$assign,
              _this2 = this;

          var mode = Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["c"])(this);
          var value = this.getValue();
          var labelId = this.inputId + '-lbl';
          var label = Object(_helpers_46f4a262_js__WEBPACK_IMPORTED_MODULE_2__["f"])(this.el);

          if (label) {
            label.id = labelId;
          }

          return Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["H"], {
            "aria-disabled": this.disabled ? 'true' : null,
            "class": Object.assign(Object.assign({}, Object(_theme_18cbe2cc_js__WEBPACK_IMPORTED_MODULE_3__["c"])(this.color)), (_Object$assign = {}, _defineProperty(_Object$assign, mode, true), _defineProperty(_Object$assign, 'has-value', this.hasValue()), _defineProperty(_Object$assign, 'has-focus', this.hasFocus), _Object$assign))
          }, Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
            "class": "native-input",
            ref: function ref(input) {
              return _this2.nativeInput = input;
            },
            "aria-labelledby": labelId,
            disabled: this.disabled,
            accept: this.accept,
            autoCapitalize: this.autocapitalize,
            autoComplete: this.autocomplete,
            autoCorrect: this.autocorrect,
            autoFocus: this.autofocus,
            inputMode: this.inputmode,
            min: this.min,
            max: this.max,
            minLength: this.minlength,
            maxLength: this.maxlength,
            multiple: this.multiple,
            name: this.name,
            pattern: this.pattern,
            placeholder: this.placeholder || '',
            readOnly: this.readonly,
            required: this.required,
            spellCheck: this.spellcheck,
            step: this.step,
            size: this.size,
            type: this.type,
            value: value,
            onInput: this.onInput,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            onKeyDown: this.onKeydown
          }), this.clearInput && !this.readonly && !this.disabled && Object(_core_0a8d4d2e_js__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
            type: "button",
            "class": "input-clear-icon",
            tabindex: "-1",
            onTouchStart: this.clearTextInput,
            onMouseDown: this.clearTextInput
          }));
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
            "debounce": ["debounceChanged"],
            "disabled": ["disabledChanged"],
            "value": ["valueChanged"]
          };
        }
      }, {
        key: "style",
        get: function get() {
          return ".sc-ion-input-md-h{--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:.5;--padding-top:0;--padding-bottom:0;--padding-start:0;--background:transparent;--color:initial;display:-ms-flexbox;display:flex;position:relative;-ms-flex:1;flex:1;-ms-flex-align:center;align-items:center;width:100%;padding:0!important;background:var(--background);color:var(--color);font-family:var(--ion-font-family,inherit);z-index:2}ion-item.sc-ion-input-md-h:not(.item-label), ion-item:not(.item-label) .sc-ion-input-md-h{--padding-start:0}.ion-color.sc-ion-input-md-h{color:var(--ion-color-base)}.native-input.sc-ion-input-md{border-radius:var(--border-radius);padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:inline-block;-ms-flex:1;flex:1;width:100%;max-width:100%;max-height:100%;border:0;outline:none;background:transparent;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.native-input.sc-ion-input-md{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.native-input.sc-ion-input-md::-webkit-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-input.sc-ion-input-md::-moz-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-input.sc-ion-input-md:-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-input.sc-ion-input-md::-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-input.sc-ion-input-md::placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-input.sc-ion-input-md:-webkit-autofill{background-color:transparent}.native-input.sc-ion-input-md:invalid{-webkit-box-shadow:none;box-shadow:none}.native-input.sc-ion-input-md::-ms-clear{display:none}.native-input[disabled].sc-ion-input-md{opacity:.4}.cloned-input.sc-ion-input-md{left:0;top:0;position:absolute;pointer-events:none}[dir=rtl].sc-ion-input-md-h .cloned-input.sc-ion-input-md, [dir=rtl] .sc-ion-input-md-h .cloned-input.sc-ion-input-md, [dir=rtl].sc-ion-input-md .cloned-input.sc-ion-input-md{left:unset;right:unset;right:0}.input-clear-icon.sc-ion-input-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;background-position:50%;border:0;outline:none;background-color:transparent;background-repeat:no-repeat;visibility:hidden;-webkit-appearance:none;-moz-appearance:none;appearance:none}.has-focus.has-value.sc-ion-input-md-h .input-clear-icon.sc-ion-input-md{visibility:visible}.has-focus.sc-ion-input-md-h{pointer-events:none}.has-focus.sc-ion-input-md-h a.sc-ion-input-md, .has-focus.sc-ion-input-md-h button.sc-ion-input-md, .has-focus.sc-ion-input-md-h input.sc-ion-input-md{pointer-events:auto}.sc-ion-input-md-h{--padding-top:10px;--padding-end:0;--padding-bottom:10px;--padding-start:8px;font-size:inherit}.item-label-floating.sc-ion-input-md-h, .item-label-floating .sc-ion-input-md-h, .item-label-stacked.sc-ion-input-md-h, .item-label-stacked .sc-ion-input-md-h{--padding-top:8px;--padding-bottom:8px;--padding-start:0}.input-clear-icon.sc-ion-input-md{background-image:url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20512%20512\'><polygon%20fill=\'var(--ion-color-step-600,%20%23666666)\'%20points=\'405,136.798%20375.202,107%20256,226.202%20136.798,107%20107,136.798%20226.202,256%20107,375.202%20136.798,405%20256,285.798%20375.202,405%20405,375.202%20285.798,256\'/></svg>\");width:30px;height:30px;background-size:22px}";
        }
      }]);

      return Input;
    }();

    var inputIds = 0;
    /***/
  }
}]);
//# sourceMappingURL=29-es5.js.map