import { __awaiter, __generator } from "tslib";
import { r as registerInstance, c as getIonMode, d as createEvent, h, H as Host, e as getElement } from './core-0a8d4d2e.js';
import { b as config } from './config-3c7f3790.js';
import { i as isEndSide, b as assert, c as clamp } from './helpers-46f4a262.js';
import './animation-56279521.js';
import { g as getTimeGivenProgression } from './cubic-bezier-1d592096.js';
import { GESTURE_CONTROLLER } from './index-c38df685.js';
import './hardware-back-button-1ed0083a.js';
import { m as menuController } from './index-c58c7441.js';
import { c as createColorClasses, h as hostContext } from './theme-18cbe2cc.js';
var iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
var mdEasing = 'cubic-bezier(0.0,0.0,0.2,1)';
var iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';
var mdEasingReverse = 'cubic-bezier(0.4, 0, 0.6, 1)';
var Menu = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.lastOnEnd = 0;
        this.blocker = GESTURE_CONTROLLER.createBlocker({ disableScroll: true });
        this.mode = getIonMode(this);
        this.easing = this.mode === 'ios' ? iosEasing : mdEasing;
        this.easingReverse = this.mode === 'ios' ? iosEasingReverse : mdEasingReverse;
        this.isAnimating = false;
        this._isOpen = false;
        this.isPaneVisible = false;
        this.isEndSide = false;
        /**
         * If `true`, the menu is disabled.
         */
        this.disabled = false;
        /**
         * Which side of the view the menu should be placed.
         */
        this.side = 'start';
        /**
         * If `true`, swiping the menu is enabled.
         */
        this.swipeGesture = true;
        /**
         * The edge threshold for dragging the menu open.
         * If a drag/swipe happens over this value, the menu is not triggered.
         */
        this.maxEdgeStart = 50;
        this.ionWillOpen = createEvent(this, "ionWillOpen", 7);
        this.ionWillClose = createEvent(this, "ionWillClose", 7);
        this.ionDidOpen = createEvent(this, "ionDidOpen", 7);
        this.ionDidClose = createEvent(this, "ionDidClose", 7);
        this.ionMenuChange = createEvent(this, "ionMenuChange", 7);
    }
    class_1.prototype.typeChanged = function (type, oldType) {
        var contentEl = this.contentEl;
        if (contentEl) {
            if (oldType !== undefined) {
                contentEl.classList.remove("menu-content-" + oldType);
            }
            contentEl.classList.add("menu-content-" + type);
            contentEl.removeAttribute('style');
        }
        if (this.menuInnerEl) {
            // Remove effects of previous animations
            this.menuInnerEl.removeAttribute('style');
        }
        this.animation = undefined;
    };
    class_1.prototype.disabledChanged = function () {
        this.updateState();
        this.ionMenuChange.emit({
            disabled: this.disabled,
            open: this._isOpen
        });
    };
    class_1.prototype.sideChanged = function () {
        this.isEndSide = isEndSide(this.side);
    };
    class_1.prototype.swipeGestureChanged = function () {
        this.updateState();
    };
    class_1.prototype.connectedCallback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var el, parent, content, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.type === undefined) {
                            this.type = config.get('menuType', 'overlay');
                        }
                        el = this.el;
                        parent = el.parentNode;
                        if (this.contentId === undefined) {
                            console.warn("[DEPRECATED][ion-menu] Using the [main] attribute is deprecated, please use the \"contentId\" property instead:\nBEFORE:\n  <ion-menu>...</ion-menu>\n  <div main>...</div>\n\nAFTER:\n  <ion-menu contentId=\"main-content\"></ion-menu>\n  <div id=\"main-content\">...</div>\n");
                        }
                        content = this.contentId !== undefined
                            ? document.getElementById(this.contentId)
                            : parent && parent.querySelector && parent.querySelector('[main]');
                        if (!content || !content.tagName) {
                            // requires content element
                            console.error('Menu: must have a "content" element to listen for drag events on.');
                            return [2 /*return*/];
                        }
                        this.contentEl = content;
                        // add menu's content classes
                        content.classList.add('menu-content');
                        this.typeChanged(this.type, undefined);
                        this.sideChanged();
                        // register this menu with the app's menu controller
                        menuController._register(this);
                        _a = this;
                        return [4 /*yield*/, import('./index-c38df685.js')];
                    case 1:
                        _a.gesture = (_b.sent()).createGesture({
                            el: document,
                            gestureName: 'menu-swipe',
                            gesturePriority: 30,
                            threshold: 10,
                            canStart: function (ev) { return _this.canStart(ev); },
                            onWillStart: function () { return _this.onWillStart(); },
                            onStart: function () { return _this.onStart(); },
                            onMove: function (ev) { return _this.onMove(ev); },
                            onEnd: function (ev) { return _this.onEnd(ev); },
                        });
                        this.updateState();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.componentDidLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ionMenuChange.emit({ disabled: this.disabled, open: this._isOpen });
                this.updateState();
                return [2 /*return*/];
            });
        });
    };
    class_1.prototype.disconnectedCallback = function () {
        this.blocker.destroy();
        menuController._unregister(this);
        if (this.animation) {
            this.animation.destroy();
        }
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
        this.animation = undefined;
        this.contentEl = this.backdropEl = this.menuInnerEl = undefined;
    };
    class_1.prototype.onSplitPaneChanged = function (ev) {
        this.isPaneVisible = ev.detail.isPane(this.el);
        this.updateState();
    };
    class_1.prototype.onBackdropClick = function (ev) {
        if (this._isOpen && this.lastOnEnd < ev.timeStamp - 100) {
            var shouldClose = (ev.composedPath)
                ? !ev.composedPath().includes(this.menuInnerEl)
                : false;
            if (shouldClose) {
                ev.preventDefault();
                ev.stopPropagation();
                this.close();
            }
        }
    };
    /**
     * Returns `true` is the menu is open.
     */
    class_1.prototype.isOpen = function () {
        return Promise.resolve(this._isOpen);
    };
    /**
     * Returns `true` is the menu is active.
     *
     * A menu is active when it can be opened or closed, meaning it's enabled
     * and it's not part of a `ion-split-pane`.
     */
    class_1.prototype.isActive = function () {
        return Promise.resolve(this._isActive());
    };
    /**
     * Opens the menu. If the menu is already open or it can't be opened,
     * it returns `false`.
     */
    class_1.prototype.open = function (animated) {
        if (animated === void 0) { animated = true; }
        return this.setOpen(true, animated);
    };
    /**
     * Closes the menu. If the menu is already closed or it can't be closed,
     * it returns `false`.
     */
    class_1.prototype.close = function (animated) {
        if (animated === void 0) { animated = true; }
        return this.setOpen(false, animated);
    };
    /**
     * Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it.
     * If the operation can't be completed successfully, it returns `false`.
     */
    class_1.prototype.toggle = function (animated) {
        if (animated === void 0) { animated = true; }
        return this.setOpen(!this._isOpen, animated);
    };
    /**
     * Opens or closes the button.
     * If the operation can't be completed successfully, it returns `false`.
     */
    class_1.prototype.setOpen = function (shouldOpen, animated) {
        if (animated === void 0) { animated = true; }
        return menuController._setOpen(this, shouldOpen, animated);
    };
    class_1.prototype._setOpen = function (shouldOpen, animated) {
        if (animated === void 0) { animated = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // If the menu is disabled or it is currently being animated, let's do nothing
                        if (!this._isActive() || this.isAnimating || shouldOpen === this._isOpen) {
                            return [2 /*return*/, false];
                        }
                        this.beforeAnimation(shouldOpen);
                        return [4 /*yield*/, this.loadAnimation()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.startAnimation(shouldOpen, animated)];
                    case 2:
                        _a.sent();
                        this.afterAnimation(shouldOpen);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    class_1.prototype.loadAnimation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var width, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        width = this.menuInnerEl.offsetWidth;
                        if (width === this.width && this.animation !== undefined) {
                            return [2 /*return*/];
                        }
                        this.width = width;
                        // Destroy existing animation
                        if (this.animation) {
                            this.animation.destroy();
                            this.animation = undefined;
                        }
                        // Create new animation
                        _a = this;
                        return [4 /*yield*/, menuController._createAnimation(this.type, this)];
                    case 1:
                        // Create new animation
                        _a.animation = _b.sent();
                        if (!config.getBoolean('animated', true)) {
                            this.animation.duration(0);
                        }
                        this.animation.fill('both');
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.startAnimation = function (shouldOpen, animated) {
        return __awaiter(this, void 0, void 0, function () {
            var isReversed, ani;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isReversed = !shouldOpen;
                        ani = this.animation
                            .direction((isReversed) ? 'reverse' : 'normal')
                            .easing((isReversed) ? this.easingReverse : this.easing)
                            .onFinish(function () {
                            if (ani.getDirection() === 'reverse') {
                                ani.direction('normal');
                            }
                        });
                        if (!animated) return [3 /*break*/, 2];
                        return [4 /*yield*/, ani.play()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        ani.play({ sync: true });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype._isActive = function () {
        return !this.disabled && !this.isPaneVisible;
    };
    class_1.prototype.canSwipe = function () {
        return this.swipeGesture && !this.isAnimating && this._isActive();
    };
    class_1.prototype.canStart = function (detail) {
        // Do not allow swipe gesture if a modal is open
        var isModalPresented = !!document.querySelector('ion-modal.show-modal');
        if (isModalPresented || !this.canSwipe()) {
            return false;
        }
        if (this._isOpen) {
            return true;
            // TODO error
        }
        else if (menuController._getOpenSync()) {
            return false;
        }
        return checkEdgeSide(window, detail.currentX, this.isEndSide, this.maxEdgeStart);
    };
    class_1.prototype.onWillStart = function () {
        this.beforeAnimation(!this._isOpen);
        return this.loadAnimation();
    };
    class_1.prototype.onStart = function () {
        if (!this.isAnimating || !this.animation) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        // the cloned animation should not use an easing curve during seek
        this.animation.progressStart(true, (this._isOpen) ? 1 : 0);
    };
    class_1.prototype.onMove = function (detail) {
        if (!this.isAnimating || !this.animation) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        var delta = computeDelta(detail.deltaX, this._isOpen, this.isEndSide);
        var stepValue = delta / this.width;
        this.animation.progressStep((this._isOpen) ? 1 - stepValue : stepValue);
    };
    class_1.prototype.onEnd = function (detail) {
        var _this = this;
        if (!this.isAnimating || !this.animation) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        var isOpen = this._isOpen;
        var isEndSide = this.isEndSide;
        var delta = computeDelta(detail.deltaX, isOpen, isEndSide);
        var width = this.width;
        var stepValue = delta / width;
        var velocity = detail.velocityX;
        var z = width / 2.0;
        var shouldCompleteRight = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);
        var shouldCompleteLeft = velocity <= 0 && (velocity < -0.2 || detail.deltaX < -z);
        var shouldComplete = isOpen
            ? isEndSide ? shouldCompleteRight : shouldCompleteLeft
            : isEndSide ? shouldCompleteLeft : shouldCompleteRight;
        var shouldOpen = !isOpen && shouldComplete;
        if (isOpen && !shouldComplete) {
            shouldOpen = true;
        }
        this.lastOnEnd = detail.currentTime;
        // Account for rounding errors in JS
        var newStepValue = (shouldComplete) ? 0.001 : -0.001;
        /**
         * TODO: stepValue can sometimes return a negative
         * value, but you can't have a negative time value
         * for the cubic bezier curve (at least with web animations)
         * Not sure if the negative step value is an error or not
         */
        var adjustedStepValue = (stepValue < 0) ? 0.01 : stepValue;
        /**
         * Animation will be reversed here, so need to
         * reverse the easing curve as well
         *
         * Additionally, we need to account for the time relative
         * to the new easing curve, as `stepValue` is going to be given
         * in terms of a linear curve.
         */
        newStepValue += getTimeGivenProgression([0, 0], [0.4, 0], [0.6, 1], [1, 1], clamp(0, adjustedStepValue, 0.9999))[0] || 0;
        var playTo = (this._isOpen) ? !shouldComplete : shouldComplete;
        this.animation
            .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
            .onFinish(function () { return _this.afterAnimation(shouldOpen); }, { oneTimeCallback: true })
            .progressEnd((playTo) ? 1 : 0, (this._isOpen) ? 1 - newStepValue : newStepValue, 300);
    };
    class_1.prototype.beforeAnimation = function (shouldOpen) {
        assert(!this.isAnimating, '_before() should not be called while animating');
        // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations
        this.el.classList.add(SHOW_MENU);
        if (this.backdropEl) {
            this.backdropEl.classList.add(SHOW_BACKDROP);
        }
        this.blocker.block();
        this.isAnimating = true;
        if (shouldOpen) {
            this.ionWillOpen.emit();
        }
        else {
            this.ionWillClose.emit();
        }
    };
    class_1.prototype.afterAnimation = function (isOpen) {
        assert(this.isAnimating, '_before() should be called while animating');
        // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        // emit opened/closed events
        this._isOpen = isOpen;
        this.isAnimating = false;
        if (!this._isOpen) {
            this.blocker.unblock();
        }
        if (isOpen) {
            // add css class
            if (this.contentEl) {
                this.contentEl.classList.add(MENU_CONTENT_OPEN);
            }
            // emit open event
            this.ionDidOpen.emit();
        }
        else {
            // remove css classes
            this.el.classList.remove(SHOW_MENU);
            if (this.contentEl) {
                this.contentEl.classList.remove(MENU_CONTENT_OPEN);
            }
            if (this.backdropEl) {
                this.backdropEl.classList.remove(SHOW_BACKDROP);
            }
            if (this.animation) {
                this.animation.stop();
            }
            // emit close event
            this.ionDidClose.emit();
        }
    };
    class_1.prototype.updateState = function () {
        var isActive = this._isActive();
        if (this.gesture) {
            this.gesture.enable(isActive && this.swipeGesture);
        }
        // Close menu immediately
        if (!isActive && this._isOpen) {
            // close if this menu is open, and should not be enabled
            this.forceClosing();
        }
        if (!this.disabled) {
            menuController._setActiveMenu(this);
        }
        assert(!this.isAnimating, 'can not be animating');
    };
    class_1.prototype.forceClosing = function () {
        assert(this._isOpen, 'menu cannot be closed');
        this.isAnimating = true;
        var ani = this.animation.direction('reverse');
        ani.play({ sync: true });
        this.afterAnimation(false);
    };
    class_1.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this, isEndSide = _b.isEndSide, type = _b.type, disabled = _b.disabled, mode = _b.mode, isPaneVisible = _b.isPaneVisible;
        return (h(Host, { role: "navigation", class: (_a = {},
                _a[mode] = true,
                _a["menu-type-" + type] = true,
                _a['menu-enabled'] = !disabled,
                _a['menu-side-end'] = isEndSide,
                _a['menu-side-start'] = !isEndSide,
                _a['menu-pane-visible'] = isPaneVisible,
                _a) }, h("div", { class: "menu-inner", ref: function (el) { return _this.menuInnerEl = el; } }, h("slot", null)), h("ion-backdrop", { ref: function (el) { return _this.backdropEl = el; }, class: "menu-backdrop", tappable: false, stopPropagation: false })));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "type": ["typeChanged"],
                "disabled": ["disabledChanged"],
                "side": ["sideChanged"],
                "swipeGesture": ["swipeGestureChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color,#fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{left:0;right:auto;top:0;bottom:0;-webkit-transform:translate3d(-9999px,0,0);transform:translate3d(-9999px,0,0);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}:host-context([dir=rtl]) .menu-inner,[dir=rtl] .menu-inner{left:unset;right:unset;left:auto;right:0;-webkit-transform:translate3d(calc(-1 * -9999px),0,0);transform:translate3d(calc(-1 * -9999px),0,0)}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;right:auto;left:0}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;right:0;left:auto}ion-backdrop{display:none;opacity:.01;z-index:-1}\@media (max-width:340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translateZ(0);transform:translateZ(0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){width:var(--width);min-width:var(--min-width);max-width:var(--max-width)}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none!important;transform:none!important;-webkit-box-shadow:none!important;box-shadow:none!important}:host(.menu-pane-visible) ion-backdrop{display:hidden!important}:host(.menu-type-overlay) .menu-inner{-webkit-box-shadow:4px 0 16px rgba(0,0,0,.18);box-shadow:4px 0 16px rgba(0,0,0,.18)}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var computeDelta = function (deltaX, isOpen, isEndSide) {
    return Math.max(0, isOpen !== isEndSide ? -deltaX : deltaX);
};
var checkEdgeSide = function (win, posX, isEndSide, maxEdgeStart) {
    if (isEndSide) {
        return posX >= win.innerWidth - maxEdgeStart;
    }
    else {
        return posX <= maxEdgeStart;
    }
};
var SHOW_MENU = 'show-menu';
var SHOW_BACKDROP = 'show-backdrop';
var MENU_CONTENT_OPEN = 'menu-content-open';
// Given a menu, return whether or not the menu toggle should be visible
var updateVisibility = function (menu) { return __awaiter(void 0, void 0, void 0, function () {
    var menuEl, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, menuController.get(menu)];
            case 1:
                menuEl = _b.sent();
                _a = menuEl;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, menuEl.isActive()];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3: return [2 /*return*/, !!(_a)];
        }
    });
}); };
var MenuButton = /** @class */ (function () {
    function class_2(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.visible = false;
        /**
         * If `true`, the user cannot interact with the menu button.
         */
        this.disabled = false;
        /**
         * Automatically hides the menu button when the corresponding menu is not active
         */
        this.autoHide = true;
        /**
         * The type of the button.
         */
        this.type = 'button';
        this.onClick = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, menuController.toggle(this.menu)];
            });
        }); };
    }
    class_2.prototype.componentDidLoad = function () {
        this.visibilityChanged();
    };
    class_2.prototype.visibilityChanged = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, updateVisibility(this.menu)];
                    case 1:
                        _a.visible = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_2.prototype.render = function () {
        var _a;
        var _b = this, color = _b.color, disabled = _b.disabled;
        var mode = getIonMode(this);
        var menuIcon = config.get('menuIcon', mode === 'ios' ? 'menu-outline' : 'menu-sharp');
        var hidden = this.autoHide && !this.visible;
        var attrs = {
            type: this.type
        };
        return (h(Host, { onClick: this.onClick, "aria-disabled": disabled ? 'true' : null, "aria-hidden": hidden ? 'true' : null, class: Object.assign(Object.assign((_a = {}, _a[mode] = true, _a), createColorClasses(color)), { 'button': true, 'menu-button-hidden': hidden, 'menu-button-disabled': disabled, 'in-toolbar': hostContext('ion-toolbar', this.el), 'in-toolbar-color': hostContext('ion-toolbar[color]', this.el), 'ion-activatable': true, 'ion-focusable': true }) }, h("button", Object.assign({}, attrs, { disabled: disabled, class: "button-native" }), h("span", { class: "button-inner" }, h("slot", null, h("ion-icon", { icon: menuIcon, mode: mode, lazy: false }))), mode === 'md' && h("ion-ripple-effect", { type: "unbounded" }))));
    };
    Object.defineProperty(class_2.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_2, "style", {
        get: function () { return ":host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.button-native{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native:after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native:after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}\@media (any-hover:hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native:after{background:var(--background-hover);opacity:var(--background-hover-opacity,0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color,var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.12;--background-hover:currentColor;--background-hover-opacity:.04;--border-radius:50%;--color:initial;--padding-start:8px;--padding-end:8px;width:48px;height:48px;font-size:24px}:host(.ion-color.ion-focused):after{background:var(--ion-color-base)}\@media (any-hover:hover){:host(.ion-color:hover) .button-native:after{background:var(--ion-color-base)}}"; },
        enumerable: true,
        configurable: true
    });
    return class_2;
}());
var MenuToggle = /** @class */ (function () {
    function class_3(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.visible = false;
        /**
         * Automatically hides the content when the corresponding menu is not active.
         *
         * By default, it's `true`. Change it to `false` in order to
         * keep `ion-menu-toggle` always visible regardless the state of the menu.
         */
        this.autoHide = true;
        this.onClick = function () {
            return menuController.toggle(_this.menu);
        };
    }
    class_3.prototype.connectedCallback = function () {
        this.visibilityChanged();
    };
    class_3.prototype.visibilityChanged = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, updateVisibility(this.menu)];
                    case 1:
                        _a.visible = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_3.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        var hidden = this.autoHide && !this.visible;
        return (h(Host, { onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: (_a = {},
                _a[mode] = true,
                _a['menu-toggle-hidden'] = hidden,
                _a) }, h("slot", null)));
    };
    Object.defineProperty(class_3, "style", {
        get: function () { return ":host(.menu-toggle-hidden){display:none}"; },
        enumerable: true,
        configurable: true
    });
    return class_3;
}());
export { Menu as ion_menu, MenuButton as ion_menu_button, MenuToggle as ion_menu_toggle };
