"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
class NodePackageInstallTaskOptions {
}
exports.NodePackageInstallTaskOptions = NodePackageInstallTaskOptions;
class NodePackageInstallTask {
    constructor(options) {
        this.quiet = true;
        if (typeof options === 'string') {
            this.workingDirectory = options;
        }
        else if (typeof options === 'object') {
            if (options.quiet != undefined) {
                this.quiet = options.quiet;
            }
            if (options.workingDirectory != undefined) {
                this.workingDirectory = options.workingDirectory;
            }
            if (options.packageManager != undefined) {
                this.packageManager = options.packageManager;
            }
            if (options.packageName != undefined) {
                this.packageName = options.packageName;
            }
        }
    }
    toConfiguration() {
        return {
            name: options_1.NodePackageName,
            options: {
                command: 'install',
                quiet: this.quiet,
                workingDirectory: this.workingDirectory,
                packageManager: this.packageManager,
                packageName: this.packageName,
            },
        };
    }
}
exports.NodePackageInstallTask = NodePackageInstallTask;
