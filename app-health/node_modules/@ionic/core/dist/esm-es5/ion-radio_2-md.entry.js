import { __awaiter, __generator } from "tslib";
import { r as registerInstance, d as createEvent, c as getIonMode, h, H as Host, e as getElement } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';
import { f as findItemLabel } from './helpers-46f4a262.js';
import { c as createColorClasses, h as hostContext } from './theme-18cbe2cc.js';
var Radio = /** @class */ (function () {
    function Radio(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.inputId = "ion-rb-" + radioButtonIds++;
        this.radioGroup = null;
        /**
         * If `true`, the radio is selected.
         */
        this.checked = false;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        /**
         * If `true`, the user cannot interact with the radio.
         */
        this.disabled = false;
        this.updateState = function () {
            if (_this.radioGroup) {
                _this.checked = _this.radioGroup.value === _this.value;
            }
        };
        this.onFocus = function () {
            _this.ionFocus.emit();
        };
        this.onBlur = function () {
            _this.ionBlur.emit();
        };
        this.ionStyle = createEvent(this, "ionStyle", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
    }
    Radio.prototype.connectedCallback = function () {
        if (this.value === undefined) {
            this.value = this.inputId;
        }
        var radioGroup = this.radioGroup = this.el.closest('ion-radio-group');
        if (radioGroup) {
            this.updateState();
            radioGroup.addEventListener('ionChange', this.updateState);
        }
    };
    Radio.prototype.disconnectedCallback = function () {
        var radioGroup = this.radioGroup;
        if (radioGroup) {
            radioGroup.removeEventListener('ionChange', this.updateState);
            this.radioGroup = null;
        }
    };
    Radio.prototype.componentWillLoad = function () {
        this.emitStyle();
    };
    Radio.prototype.emitStyle = function () {
        this.ionStyle.emit({
            'radio-checked': this.checked,
            'interactive-disabled': this.disabled,
        });
    };
    Radio.prototype.render = function () {
        var _a;
        var _b = this, inputId = _b.inputId, disabled = _b.disabled, checked = _b.checked, color = _b.color, el = _b.el;
        var mode = getIonMode(this);
        var labelId = inputId + '-lbl';
        var label = findItemLabel(el);
        if (label) {
            label.id = labelId;
        }
        return (h(Host, { role: "radio", "aria-disabled": disabled ? 'true' : null, "aria-checked": "" + checked, "aria-labelledby": labelId, class: Object.assign(Object.assign({}, createColorClasses(color)), (_a = {}, _a[mode] = true, _a['in-item'] = hostContext('ion-item', el), _a['interactive'] = true, _a['radio-checked'] = checked, _a['radio-disabled'] = disabled, _a)) }, h("div", { class: "radio-icon" }, h("div", { class: "radio-inner" })), h("button", { type: "button", onFocus: this.onFocus, onBlur: this.onBlur, disabled: disabled })));
    };
    Object.defineProperty(Radio.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Radio, "watchers", {
        get: function () {
            return {
                "color": ["emitStyle"],
                "checked": ["emitStyle"],
                "disabled": ["emitStyle"]
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Radio, "style", {
        get: function () { return ":host{--inner-border-radius:50%;display:inline-block;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}:host(.radio-disabled){pointer-events:none}.radio-icon{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:layout size style}.radio-icon,button{width:100%;height:100%}button{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none}:host-context([dir=rtl]) button,[dir=rtl] button{left:unset;right:unset;right:0}button::-moz-focus-inner{border:0}.radio-icon,.radio-inner{-webkit-box-sizing:border-box;box-sizing:border-box}:host{--color:var(--ion-color-step-400,#999);--color-checked:var(--ion-color-primary,#3880ff);--border-width:2px;--border-style:solid;--border-radius:50%;width:20px;height:20px}:host(.ion-color) .radio-inner{background:var(--ion-color-base)}:host(.ion-color.radio-checked) .radio-icon{border-color:var(--ion-color-base)}.radio-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;border-radius:var(--border-radius);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--color)}.radio-inner{border-radius:var(--inner-border-radius);width:calc(50% + var(--border-width));height:calc(50% + var(--border-width));-webkit-transform:scale3d(0,0,0);transform:scale3d(0,0,0);-webkit-transition:-webkit-transform .28s cubic-bezier(.4,0,.2,1);transition:-webkit-transform .28s cubic-bezier(.4,0,.2,1);transition:transform .28s cubic-bezier(.4,0,.2,1);transition:transform .28s cubic-bezier(.4,0,.2,1),-webkit-transform .28s cubic-bezier(.4,0,.2,1);background:var(--color-checked)}:host(.radio-checked) .radio-icon{border-color:var(--color-checked)}:host(.radio-checked) .radio-inner{-webkit-transform:scaleX(1);transform:scaleX(1)}:host(.radio-disabled){opacity:.3}:host(.ion-focused) .radio-icon:after{border-radius:var(--inner-border-radius);left:-12px;top:-12px;display:block;position:absolute;width:36px;height:36px;background:var(--ion-color-primary-tint,#4c8dff);content:\"\";opacity:.2}:host-context([dir=rtl]).ion-focused .radio-icon:after,:host-context([dir=rtl]):host(.ion-focused) .radio-icon:after{left:unset;right:unset;right:-12px}:host(.in-item){margin-left:0;margin-right:0;margin-top:9px;margin-bottom:9px;display:block;position:static}:host(.in-item[slot=start]){margin-left:4px;margin-right:36px;margin-top:11px;margin-bottom:10px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.in-item[slot=start]){margin-left:unset;margin-right:unset;-webkit-margin-start:4px;margin-inline-start:4px;-webkit-margin-end:36px;margin-inline-end:36px}}"; },
        enumerable: true,
        configurable: true
    });
    return Radio;
}());
var radioButtonIds = 0;
var RadioGroup = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.inputId = "ion-rg-" + radioGroupIds++;
        this.labelId = this.inputId + "-lbl";
        /**
         * If `true`, the radios can be deselected.
         */
        this.allowEmptySelection = false;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        this.onClick = function (ev) {
            var selectedRadio = ev.target && ev.target.closest('ion-radio');
            if (selectedRadio) {
                var currentValue = _this.value;
                var newValue = selectedRadio.value;
                if (newValue !== currentValue) {
                    _this.value = newValue;
                }
                else if (_this.allowEmptySelection) {
                    _this.value = undefined;
                }
            }
        };
        this.ionChange = createEvent(this, "ionChange", 7);
    }
    class_1.prototype.valueChanged = function (value) {
        this.ionChange.emit({ value: value });
    };
    class_1.prototype.connectedCallback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var el, header, label;
            return __generator(this, function (_a) {
                el = this.el;
                header = el.querySelector('ion-list-header') || el.querySelector('ion-item-divider');
                if (header) {
                    label = header.querySelector('ion-label');
                    if (label) {
                        this.labelId = label.id = this.name + '-lbl';
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    class_1.prototype.render = function () {
        return (h(Host, { role: "radiogroup", "aria-labelledby": this.labelId, onClick: this.onClick, class: getIonMode(this) }));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "value": ["valueChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var radioGroupIds = 0;
export { Radio as ion_radio, RadioGroup as ion_radio_group };
