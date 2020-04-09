import { __awaiter, __generator } from "tslib";
import { r as registerInstance, d as createEvent, c as getIonMode, h, H as Host, e as getElement } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';
import { c as clamp, d as debounceEvent, a as renderHiddenInput } from './helpers-46f4a262.js';
import { c as createColorClasses, h as hostContext } from './theme-18cbe2cc.js';
var Range = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.noUpdate = false;
        this.hasFocus = false;
        this.ratioA = 0;
        this.ratioB = 0;
        /**
         * How long, in milliseconds, to wait to trigger the
         * `ionChange` event after each change in the range value.
         */
        this.debounce = 0;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = '';
        /**
         * Show two knobs.
         */
        this.dualKnobs = false;
        /**
         * Minimum integer value of the range.
         */
        this.min = 0;
        /**
         * Maximum integer value of the range.
         */
        this.max = 100;
        /**
         * If `true`, a pin with integer value is shown when the knob
         * is pressed.
         */
        this.pin = false;
        /**
         * If `true`, the knob snaps to tick marks evenly spaced based
         * on the step property value.
         */
        this.snaps = false;
        /**
         * Specifies the value granularity.
         */
        this.step = 1;
        /**
         * If `true`, tick marks are displayed based on the step value.
         * Only applies when `snaps` is `true`.
         */
        this.ticks = true;
        /**
         * If `true`, the user cannot interact with the range.
         */
        this.disabled = false;
        /**
         * the value of the range.
         */
        this.value = 0;
        this.clampBounds = function (value) {
            return clamp(_this.min, value, _this.max);
        };
        this.ensureValueInBounds = function (value) {
            if (_this.dualKnobs) {
                return {
                    lower: _this.clampBounds(value.lower),
                    upper: _this.clampBounds(value.upper)
                };
            }
            else {
                return _this.clampBounds(value);
            }
        };
        this.handleKeyboard = function (knob, isIncrease) {
            var step = _this.step;
            step = step > 0 ? step : 1;
            step = step / (_this.max - _this.min);
            if (!isIncrease) {
                step *= -1;
            }
            if (knob === 'A') {
                _this.ratioA = clamp(0, _this.ratioA + step, 1);
            }
            else {
                _this.ratioB = clamp(0, _this.ratioB + step, 1);
            }
            _this.updateValue();
        };
        this.onBlur = function () {
            if (_this.hasFocus) {
                _this.hasFocus = false;
                _this.ionBlur.emit();
                _this.emitStyle();
            }
        };
        this.onFocus = function () {
            if (!_this.hasFocus) {
                _this.hasFocus = true;
                _this.ionFocus.emit();
                _this.emitStyle();
            }
        };
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
    }
    class_1.prototype.debounceChanged = function () {
        this.ionChange = debounceEvent(this.ionChange, this.debounce);
    };
    class_1.prototype.minChanged = function () {
        if (!this.noUpdate) {
            this.updateRatio();
        }
    };
    class_1.prototype.maxChanged = function () {
        if (!this.noUpdate) {
            this.updateRatio();
        }
    };
    class_1.prototype.disabledChanged = function () {
        if (this.gesture) {
            this.gesture.enable(!this.disabled);
        }
        this.emitStyle();
    };
    class_1.prototype.valueChanged = function (value) {
        if (!this.noUpdate) {
            this.updateRatio();
        }
        value = this.ensureValueInBounds(value);
        this.ionChange.emit({ value: value });
    };
    class_1.prototype.connectedCallback = function () {
        this.updateRatio();
        this.debounceChanged();
        this.disabledChanged();
    };
    class_1.prototype.disconnectedCallback = function () {
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
    };
    class_1.prototype.componentDidLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rangeSlider, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rangeSlider = this.rangeSlider;
                        if (!rangeSlider) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, import('./index-c38df685.js')];
                    case 1:
                        _a.gesture = (_b.sent()).createGesture({
                            el: rangeSlider,
                            gestureName: 'range',
                            gesturePriority: 100,
                            threshold: 0,
                            onStart: function (ev) { return _this.onStart(ev); },
                            onMove: function (ev) { return _this.onMove(ev); },
                            onEnd: function (ev) { return _this.onEnd(ev); },
                        });
                        this.gesture.enable(!this.disabled);
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.getValue = function () {
        var value = this.value || 0;
        if (this.dualKnobs) {
            if (typeof value === 'object') {
                return value;
            }
            return {
                lower: 0,
                upper: value
            };
        }
        else {
            if (typeof value === 'object') {
                return value.upper;
            }
            return value;
        }
    };
    class_1.prototype.emitStyle = function () {
        this.ionStyle.emit({
            'interactive': true,
            'interactive-disabled': this.disabled
        });
    };
    class_1.prototype.onStart = function (detail) {
        var rect = this.rect = this.rangeSlider.getBoundingClientRect();
        var currentX = detail.currentX;
        // figure out which knob they started closer to
        var ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
        if (document.dir === 'rtl') {
            ratio = 1 - ratio;
        }
        this.pressedKnob =
            !this.dualKnobs ||
                Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio)
                ? 'A'
                : 'B';
        this.setFocus(this.pressedKnob);
        // update the active knob's position
        this.update(currentX);
    };
    class_1.prototype.onMove = function (detail) {
        this.update(detail.currentX);
    };
    class_1.prototype.onEnd = function (detail) {
        this.update(detail.currentX);
        this.pressedKnob = undefined;
    };
    class_1.prototype.update = function (currentX) {
        // figure out where the pointer is currently at
        // update the knob being interacted with
        var rect = this.rect;
        var ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
        if (document.dir === 'rtl') {
            ratio = 1 - ratio;
        }
        if (this.snaps) {
            // snaps the ratio to the current value
            ratio = valueToRatio(ratioToValue(ratio, this.min, this.max, this.step), this.min, this.max);
        }
        // update which knob is pressed
        if (this.pressedKnob === 'A') {
            this.ratioA = ratio;
        }
        else {
            this.ratioB = ratio;
        }
        // Update input value
        this.updateValue();
    };
    Object.defineProperty(class_1.prototype, "valA", {
        get: function () {
            return ratioToValue(this.ratioA, this.min, this.max, this.step);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "valB", {
        get: function () {
            return ratioToValue(this.ratioB, this.min, this.max, this.step);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "ratioLower", {
        get: function () {
            if (this.dualKnobs) {
                return Math.min(this.ratioA, this.ratioB);
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "ratioUpper", {
        get: function () {
            if (this.dualKnobs) {
                return Math.max(this.ratioA, this.ratioB);
            }
            return this.ratioA;
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.updateRatio = function () {
        var value = this.getValue();
        var _a = this, min = _a.min, max = _a.max;
        if (this.dualKnobs) {
            this.ratioA = valueToRatio(value.lower, min, max);
            this.ratioB = valueToRatio(value.upper, min, max);
        }
        else {
            this.ratioA = valueToRatio(value, min, max);
        }
    };
    class_1.prototype.updateValue = function () {
        this.noUpdate = true;
        var _a = this, valA = _a.valA, valB = _a.valB;
        this.value = !this.dualKnobs
            ? valA
            : {
                lower: Math.min(valA, valB),
                upper: Math.max(valA, valB)
            };
        this.noUpdate = false;
    };
    class_1.prototype.setFocus = function (knob) {
        if (this.el.shadowRoot) {
            var knobEl = this.el.shadowRoot.querySelector(knob === 'A' ? '.range-knob-a' : '.range-knob-b');
            if (knobEl) {
                knobEl.focus();
            }
        }
    };
    class_1.prototype.render = function () {
        var _a, _b;
        var _this = this;
        var _c = this, min = _c.min, max = _c.max, step = _c.step, el = _c.el, handleKeyboard = _c.handleKeyboard, pressedKnob = _c.pressedKnob, disabled = _c.disabled, pin = _c.pin, ratioLower = _c.ratioLower, ratioUpper = _c.ratioUpper;
        var mode = getIonMode(this);
        var barStart = ratioLower * 100 + "%";
        var barEnd = 100 - ratioUpper * 100 + "%";
        var doc = document;
        var isRTL = doc.dir === 'rtl';
        var start = isRTL ? 'right' : 'left';
        var end = isRTL ? 'left' : 'right';
        var tickStyle = function (tick) {
            var _a;
            return _a = {},
                _a[start] = tick[start],
                _a;
        };
        var barStyle = (_a = {},
            _a[start] = barStart,
            _a[end] = barEnd,
            _a);
        var ticks = [];
        if (this.snaps && this.ticks) {
            for (var value = min; value <= max; value += step) {
                var ratio = valueToRatio(value, min, max);
                var tick = {
                    ratio: ratio,
                    active: ratio >= ratioLower && ratio <= ratioUpper,
                };
                tick[start] = ratio * 100 + "%";
                ticks.push(tick);
            }
        }
        renderHiddenInput(true, el, this.name, JSON.stringify(this.getValue()), disabled);
        return (h(Host, { onFocusin: this.onFocus, onFocusout: this.onBlur, class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_b = {}, _b[mode] = true, _b['in-item'] = hostContext('ion-item', el), _b['range-disabled'] = disabled, _b['range-pressed'] = pressedKnob !== undefined, _b['range-has-pin'] = pin, _b)) }, h("slot", { name: "start" }), h("div", { class: "range-slider", ref: function (rangeEl) { return _this.rangeSlider = rangeEl; } }, ticks.map(function (tick) { return (h("div", { style: tickStyle(tick), role: "presentation", class: {
                'range-tick': true,
                'range-tick-active': tick.active
            } })); }), h("div", { class: "range-bar", role: "presentation" }), h("div", { class: "range-bar range-bar-active", role: "presentation", style: barStyle }), renderKnob(isRTL, {
            knob: 'A',
            pressed: pressedKnob === 'A',
            value: this.valA,
            ratio: this.ratioA,
            pin: pin,
            disabled: disabled,
            handleKeyboard: handleKeyboard,
            min: min,
            max: max
        }), this.dualKnobs && renderKnob(isRTL, {
            knob: 'B',
            pressed: pressedKnob === 'B',
            value: this.valB,
            ratio: this.ratioB,
            pin: pin,
            disabled: disabled,
            handleKeyboard: handleKeyboard,
            min: min,
            max: max
        })), h("slot", { name: "end" })));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "debounce": ["debounceChanged"],
                "min": ["minChanged"],
                "max": ["maxChanged"],
                "disabled": ["disabledChanged"],
                "value": ["valueChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{--knob-handle-size:calc(var(--knob-size) * 2);display:-ms-flexbox;display:flex;position:relative;-ms-flex:3;flex:3;-ms-flex-align:center;align-items:center;font-family:var(--ion-font-family,inherit);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}:host(.range-disabled){pointer-events:none}::slotted(ion-label){-ms-flex:initial;flex:initial}::slotted(ion-icon[slot]){font-size:24px}.range-slider{position:relative;-ms-flex:1;flex:1;width:100%;height:var(--height);contain:size layout style;cursor:-webkit-grab;cursor:grab;-ms-touch-action:pan-y;touch-action:pan-y}:host(.range-pressed) .range-slider{cursor:-webkit-grabbing;cursor:grabbing}.range-pin{position:absolute;background:var(--ion-color-base);color:var(--ion-color-contrast);-webkit-box-sizing:border-box;box-sizing:border-box}.range-knob-handle{left:0;top:calc((var(--height) - var(--knob-handle-size)) / 2);margin-left:calc(0px - var(--knob-handle-size) / 2);position:absolute;width:var(--knob-handle-size);height:var(--knob-handle-size);text-align:center}:host-context([dir=rtl]) .range-knob-handle,[dir=rtl] .range-knob-handle{right:unset;right:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.range-knob-handle{margin-left:unset;-webkit-margin-start:calc(0px - var(--knob-handle-size) / 2);margin-inline-start:calc(0px - var(--knob-handle-size) / 2)}}:host-context([dir=rtl]) .range-knob-handle,[dir=rtl] .range-knob-handle{left:unset}.range-knob-handle:active,.range-knob-handle:focus{outline:none}.range-bar{border-radius:var(--bar-border-radius);left:0;top:calc((var(--height) - var(--bar-height)) / 2);position:absolute;width:100%;height:var(--bar-height);background:var(--bar-background);pointer-events:none}:host-context([dir=rtl]) .range-bar,[dir=rtl] .range-bar{right:unset;right:0;left:unset}.range-knob{border-radius:var(--knob-border-radius);left:calc(50% - var(--knob-size) / 2);top:calc(50% - var(--knob-size) / 2);position:absolute;width:var(--knob-size);height:var(--knob-size);background:var(--knob-background);-webkit-box-shadow:var(--knob-box-shadow);box-shadow:var(--knob-box-shadow);pointer-events:none}:host-context([dir=rtl]) .range-knob,[dir=rtl] .range-knob{right:unset;right:calc(50% - var(--knob-size) / 2);left:unset}:host(.range-pressed) .range-bar-active{will-change:left,right}:host(.in-item){width:100%}:host(.in-item) ::slotted(ion-label){-ms-flex-item-align:center;align-self:center}:host{--knob-border-radius:50%;--knob-background:var(--bar-background-active);--knob-box-shadow:none;--knob-size:18px;--bar-height:2px;--bar-background:rgba(var(--ion-color-primary-rgb,56,128,255),0.26);--bar-background-active:var(--ion-color-primary,#3880ff);--bar-border-radius:0;--height:42px;--pin-background:var(--ion-color-primary,#3880ff);--pin-color:var(--ion-color-primary-contrast,#fff);padding-left:14px;padding-right:14px;padding-top:8px;padding-bottom:8px;font-size:12px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:14px;padding-inline-start:14px;-webkit-padding-end:14px;padding-inline-end:14px}}:host(.ion-color) .range-bar{background:rgba(var(--ion-color-base-rgb),.26)}:host(.ion-color) .range-bar-active,:host(.ion-color) .range-knob,:host(.ion-color) .range-pin,:host(.ion-color) .range-pin:before,:host(.ion-color) .range-tick{background:var(--ion-color-base);color:var(--ion-color-contrast)}::slotted([slot=start]){margin-left:0;margin-right:14px;margin-top:0;margin-bottom:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){::slotted([slot=start]){margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:14px;margin-inline-end:14px}}::slotted([slot=end]){margin-left:14px;margin-right:0;margin-top:0;margin-bottom:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){::slotted([slot=end]){margin-left:unset;margin-right:unset;-webkit-margin-start:14px;margin-inline-start:14px;-webkit-margin-end:0;margin-inline-end:0}}:host(.range-has-pin){padding-top:28px}.range-bar-active{bottom:0;width:auto;background:var(--bar-background-active)}.range-knob{-webkit-transform:scale(.67);transform:scale(.67);-webkit-transition-duration:.12s;transition-duration:.12s;-webkit-transition-property:background-color,border,-webkit-transform;transition-property:background-color,border,-webkit-transform;transition-property:transform,background-color,border;transition-property:transform,background-color,border,-webkit-transform;-webkit-transition-timing-function:ease;transition-timing-function:ease;z-index:2}.range-tick{position:absolute;top:calc((var(--height) - var(--bar-height)) / 2);width:var(--bar-height);height:var(--bar-height);background:var(--bar-background-active);z-index:1;pointer-events:none}.range-tick-active{background:transparent}.range-pin{padding-left:0;padding-right:0;padding-top:8px;padding-bottom:8px;border-radius:50%;-webkit-transform:translateZ(0) scale(.01);transform:translateZ(0) scale(.01);display:inline-block;position:relative;min-width:28px;height:28px;-webkit-transition:background .12s ease,-webkit-transform .12s ease;transition:background .12s ease,-webkit-transform .12s ease;transition:transform .12s ease,background .12s ease;transition:transform .12s ease,background .12s ease,-webkit-transform .12s ease;color:var(--pin-color);text-align:center}.range-pin,.range-pin:before{background:var(--pin-background)}.range-pin:before{left:50%;top:3px;margin-left:-13px;border-radius:50% 50% 50% 0;position:absolute;width:26px;height:26px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transition:background .12s ease;transition:background .12s ease;content:\"\";z-index:-1}:host-context([dir=rtl]) .range-pin:before,[dir=rtl] .range-pin:before{right:unset;right:50%}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.range-pin:before{margin-left:unset;-webkit-margin-start:-13px;margin-inline-start:-13px}}:host-context([dir=rtl]) .range-pin:before,[dir=rtl] .range-pin:before{left:unset}.range-knob-pressed .range-pin{-webkit-transform:translate3d(0,-24px,0) scale(1);transform:translate3d(0,-24px,0) scale(1)}:host(:not(.range-has-pin)) .range-knob-pressed .range-knob{-webkit-transform:scale(1);transform:scale(1)}:host(.range-disabled) .range-bar,:host(.range-disabled) .range-bar-active,:host(.range-disabled) .range-knob,:host(.range-disabled) .range-tick{background-color:var(--ion-color-step-250,#bfbfbf)}:host(.range-disabled) .range-knob{-webkit-transform:scale(.55);transform:scale(.55);outline:5px solid #fff}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var renderKnob = function (isRTL, _a) {
    var knob = _a.knob, value = _a.value, ratio = _a.ratio, min = _a.min, max = _a.max, disabled = _a.disabled, pressed = _a.pressed, pin = _a.pin, handleKeyboard = _a.handleKeyboard;
    var start = isRTL ? 'right' : 'left';
    var knobStyle = function () {
        var style = {};
        style[start] = ratio * 100 + "%";
        return style;
    };
    return (h("div", { onKeyDown: function (ev) {
            var key = ev.key;
            if (key === 'ArrowLeft' || key === 'ArrowDown') {
                handleKeyboard(knob, false);
                ev.preventDefault();
                ev.stopPropagation();
            }
            else if (key === 'ArrowRight' || key === 'ArrowUp') {
                handleKeyboard(knob, true);
                ev.preventDefault();
                ev.stopPropagation();
            }
        }, class: {
            'range-knob-handle': true,
            'range-knob-a': knob === 'A',
            'range-knob-b': knob === 'B',
            'range-knob-pressed': pressed,
            'range-knob-min': value === min,
            'range-knob-max': value === max
        }, style: knobStyle(), role: "slider", tabindex: disabled ? -1 : 0, "aria-valuemin": min, "aria-valuemax": max, "aria-disabled": disabled ? 'true' : null, "aria-valuenow": value }, pin && h("div", { class: "range-pin", role: "presentation" }, Math.round(value)), h("div", { class: "range-knob", role: "presentation" })));
};
var ratioToValue = function (ratio, min, max, step) {
    var value = (max - min) * ratio;
    if (step > 0) {
        value = Math.round(value / step) * step + min;
    }
    return clamp(min, value, max);
};
var valueToRatio = function (value, min, max) {
    return clamp(0, (value - min) / (max - min), 1);
};
export { Range as ion_range };
