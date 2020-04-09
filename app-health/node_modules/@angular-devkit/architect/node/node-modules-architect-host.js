"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@angular-devkit/core/node");
const path = require("path");
const internal_1 = require("../src/internal");
// TODO: create a base class for all workspace related hosts.
class WorkspaceNodeModulesArchitectHost {
    constructor(_workspace, _root) {
        this._workspace = _workspace;
        this._root = _root;
    }
    async getBuilderNameForTarget(target) {
        const targetDefinition = this.findProjectTarget(target);
        if (!targetDefinition) {
            throw new Error('Project target does not exist.');
        }
        return targetDefinition.builder;
    }
    /**
     * Resolve a builder. This needs to be a string which will be used in a dynamic `import()`
     * clause. This should throw if no builder can be found. The dynamic import will throw if
     * it is unsupported.
     * @param builderStr The name of the builder to be used.
     * @returns All the info needed for the builder itself.
     */
    resolveBuilder(builderStr) {
        const [packageName, builderName] = builderStr.split(':', 2);
        if (!builderName) {
            throw new Error('No builder name specified.');
        }
        const packageJsonPath = node_1.resolve(packageName, {
            basedir: this._root,
            checkLocal: true,
            checkGlobal: true,
            resolvePackageJson: true,
        });
        const packageJson = require(packageJsonPath);
        if (!packageJson['builders']) {
            throw new Error(`Package ${JSON.stringify(packageName)} has no builders defined.`);
        }
        const builderJsonPath = path.resolve(path.dirname(packageJsonPath), packageJson['builders']);
        const builderJson = require(builderJsonPath);
        const builder = builderJson.builders && builderJson.builders[builderName];
        if (!builder) {
            throw new Error(`Cannot find builder ${JSON.stringify(builderStr)}.`);
        }
        const importPath = builder.implementation;
        if (!importPath) {
            throw new Error('Could not find the implementation for builder ' + builderStr);
        }
        return Promise.resolve({
            name: builderStr,
            builderName,
            description: builder['description'],
            optionSchema: require(path.resolve(path.dirname(builderJsonPath), builder.schema)),
            import: path.resolve(path.dirname(builderJsonPath), importPath),
        });
    }
    async getCurrentDirectory() {
        return process.cwd();
    }
    async getWorkspaceRoot() {
        return this._root;
    }
    async getOptionsForTarget(target) {
        const targetSpec = this.findProjectTarget(target);
        if (targetSpec === undefined) {
            return null;
        }
        if (target.configuration
            && !(targetSpec['configurations'] && targetSpec['configurations'][target.configuration])) {
            throw new Error(`Configuration '${target.configuration}' is not set in the workspace.`);
        }
        return {
            ...targetSpec['options'],
            ...(target.configuration ? targetSpec['configurations'][target.configuration] : 0),
        };
    }
    async loadBuilder(info) {
        const builder = (await Promise.resolve().then(() => require(info.import))).default;
        if (builder[internal_1.BuilderSymbol]) {
            return builder;
        }
        throw new Error('Builder is not a builder');
    }
    findProjectTarget(target) {
        // NOTE: Remove conditional when deprecated support for experimental workspace API is removed.
        if ('getProjectTargets' in this._workspace) {
            return this._workspace.getProjectTargets(target.project)[target.target];
        }
        else {
            const projectDefinition = this._workspace.projects.get(target.project);
            if (!projectDefinition) {
                throw new Error('Project does not exist.');
            }
            return projectDefinition.targets.get(target.target);
        }
    }
}
exports.WorkspaceNodeModulesArchitectHost = WorkspaceNodeModulesArchitectHost;
