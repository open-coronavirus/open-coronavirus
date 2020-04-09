"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const common_2 = require("../common");
const plugin_1 = require("../plugin");
async function doctorIOS(config) {
    // DOCTOR ideas for iOS:
    // plugin specific warnings
    // check cocoapods installed
    // check projects exist
    // check content in www === ios/www
    // check CLI versions
    // check plugins versions
    // check native project deps are up-to-date === npm install
    // check if npm install was updated
    // check online datebase of common errors
    // check if www folder is empty (index.html does not exist)
    try {
        await common_2.check(config, [common_1.checkCocoaPods, common_1.checkIOSProject, common_2.checkWebDir, checkNPMVersion, checkXcode]);
        const plugins = await plugin_1.getPlugins(config);
        plugin_1.printPlugins(plugins, 'ios');
        common_2.logSuccess('iOS looking great! 👌');
    }
    catch (e) {
        common_2.logFatal(e);
    }
}
exports.doctorIOS = doctorIOS;
async function checkXcode() {
    if (!await common_2.isInstalled('xcodebuild')) {
        return `Xcode is not installed`;
    }
    // const matches = output.match(/^Xcode (.*)/);
    // if (matches && matches.length === 2) {
    //   const minVersion = '9.0.0';
    //   const semver = await import('semver');
    //   console.log(matches[1]);
    //   if (semver.gt(minVersion, matches[1])) {
    //     return `Xcode version is too old, ${minVersion} is required`;
    //   }
    // }
    return null;
}
async function checkNPMVersion() {
    const minVersion = '5.5.0';
    const version = await common_2.runCommand('npm -v');
    const semver = await Promise.resolve().then(() => require('semver'));
    if (semver.gt(minVersion, version)) {
        return `Capacitor CLI requires at least NPM ${minVersion}`;
    }
    return null;
}
