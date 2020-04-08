"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const common_2 = require("../common");
exports.addIOSChecks = [common_1.checkCocoaPods];
async function addIOS(config) {
    await common_2.runTask(`Installing iOS dependencies`, async (info) => {
        if (common_2.resolveNode(config, '@capacitor/ios')) {
            info('Skipping: already installed');
            return;
        }
        return common_2.installDeps(config.app.rootDir, ['@capacitor/ios'], config);
    });
    await common_2.runTask(`Adding native xcode project in: ${config.ios.platformDir}`, () => {
        return common_2.copyTemplate(config.ios.assets.templateDir, config.ios.platformDir);
    });
}
exports.addIOS = addIOS;
