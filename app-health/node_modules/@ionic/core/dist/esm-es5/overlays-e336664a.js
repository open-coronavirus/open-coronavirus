import { __awaiter, __generator, __spreadArrays } from "tslib";
import { b as config } from './config-3c7f3790.js';
import { OVERLAY_BACK_BUTTON_PRIORITY } from './hardware-back-button-1ed0083a.js';
var lastId = 0;
var activeAnimations = new WeakMap();
var createController = function (tagName) {
    return {
        create: function (options) {
            return createOverlay(tagName, options);
        },
        dismiss: function (data, role, id) {
            return dismissOverlay(document, data, role, tagName, id);
        },
        getTop: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, getOverlay(document, tagName)];
                });
            });
        }
    };
};
var alertController = /*@__PURE__*/ createController('ion-alert');
var actionSheetController = /*@__PURE__*/ createController('ion-action-sheet');
var loadingController = /*@__PURE__*/ createController('ion-loading');
var modalController = /*@__PURE__*/ createController('ion-modal');
var pickerController = /*@__PURE__*/ createController('ion-picker');
var popoverController = /*@__PURE__*/ createController('ion-popover');
var toastController = /*@__PURE__*/ createController('ion-toast');
var prepareOverlay = function (el) {
    var doc = document;
    connectListeners(doc);
    var overlayIndex = lastId++;
    el.overlayIndex = overlayIndex;
    if (!el.hasAttribute('id')) {
        el.id = "ion-overlay-" + overlayIndex;
    }
};
var createOverlay = function (tagName, opts) {
    return customElements.whenDefined(tagName).then(function () {
        var doc = document;
        var element = doc.createElement(tagName);
        element.classList.add('overlay-hidden');
        // convert the passed in overlay options into props
        // that get passed down into the new overlay
        Object.assign(element, opts);
        // append the overlay element to the document body
        getAppRoot(doc).appendChild(element);
        return element.componentOnReady();
    });
};
var connectListeners = function (doc) {
    if (lastId === 0) {
        lastId = 1;
        // trap focus inside overlays
        doc.addEventListener('focusin', function (ev) {
            var lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss && !isDescendant(lastOverlay, ev.target)) {
                var firstInput = lastOverlay.querySelector('input,button');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
        // handle back-button click
        doc.addEventListener('ionBackButton', function (ev) {
            var lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss) {
                ev.detail.register(OVERLAY_BACK_BUTTON_PRIORITY, function () {
                    return lastOverlay.dismiss(undefined, BACKDROP);
                });
            }
        });
        // handle ESC to close overlay
        doc.addEventListener('keyup', function (ev) {
            if (ev.key === 'Escape') {
                var lastOverlay = getOverlay(doc);
                if (lastOverlay && lastOverlay.backdropDismiss) {
                    lastOverlay.dismiss(undefined, BACKDROP);
                }
            }
        });
    }
};
var dismissOverlay = function (doc, data, role, overlayTag, id) {
    var overlay = getOverlay(doc, overlayTag, id);
    if (!overlay) {
        return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data, role);
};
var getOverlays = function (doc, selector) {
    if (selector === undefined) {
        selector = 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker,ion-popover,ion-toast';
    }
    return Array.from(doc.querySelectorAll(selector))
        .filter(function (c) { return c.overlayIndex > 0; });
};
var getOverlay = function (doc, overlayTag, id) {
    var overlays = getOverlays(doc, overlayTag);
    return (id === undefined)
        ? overlays[overlays.length - 1]
        : overlays.find(function (o) { return o.id === id; });
};
var present = function (overlay, name, iosEnterAnimation, mdEnterAnimation, opts) { return __awaiter(void 0, void 0, void 0, function () {
    var animationBuilder, completed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (overlay.presented) {
                    return [2 /*return*/];
                }
                overlay.presented = true;
                overlay.willPresent.emit();
                animationBuilder = (overlay.enterAnimation)
                    ? overlay.enterAnimation
                    : config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
                return [4 /*yield*/, overlayAnimation(overlay, animationBuilder, overlay.el, opts)];
            case 1:
                completed = _a.sent();
                if (completed) {
                    overlay.didPresent.emit();
                }
                return [2 /*return*/];
        }
    });
}); };
var dismiss = function (overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) { return __awaiter(void 0, void 0, void 0, function () {
    var animationBuilder, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!overlay.presented) {
                    return [2 /*return*/, false];
                }
                overlay.presented = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                overlay.willDismiss.emit({ data: data, role: role });
                animationBuilder = (overlay.leaveAnimation)
                    ? overlay.leaveAnimation
                    : config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
                if (!(role !== 'gesture')) return [3 /*break*/, 3];
                return [4 /*yield*/, overlayAnimation(overlay, animationBuilder, overlay.el, opts)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                overlay.didDismiss.emit({ data: data, role: role });
                activeAnimations.delete(overlay);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 5];
            case 5:
                overlay.el.remove();
                return [2 /*return*/, true];
        }
    });
}); };
var getAppRoot = function (doc) {
    return doc.querySelector('ion-app') || doc.body;
};
var overlayAnimation = function (overlay, animationBuilder, baseEl, opts) { return __awaiter(void 0, void 0, void 0, function () {
    var aniRoot, animation, activeAni;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Make overlay visible in case it's hidden
                baseEl.classList.remove('overlay-hidden');
                aniRoot = baseEl.shadowRoot || overlay.el;
                animation = animationBuilder(aniRoot, opts);
                if (!overlay.animated || !config.getBoolean('animated', true)) {
                    animation.duration(0);
                }
                if (overlay.keyboardClose) {
                    animation.beforeAddWrite(function () {
                        var activeElement = baseEl.ownerDocument.activeElement;
                        if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
                            activeElement.blur();
                        }
                    });
                }
                activeAni = activeAnimations.get(overlay) || [];
                activeAnimations.set(overlay, __spreadArrays(activeAni, [animation]));
                return [4 /*yield*/, animation.play()];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
var eventMethod = function (element, eventName) {
    var resolve;
    var promise = new Promise(function (r) { return resolve = r; });
    onceEvent(element, eventName, function (event) {
        resolve(event.detail);
    });
    return promise;
};
var onceEvent = function (element, eventName, callback) {
    var handler = function (ev) {
        element.removeEventListener(eventName, handler);
        callback(ev);
    };
    element.addEventListener(eventName, handler);
};
var isCancel = function (role) {
    return role === 'cancel' || role === BACKDROP;
};
var isDescendant = function (parent, child) {
    while (child) {
        if (child === parent) {
            return true;
        }
        child = child.parentElement;
    }
    return false;
};
var defaultGate = function (h) { return h(); };
var safeCall = function (handler, arg) {
    if (typeof handler === 'function') {
        var jmp = config.get('_zoneGate', defaultGate);
        return jmp(function () {
            try {
                return handler(arg);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    return undefined;
};
var BACKDROP = 'backdrop';
export { BACKDROP as B, alertController as a, actionSheetController as b, popoverController as c, prepareOverlay as d, present as e, dismiss as f, eventMethod as g, activeAnimations as h, isCancel as i, loadingController as l, modalController as m, pickerController as p, safeCall as s, toastController as t };
