"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const doctor_1 = require("../android/doctor");
const doctor_2 = require("../ios/doctor");
const emoji_1 = require("../util/emoji");
const chalk_1 = require("chalk");
async function doctorCommand(config, selectedPlatform) {
    common_1.log(`${emoji_1.emoji('💊', '')}   ${chalk_1.default.bold('Capacitor Doctor')}  ${emoji_1.emoji('💊', '')} \n`);
    await doctorCore(config);
    const platforms = config.selectPlatforms(selectedPlatform);
    return Promise.all(platforms.map(platformName => {
        return doctor(config, platformName);
    }));
}
exports.doctorCommand = doctorCommand;
async function doctorCore(config) {
    let cliVersion = await common_1.runCommand(`npm info @capacitor/cli version`);
    let coreVersion = await common_1.runCommand(`npm info @capacitor/core version`);
    let androidVersion = await common_1.runCommand(`npm info @capacitor/android version`);
    let iosVersion = await common_1.runCommand(`npm info @capacitor/ios version`);
    common_1.log(`${chalk_1.default.bold.blue('Latest Dependencies:')}\n`);
    common_1.log(`  ${chalk_1.default.bold('@capacitor/cli:')}`, cliVersion);
    common_1.log(`  ${chalk_1.default.bold('@capacitor/core:')}`, coreVersion);
    common_1.log(`  ${chalk_1.default.bold('@capacitor/android:')}`, androidVersion);
    common_1.log(`  ${chalk_1.default.bold('@capacitor/ios:')}`, iosVersion);
    common_1.log(`${chalk_1.default.bold.blue('Installed Dependencies:')}\n`);
    await printInstalledPackages(config);
    common_1.log('');
}
exports.doctorCore = doctorCore;
async function printInstalledPackages(config) {
    const packageNames = ['@capacitor/cli', '@capacitor/core', '@capacitor/android', '@capacitor/ios'];
    await Promise.all(packageNames.map(async (packageName) => {
        let version;
        const packagePath = common_1.resolveNode(config, packageName, 'package.json');
        if (packagePath) {
            version = (await common_1.readJSON(packagePath)).version;
        }
        common_1.log(`  ${chalk_1.default.bold(packageName)}`, version || 'not installed');
        common_1.log('');
    }));
}
async function doctor(config, platformName) {
    if (platformName === config.ios.name) {
        await doctor_2.doctorIOS(config);
    }
    else if (platformName === config.android.name) {
        await doctor_1.doctorAndroid(config);
    }
    else if (platformName === config.web.name) {
        return Promise.resolve();
    }
    else {
        throw `Platform ${platformName} is not valid.`;
    }
}
exports.doctor = doctor;
