import { __awaiter, __generator } from "tslib";
import { r as registerInstance, c as getIonMode, h, H as Host, e as getElement, d as createEvent } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';
import { i as isEndSide } from './helpers-46f4a262.js';
import { c as createColorClasses } from './theme-18cbe2cc.js';
var ItemOption = /** @class */ (function () {
    function ItemOption(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the user cannot interact with the item option.
         */
        this.disabled = false;
        /**
         * If `true`, the option will expand to take up the available width and cover any other options.
         */
        this.expandable = false;
        /**
         * The type of the button.
         */
        this.type = 'button';
        this.onClick = function (ev) {
            var el = ev.target.closest('ion-item-option');
            if (el) {
                ev.preventDefault();
            }
        };
    }
    ItemOption.prototype.render = function () {
        var _a;
        var _b = this, disabled = _b.disabled, expandable = _b.expandable, href = _b.href;
        var TagType = href === undefined ? 'button' : 'a';
        var mode = getIonMode(this);
        var attrs = (TagType === 'button')
            ? { type: this.type }
            : {
                download: this.download,
                href: this.href,
                target: this.target
            };
        return (h(Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a['item-option-disabled'] = disabled, _a['item-option-expandable'] = expandable, _a['ion-activatable'] = true, _a)) }, h(TagType, Object.assign({}, attrs, { class: "button-native", disabled: disabled }), h("span", { class: "button-inner" }, h("slot", { name: "top" }), h("div", { class: "horizontal-wrapper" }, h("slot", { name: "start" }), h("slot", { name: "icon-only" }), h("slot", null), h("slot", { name: "end" })), h("slot", { name: "bottom" })), mode === 'md' && h("ion-ripple-effect", null))));
    };
    Object.defineProperty(ItemOption.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemOption, "style", {
        get: function () { return ":host{--background:var(--ion-color-primary,#3880ff);--color:var(--ion-color-primary-contrast,#fff);background:var(--background);color:var(--color);font-family:var(--ion-font-family,inherit)}:host(.in-list.item-options-end:last-child){padding-right:calc(.7em + var(--ion-safe-area-right))}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.in-list.item-options-end:last-child){padding-right:unset;-webkit-padding-end:calc(.7em + var(--ion-safe-area-right));padding-inline-end:calc(.7em + var(--ion-safe-area-right))}}:host(.in-list.item-options-start:first-child){padding-left:calc(.7em + var(--ion-safe-area-left))}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.in-list.item-options-start:first-child){padding-left:unset;-webkit-padding-start:calc(.7em + var(--ion-safe-area-left));padding-inline-start:calc(.7em + var(--ion-safe-area-left))}}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}.button-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:.7em;padding-right:.7em;padding-top:0;padding-bottom:0;display:inline-block;position:relative;width:100%;height:100%;border:0;outline:none;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-box-sizing:border-box;box-sizing:border-box}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.button-native{padding-left:unset;padding-right:unset;-webkit-padding-start:.7em;padding-inline-start:.7em;-webkit-padding-end:.7em;padding-inline-end:.7em}}.button-inner{-ms-flex-flow:column nowrap;flex-flow:column nowrap;height:100%}.button-inner,.horizontal-wrapper{display:-ms-flexbox;display:flex;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%}.horizontal-wrapper{-ms-flex-flow:row nowrap;flex-flow:row nowrap}::slotted(*){-ms-flex-negative:0;flex-shrink:0}::slotted([slot=start]){margin-left:0;margin-right:5px;margin-top:0;margin-bottom:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){::slotted([slot=start]){margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:5px;margin-inline-end:5px}}::slotted([slot=end]){margin-left:5px;margin-right:0;margin-top:0;margin-bottom:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){::slotted([slot=end]){margin-left:unset;margin-right:unset;-webkit-margin-start:5px;margin-inline-start:5px;-webkit-margin-end:0;margin-inline-end:0}}::slotted([slot=icon-only]){padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:10px;margin-right:10px;margin-top:0;margin-bottom:0;min-width:.9em;font-size:1.8em}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){::slotted([slot=icon-only]){margin-left:unset;margin-right:unset;-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px}}:host(.item-option-expandable){-ms-flex-negative:0;flex-shrink:0;-webkit-transition-duration:0;transition-duration:0;-webkit-transition-property:none;transition-property:none;-webkit-transition-timing-function:cubic-bezier(.65,.05,.36,1);transition-timing-function:cubic-bezier(.65,.05,.36,1)}:host(.item-option-disabled){pointer-events:none}:host(.item-option-disabled) .button-native{cursor:default;opacity:.5;pointer-events:none}:host{font-size:14px;font-weight:500;text-transform:uppercase}"; },
        enumerable: true,
        configurable: true
    });
    return ItemOption;
}());
var ItemOptions = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The side the option button should be on. Possible values: `"start"` and `"end"`. If you have multiple `ion-item-options`, a side must be provided for each.
         *
         */
        this.side = 'end';
        this.ionSwipe = createEvent(this, "ionSwipe", 7);
    }
    /** @internal */
    class_1.prototype.fireSwipeEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ionSwipe.emit({
                    side: this.side
                });
                return [2 /*return*/];
            });
        });
    };
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        var isEnd = isEndSide(this.side);
        return (h(Host, { class: (_a = {},
                _a[mode] = true,
                // Used internally for styling
                _a["item-options-" + mode] = true,
                _a['item-options-start'] = !isEnd,
                _a['item-options-end'] = isEnd,
                _a) }));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return "ion-item-options{top:0;right:0;-ms-flex-pack:end;justify-content:flex-end;display:none;position:absolute;height:100%;font-size:14px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1}:host-context([dir=rtl]) ion-item-options,[dir=rtl] ion-item-options{-ms-flex-pack:start;justify-content:flex-start}:host-context([dir=rtl]) ion-item-options:not(.item-options-end),[dir=rtl] ion-item-options:not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}.item-options-start{right:auto;left:0;-ms-flex-pack:start;justify-content:flex-start}:host-context([dir=rtl]) .item-options-start,[dir=rtl] .item-options-start{-ms-flex-pack:end;justify-content:flex-end}.item-options-start ion-item-option:first-child{padding-right:var(--ion-safe-area-left)}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.item-options-start ion-item-option:first-child{padding-right:unset;-webkit-padding-end:var(--ion-safe-area-left);padding-inline-end:var(--ion-safe-area-left)}}.item-options-end ion-item-option:last-child{padding-right:var(--ion-safe-area-right)}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.item-options-end ion-item-option:last-child{padding-right:unset;-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}}:host-context([dir=rtl]) .item-sliding-active-slide.item-sliding-active-options-start ion-item-options:not(.item-options-end),[dir=rtl] .item-sliding-active-slide.item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}.item-sliding-active-slide ion-item-options{display:-ms-flexbox;display:flex;visibility:hidden}.item-sliding-active-slide.item-sliding-active-options-end ion-item-options:not(.item-options-start),.item-sliding-active-slide.item-sliding-active-options-start .item-options-start{width:100%;visibility:visible}.item-options-md{border-bottom-style:solid;border-bottom-color:var(--ion-item-border-color,var(--ion-border-color,var(--ion-color-step-150,rgba(0,0,0,.13))))}.item-options-md,.list-md-lines-none .item-options-md{border-bottom-width:0}.list-md-lines-full .item-options-md,.list-md-lines-inset .item-options-md.item-options-end{border-bottom-width:1px}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var SWIPE_MARGIN = 30;
var ELASTIC_FACTOR = 0.55;
var openSlidingItem;
var ItemSliding = /** @class */ (function () {
    function class_2(hostRef) {
        registerInstance(this, hostRef);
        this.item = null;
        this.openAmount = 0;
        this.initialOpenAmount = 0;
        this.optsWidthRightSide = 0;
        this.optsWidthLeftSide = 0;
        this.sides = 0 /* None */;
        this.optsDirty = true;
        this.state = 2 /* Disabled */;
        /**
         * If `true`, the user cannot interact with the sliding item.
         */
        this.disabled = false;
        this.ionDrag = createEvent(this, "ionDrag", 7);
    }
    class_2.prototype.disabledChanged = function () {
        if (this.gesture) {
            this.gesture.enable(!this.disabled);
        }
    };
    class_2.prototype.connectedCallback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.item = this.el.querySelector('ion-item');
                        return [4 /*yield*/, this.updateOptions()];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, import('./index-c38df685.js')];
                    case 2:
                        _a.gesture = (_b.sent()).createGesture({
                            el: this.el,
                            gestureName: 'item-swipe',
                            gesturePriority: 100,
                            threshold: 5,
                            canStart: function () { return _this.canStart(); },
                            onStart: function () { return _this.onStart(); },
                            onMove: function (ev) { return _this.onMove(ev); },
                            onEnd: function (ev) { return _this.onEnd(ev); },
                        });
                        this.disabledChanged();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_2.prototype.disconnectedCallback = function () {
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
        this.item = null;
        this.leftOptions = this.rightOptions = undefined;
        if (openSlidingItem === this.el) {
            openSlidingItem = undefined;
        }
    };
    /**
     * Get the amount the item is open in pixels.
     */
    class_2.prototype.getOpenAmount = function () {
        return Promise.resolve(this.openAmount);
    };
    /**
     * Get the ratio of the open amount of the item compared to the width of the options.
     * If the number returned is positive, then the options on the right side are open.
     * If the number returned is negative, then the options on the left side are open.
     * If the absolute value of the number is greater than 1, the item is open more than
     * the width of the options.
     */
    class_2.prototype.getSlidingRatio = function () {
        return Promise.resolve(this.getSlidingRatioSync());
    };
    /**
     * Open the sliding item.
     *
     * @param side The side of the options to open. If a side is not provided, it will open the first set of options it finds within the item.
     */
    class_2.prototype.open = function (side) {
        return __awaiter(this, void 0, void 0, function () {
            var optionsToOpen, isStartOpen, isEndOpen;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.item === null) {
                    return [2 /*return*/];
                }
                optionsToOpen = this.getOptions(side);
                if (!optionsToOpen) {
                    return [2 /*return*/];
                }
                /**
                 * If side is not set, we need to infer the side
                 * so we know which direction to move the options
                 */
                if (side === undefined) {
                    side = (optionsToOpen === this.leftOptions) ? 'start' : 'end';
                }
                // In RTL we want to switch the sides
                side = isEndSide(side) ? 'end' : 'start';
                isStartOpen = this.openAmount < 0;
                isEndOpen = this.openAmount > 0;
                /**
                 * If a side is open and a user tries to
                 * re-open the same side, we should not do anything
                 */
                if (isStartOpen && optionsToOpen === this.leftOptions) {
                    return [2 /*return*/];
                }
                if (isEndOpen && optionsToOpen === this.rightOptions) {
                    return [2 /*return*/];
                }
                this.closeOpened();
                this.state = 4 /* Enabled */;
                requestAnimationFrame(function () {
                    _this.calculateOptsWidth();
                    var width = (side === 'end') ? _this.optsWidthRightSide : -_this.optsWidthLeftSide;
                    openSlidingItem = _this.el;
                    _this.setOpenAmount(width, false);
                    _this.state = (side === 'end') ? 8 /* End */ : 16 /* Start */;
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Close the sliding item. Items can also be closed from the [List](../list).
     */
    class_2.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.setOpenAmount(0, true);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Close all of the sliding items in the list. Items can also be closed from the [List](../list).
     */
    class_2.prototype.closeOpened = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (openSlidingItem !== undefined) {
                    openSlidingItem.close();
                    openSlidingItem = undefined;
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Given an optional side, return the ion-item-options element.
     *
     * @param side This side of the options to get. If a side is not provided it will
     * return the first one available.
     */
    class_2.prototype.getOptions = function (side) {
        if (side === undefined) {
            return this.leftOptions || this.rightOptions;
        }
        else if (side === 'start') {
            return this.leftOptions;
        }
        else {
            return this.rightOptions;
        }
    };
    class_2.prototype.updateOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, sides, i, option, side;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = this.el.querySelectorAll('ion-item-options');
                        sides = 0;
                        // Reset left and right options in case they were removed
                        this.leftOptions = this.rightOptions = undefined;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < options.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, options.item(i).componentOnReady()];
                    case 2:
                        option = _a.sent();
                        side = isEndSide(option.side) ? 'end' : 'start';
                        if (side === 'start') {
                            this.leftOptions = option;
                            sides |= 1 /* Start */;
                        }
                        else {
                            this.rightOptions = option;
                            sides |= 2 /* End */;
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.optsDirty = true;
                        this.sides = sides;
                        return [2 /*return*/];
                }
            });
        });
    };
    class_2.prototype.canStart = function () {
        var selected = openSlidingItem;
        if (selected && selected !== this.el) {
            this.closeOpened();
            return false;
        }
        return !!(this.rightOptions || this.leftOptions);
    };
    class_2.prototype.onStart = function () {
        openSlidingItem = this.el;
        if (this.tmr !== undefined) {
            clearTimeout(this.tmr);
            this.tmr = undefined;
        }
        if (this.openAmount === 0) {
            this.optsDirty = true;
            this.state = 4 /* Enabled */;
        }
        this.initialOpenAmount = this.openAmount;
        if (this.item) {
            this.item.style.transition = 'none';
        }
    };
    class_2.prototype.onMove = function (gesture) {
        if (this.optsDirty) {
            this.calculateOptsWidth();
        }
        var openAmount = this.initialOpenAmount - gesture.deltaX;
        switch (this.sides) {
            case 2 /* End */:
                openAmount = Math.max(0, openAmount);
                break;
            case 1 /* Start */:
                openAmount = Math.min(0, openAmount);
                break;
            case 3 /* Both */: break;
            case 0 /* None */: return;
            default:
                console.warn('invalid ItemSideFlags value', this.sides);
                break;
        }
        var optsWidth;
        if (openAmount > this.optsWidthRightSide) {
            optsWidth = this.optsWidthRightSide;
            openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
        }
        else if (openAmount < -this.optsWidthLeftSide) {
            optsWidth = -this.optsWidthLeftSide;
            openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
        }
        this.setOpenAmount(openAmount, false);
    };
    class_2.prototype.onEnd = function (gesture) {
        var velocity = gesture.velocityX;
        var restingPoint = (this.openAmount > 0)
            ? this.optsWidthRightSide
            : -this.optsWidthLeftSide;
        // Check if the drag didn't clear the buttons mid-point
        // and we aren't moving fast enough to swipe open
        var isResetDirection = (this.openAmount > 0) === !(velocity < 0);
        var isMovingFast = Math.abs(velocity) > 0.3;
        var isOnCloseZone = Math.abs(this.openAmount) < Math.abs(restingPoint / 2);
        if (swipeShouldReset(isResetDirection, isMovingFast, isOnCloseZone)) {
            restingPoint = 0;
        }
        var state = this.state;
        this.setOpenAmount(restingPoint, true);
        if ((state & 32 /* SwipeEnd */) !== 0 && this.rightOptions) {
            this.rightOptions.fireSwipeEvent();
        }
        else if ((state & 64 /* SwipeStart */) !== 0 && this.leftOptions) {
            this.leftOptions.fireSwipeEvent();
        }
    };
    class_2.prototype.calculateOptsWidth = function () {
        this.optsWidthRightSide = 0;
        if (this.rightOptions) {
            this.rightOptions.style.display = 'flex';
            this.optsWidthRightSide = this.rightOptions.offsetWidth;
            this.rightOptions.style.display = '';
        }
        this.optsWidthLeftSide = 0;
        if (this.leftOptions) {
            this.leftOptions.style.display = 'flex';
            this.optsWidthLeftSide = this.leftOptions.offsetWidth;
            this.leftOptions.style.display = '';
        }
        this.optsDirty = false;
    };
    class_2.prototype.setOpenAmount = function (openAmount, isFinal) {
        var _this = this;
        if (this.tmr !== undefined) {
            clearTimeout(this.tmr);
            this.tmr = undefined;
        }
        if (!this.item) {
            return;
        }
        var style = this.item.style;
        this.openAmount = openAmount;
        if (isFinal) {
            style.transition = '';
        }
        if (openAmount > 0) {
            this.state = (openAmount >= (this.optsWidthRightSide + SWIPE_MARGIN))
                ? 8 /* End */ | 32 /* SwipeEnd */
                : 8 /* End */;
        }
        else if (openAmount < 0) {
            this.state = (openAmount <= (-this.optsWidthLeftSide - SWIPE_MARGIN))
                ? 16 /* Start */ | 64 /* SwipeStart */
                : 16 /* Start */;
        }
        else {
            this.tmr = setTimeout(function () {
                _this.state = 2 /* Disabled */;
                _this.tmr = undefined;
            }, 600);
            openSlidingItem = undefined;
            style.transform = '';
            return;
        }
        style.transform = "translate3d(" + -openAmount + "px,0,0)";
        this.ionDrag.emit({
            amount: openAmount,
            ratio: this.getSlidingRatioSync()
        });
    };
    class_2.prototype.getSlidingRatioSync = function () {
        if (this.openAmount > 0) {
            return this.openAmount / this.optsWidthRightSide;
        }
        else if (this.openAmount < 0) {
            return this.openAmount / this.optsWidthLeftSide;
        }
        else {
            return 0;
        }
    };
    class_2.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: (_a = {},
                _a[mode] = true,
                _a['item-sliding-active-slide'] = (this.state !== 2 /* Disabled */),
                _a['item-sliding-active-options-end'] = (this.state & 8 /* End */) !== 0,
                _a['item-sliding-active-options-start'] = (this.state & 16 /* Start */) !== 0,
                _a['item-sliding-active-swipe-end'] = (this.state & 32 /* SwipeEnd */) !== 0,
                _a['item-sliding-active-swipe-start'] = (this.state & 64 /* SwipeStart */) !== 0,
                _a) }));
    };
    Object.defineProperty(class_2.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_2, "watchers", {
        get: function () {
            return {
                "disabled": ["disabledChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_2, "style", {
        get: function () { return "ion-item-sliding{display:block;position:relative;width:100%;overflow:hidden}ion-item-sliding,ion-item-sliding .item{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.item-sliding-active-slide .item{position:relative;-webkit-transition:-webkit-transform .5s cubic-bezier(.36,.66,.04,1);transition:-webkit-transform .5s cubic-bezier(.36,.66,.04,1);transition:transform .5s cubic-bezier(.36,.66,.04,1);transition:transform .5s cubic-bezier(.36,.66,.04,1),-webkit-transform .5s cubic-bezier(.36,.66,.04,1);opacity:1;z-index:2;pointer-events:none;will-change:transform}.item-sliding-active-swipe-end .item-options-end .item-option-expandable{padding-left:100%;-ms-flex-order:1;order:1;-webkit-transition-duration:.6s;transition-duration:.6s;-webkit-transition-property:padding-left;transition-property:padding-left}:host-context([dir=rtl]) .item-sliding-active-swipe-end .item-options-end .item-option-expandable,[dir=rtl] .item-sliding-active-swipe-end .item-options-end .item-option-expandable{-ms-flex-order:-1;order:-1}.item-sliding-active-swipe-start .item-options-start .item-option-expandable{padding-right:100%;-ms-flex-order:-1;order:-1;-webkit-transition-duration:.6s;transition-duration:.6s;-webkit-transition-property:padding-right;transition-property:padding-right}:host-context([dir=rtl]) .item-sliding-active-swipe-start .item-options-start .item-option-expandable,[dir=rtl] .item-sliding-active-swipe-start .item-options-start .item-option-expandable{-ms-flex-order:1;order:1}"; },
        enumerable: true,
        configurable: true
    });
    return class_2;
}());
var swipeShouldReset = function (isResetDirection, isMovingFast, isOnResetZone) {
    // The logic required to know when the sliding item should close (openAmount=0)
    // depends on three booleans (isResetDirection, isMovingFast, isOnResetZone)
    // and it ended up being too complicated to be written manually without errors
    // so the truth table is attached below: (0=false, 1=true)
    // isResetDirection | isMovingFast | isOnResetZone || shouldClose
    //         0        |       0      |       0       ||    0
    //         0        |       0      |       1       ||    1
    //         0        |       1      |       0       ||    0
    //         0        |       1      |       1       ||    0
    //         1        |       0      |       0       ||    0
    //         1        |       0      |       1       ||    1
    //         1        |       1      |       0       ||    1
    //         1        |       1      |       1       ||    1
    // The resulting expression was generated by resolving the K-map (Karnaugh map):
    return (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
};
export { ItemOption as ion_item_option, ItemOptions as ion_item_options, ItemSliding as ion_item_sliding };
