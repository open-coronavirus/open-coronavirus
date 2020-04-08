export { g as getPlatforms, i as isPlatform } from './config-3c7f3790.js';
import './helpers-46f4a262.js';
export { c as createAnimation } from './animation-56279521.js';
export { g as getTimeGivenProgression } from './cubic-bezier-1d592096.js';
export { createGesture } from './index-c38df685.js';
export { a as LIFECYCLE_DID_ENTER, c as LIFECYCLE_DID_LEAVE, L as LIFECYCLE_WILL_ENTER, b as LIFECYCLE_WILL_LEAVE, d as LIFECYCLE_WILL_UNLOAD } from './constants-3c3e1099.js';
import './hardware-back-button-1ed0083a.js';
export { m as menuController } from './index-c58c7441.js';
export { b as actionSheetController, a as alertController, l as loadingController, m as modalController, p as pickerController, c as popoverController, t as toastController } from './overlays-e336664a.js';
var setupConfig = function (config) {
    var win = window;
    var Ionic = win.Ionic;
    if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
        console.error('ionic config was already initialized');
        return;
    }
    win.Ionic = win.Ionic || {};
    win.Ionic.config = Object.assign(Object.assign({}, win.Ionic.config), config);
    return win.Ionic.config;
};
var getMode = function () {
    var win = window;
    var config = win && win.Ionic && win.Ionic.config;
    if (config) {
        if (config.mode) {
            return config.mode;
        }
        else {
            return config.get('mode');
        }
    }
    return 'md';
};
export { getMode, setupConfig };
