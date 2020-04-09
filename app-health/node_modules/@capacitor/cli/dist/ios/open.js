"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const common_2 = require("../common");
async function openIOS(config) {
    const xcodeProject = await common_1.findXcodePath(config);
    if (xcodeProject) {
        const opn = await Promise.resolve().then(() => require('open'));
        await opn(xcodeProject, { wait: false });
        await common_2.wait(3000);
    }
    else {
        throw new Error('Xcode workspace does not exist. ' +
            'Run "capacitor add ios" to bootstrap a native ios project.');
    }
}
exports.openIOS = openIOS;
