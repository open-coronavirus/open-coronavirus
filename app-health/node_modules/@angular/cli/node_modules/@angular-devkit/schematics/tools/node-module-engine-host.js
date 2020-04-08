"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const core = require("@angular-devkit/core/node");
const path_1 = require("path");
const export_ref_1 = require("./export-ref");
const file_system_engine_host_base_1 = require("./file-system-engine-host-base");
const file_system_utility_1 = require("./file-system-utility");
class NodePackageDoesNotSupportSchematics extends core_1.BaseException {
    constructor(name) {
        super(`Package ${JSON.stringify(name)} was found but does not support schematics.`);
    }
}
exports.NodePackageDoesNotSupportSchematics = NodePackageDoesNotSupportSchematics;
/**
 * A simple EngineHost that uses NodeModules to resolve collections.
 */
class NodeModulesEngineHost extends file_system_engine_host_base_1.FileSystemEngineHostBase {
    constructor() { super(); }
    _resolvePackageJson(name, basedir = process.cwd()) {
        return core.resolve(name, {
            basedir,
            checkLocal: true,
            checkGlobal: true,
            resolvePackageJson: true,
        });
    }
    _resolvePath(name, basedir = process.cwd()) {
        // Allow relative / absolute paths.
        if (name.startsWith('.') || name.startsWith('/')) {
            return path_1.resolve(basedir, name);
        }
        else {
            // If it's a file inside a package, resolve the package then return the file...
            if (name.split('/').length > (name[0] == '@' ? 2 : 1)) {
                const rest = name.split('/');
                const packageName = rest.shift() + (name[0] == '@' ? '/' + rest.shift() : '');
                return path_1.resolve(core.resolve(packageName, {
                    basedir,
                    checkLocal: true,
                    checkGlobal: true,
                    resolvePackageJson: true,
                }), '..', ...rest);
            }
            return core.resolve(name, {
                basedir,
                checkLocal: true,
                checkGlobal: true,
            });
        }
    }
    _resolveCollectionPath(name) {
        let collectionPath = undefined;
        if (name.replace(/\\/g, '/').split('/').length > (name[0] == '@' ? 2 : 1)) {
            try {
                collectionPath = this._resolvePath(name, process.cwd());
            }
            catch (_a) {
            }
        }
        if (!collectionPath) {
            let packageJsonPath = this._resolvePackageJson(name, process.cwd());
            // If it's a file, use it as is. Otherwise append package.json to it.
            if (!core.fs.isFile(packageJsonPath)) {
                packageJsonPath = path_1.join(packageJsonPath, 'package.json');
            }
            const pkgJsonSchematics = require(packageJsonPath)['schematics'];
            if (!pkgJsonSchematics || typeof pkgJsonSchematics != 'string') {
                throw new NodePackageDoesNotSupportSchematics(name);
            }
            collectionPath = this._resolvePath(pkgJsonSchematics, path_1.dirname(packageJsonPath));
        }
        try {
            if (collectionPath) {
                file_system_utility_1.readJsonFile(collectionPath);
                return collectionPath;
            }
        }
        catch (e) {
            if (e instanceof core_1.InvalidJsonCharacterException || e instanceof core_1.UnexpectedEndOfInputException) {
                throw new file_system_engine_host_base_1.InvalidCollectionJsonException(name, collectionPath, e);
            }
        }
        throw new file_system_engine_host_base_1.CollectionCannotBeResolvedException(name);
    }
    _resolveReferenceString(refString, parentPath) {
        const ref = new export_ref_1.ExportStringRef(refString, parentPath);
        if (!ref.ref) {
            return null;
        }
        return { ref: ref.ref, path: ref.module };
    }
    _transformCollectionDescription(name, desc) {
        if (!desc.schematics || typeof desc.schematics != 'object') {
            throw new file_system_engine_host_base_1.CollectionMissingSchematicsMapException(name);
        }
        return {
            ...desc,
            name,
        };
    }
    _transformSchematicDescription(name, _collection, desc) {
        if (!desc.factoryFn || !desc.path || !desc.description) {
            throw new file_system_engine_host_base_1.SchematicMissingFieldsException(name);
        }
        return desc;
    }
}
exports.NodeModulesEngineHost = NodeModulesEngineHost;
