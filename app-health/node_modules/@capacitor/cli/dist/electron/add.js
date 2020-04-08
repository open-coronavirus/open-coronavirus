"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const common_1 = require("../common");
async function addElectron(config) {
    await common_1.runTask(`Adding Electron project in: ${config.electron.platformDir}`, async () => {
        return common_1.copyTemplate(config.electron.assets.templateDir, config.electron.platformDir);
    });
    await common_1.runTask(`Installing NPM Dependencies`, async () => {
        return installNpmDeps(config);
    });
}
exports.addElectron = addElectron;
function installNpmDeps(config) {
    const pathToElectronPackageJson = config.electron.platformDir;
    return new Promise(async (resolve, reject) => {
        child_process_1.exec(`${await common_1.hasYarn(config) ? 'yarn' : 'npm'} install`, { cwd: pathToElectronPackageJson }, async (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            await common_1.installDeps(pathToElectronPackageJson, ['@capacitor/electron'], config);
            resolve();
        });
    });
}
