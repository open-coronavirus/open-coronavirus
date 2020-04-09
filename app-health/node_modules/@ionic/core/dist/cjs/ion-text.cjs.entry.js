'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-1c31ee1f.js');
require('./config-03608b68.js');
const theme = require('./theme-bb3a6213.js');

const Text = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    render() {
        const mode = core.getIonMode(this);
        return (core.h(core.Host, { class: Object.assign(Object.assign({}, theme.createColorClasses(this.color)), { [mode]: true }) }, core.h("slot", null)));
    }
    static get style() { return ":host(.ion-color){color:var(--ion-color-base)}"; }
};

exports.ion_text = Text;
