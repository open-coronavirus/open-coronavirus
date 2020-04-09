import { r as registerInstance, c as getIonMode, h, H as Host } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';
import { c as createColorClasses } from './theme-18cbe2cc.js';
var Text = /** @class */ (function () {
    function Text(hostRef) {
        registerInstance(this, hostRef);
    }
    Text.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a)) }, h("slot", null)));
    };
    Object.defineProperty(Text, "style", {
        get: function () { return ":host(.ion-color){color:var(--ion-color-base)}"; },
        enumerable: true,
        configurable: true
    });
    return Text;
}());
export { Text as ion_text };
