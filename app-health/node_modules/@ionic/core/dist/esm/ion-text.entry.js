import { r as registerInstance, c as getIonMode, h, H as Host } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';
import { c as createColorClasses } from './theme-18cbe2cc.js';

const Text = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host(.ion-color){color:var(--ion-color-base)}"; }
};

export { Text as ion_text };
