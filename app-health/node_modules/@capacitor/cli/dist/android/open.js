"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const common_1 = require("../common");
const fs_1 = require("../util/fs");
const path_1 = require("path");
async function openAndroid(config) {
    common_1.logInfo(`Opening Android project at ${config.android.platformDir}`);
    if (!await fs_1.existsAsync(path_1.resolve(config.app.rootDir, config.android.platformDir))) {
        throw new Error('Android project does not exist. Create one with "npx cap add android"');
    }
    const opn = await Promise.resolve().then(() => require('open'));
    const dir = config.android.platformDir;
    switch (config.cli.os) {
        case definitions_1.OS.Mac:
            await opn(dir, { app: 'android studio', wait: false });
            break;
        case definitions_1.OS.Windows:
            let androidStudioPath = config.windows.androidStudioPath;
            try {
                if (!fs_1.existsSync(androidStudioPath)) {
                    let commandResult = await common_1.runCommand('REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\Android Studio" /v Path');
                    commandResult = commandResult.replace(/(\r\n|\n|\r)/gm, '');
                    const ix = commandResult.indexOf('REG_SZ');
                    if (ix > 0) {
                        androidStudioPath = commandResult.substring(ix + 6).trim() + '\\bin\\studio64.exe';
                    }
                }
            }
            catch (e) {
                androidStudioPath = '';
            }
            if (androidStudioPath) {
                opn(dir, { app: androidStudioPath, wait: false });
            }
            else {
                common_1.logError('Android Studio not found. Make sure it\'s installed and configure "windowsAndroidStudioPath" ' +
                    'in your capacitor.config.json to point to the location of studio64.exe, using JavaScript-escaped paths:\n' +
                    'Example:\n' +
                    '{\n' +
                    '  "windowsAndroidStudioPath": "C:\\\\Program Files\\\\Android\\\\Android Studio\\\\bin\\\\studio64.exe"\n' +
                    '}');
            }
            break;
        case definitions_1.OS.Linux:
            const linuxError = () => {
                common_1.logError('Unable to launch Android Studio. You must configure "linuxAndroidStudioPath" ' +
                    'in your capacitor.config.json to point to the location of studio.sh, using JavaScript-escaped paths:\n' +
                    'Example:\n' +
                    '{\n' +
                    '  "linuxAndroidStudioPath": "/usr/local/android-studio/bin/studio.sh"\n' +
                    '}');
            };
            try {
                await opn(dir, { app: config.linux.androidStudioPath, wait: true });
            }
            catch (e) {
                linuxError();
            }
            break;
    }
}
exports.openAndroid = openAndroid;
