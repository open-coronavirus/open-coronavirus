/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/diagnostics/typescript_symbols", ["require", "exports", "tslib", "path", "typescript", "@angular/compiler-cli/src/diagnostics/symbols", "@angular/compiler-cli/src/diagnostics/typescript_version"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var path = require("path");
    var ts = require("typescript");
    var symbols_1 = require("@angular/compiler-cli/src/diagnostics/symbols");
    var typescript_version_1 = require("@angular/compiler-cli/src/diagnostics/typescript_version");
    // In TypeScript 2.1 these flags moved
    // These helpers work for both 2.0 and 2.1.
    var isPrivate = ts.ModifierFlags ?
        (function (node) {
            return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private);
        }) :
        (function (node) { return !!(node.flags & ts.NodeFlags.Private); });
    var isReferenceType = ts.ObjectFlags ?
        (function (type) {
            return !!(type.flags & ts.TypeFlags.Object &&
                type.objectFlags & ts.ObjectFlags.Reference);
        }) :
        (function (type) { return !!(type.flags & ts.TypeFlags.Reference); });
    function getSymbolQuery(program, checker, source, fetchPipes) {
        return new TypeScriptSymbolQuery(program, checker, source, fetchPipes);
    }
    exports.getSymbolQuery = getSymbolQuery;
    function getClassMembers(program, checker, staticSymbol) {
        var declaration = getClassFromStaticSymbol(program, staticSymbol);
        if (declaration) {
            var type = checker.getTypeAtLocation(declaration);
            var node = program.getSourceFile(staticSymbol.filePath);
            if (node) {
                return new TypeWrapper(type, { node: node, program: program, checker: checker }).members();
            }
        }
    }
    exports.getClassMembers = getClassMembers;
    function getClassMembersFromDeclaration(program, checker, source, declaration) {
        var type = checker.getTypeAtLocation(declaration);
        return new TypeWrapper(type, { node: source, program: program, checker: checker }).members();
    }
    exports.getClassMembersFromDeclaration = getClassMembersFromDeclaration;
    function getClassFromStaticSymbol(program, type) {
        var source = program.getSourceFile(type.filePath);
        if (source) {
            return ts.forEachChild(source, function (child) {
                if (child.kind === ts.SyntaxKind.ClassDeclaration) {
                    var classDeclaration = child;
                    if (classDeclaration.name != null && classDeclaration.name.text === type.name) {
                        return classDeclaration;
                    }
                }
            });
        }
        return undefined;
    }
    exports.getClassFromStaticSymbol = getClassFromStaticSymbol;
    function getPipesTable(source, program, checker, pipes) {
        return new PipesTable(pipes, { program: program, checker: checker, node: source });
    }
    exports.getPipesTable = getPipesTable;
    var TypeScriptSymbolQuery = /** @class */ (function () {
        function TypeScriptSymbolQuery(program, checker, source, fetchPipes) {
            this.program = program;
            this.checker = checker;
            this.source = source;
            this.fetchPipes = fetchPipes;
            this.typeCache = new Map();
        }
        TypeScriptSymbolQuery.prototype.getTypeKind = function (symbol) { return typeKindOf(this.getTsTypeOf(symbol)); };
        TypeScriptSymbolQuery.prototype.getBuiltinType = function (kind) {
            var result = this.typeCache.get(kind);
            if (!result) {
                var type = getBuiltinTypeFromTs(kind, { checker: this.checker, node: this.source, program: this.program });
                result =
                    new TypeWrapper(type, { program: this.program, checker: this.checker, node: this.source });
                this.typeCache.set(kind, result);
            }
            return result;
        };
        TypeScriptSymbolQuery.prototype.getTypeUnion = function () {
            var types = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                types[_i] = arguments[_i];
            }
            // No API exists so return any if the types are not all the same type.
            var result = undefined;
            if (types.length) {
                result = types[0];
                for (var i = 1; i < types.length; i++) {
                    if (types[i] != result) {
                        result = undefined;
                        break;
                    }
                }
            }
            return result || this.getBuiltinType(symbols_1.BuiltinType.Any);
        };
        TypeScriptSymbolQuery.prototype.getArrayType = function (type) { return this.getBuiltinType(symbols_1.BuiltinType.Any); };
        TypeScriptSymbolQuery.prototype.getElementType = function (type) {
            if (type instanceof TypeWrapper) {
                var elementType = getTypeParameterOf(type.tsType, 'Array');
                if (elementType) {
                    return new TypeWrapper(elementType, type.context);
                }
            }
        };
        TypeScriptSymbolQuery.prototype.getNonNullableType = function (symbol) {
            if (symbol instanceof TypeWrapper && (typeof this.checker.getNonNullableType == 'function')) {
                var tsType = symbol.tsType;
                var nonNullableType = this.checker.getNonNullableType(tsType);
                if (nonNullableType != tsType) {
                    return new TypeWrapper(nonNullableType, symbol.context);
                }
                else if (nonNullableType == tsType) {
                    return symbol;
                }
            }
            return this.getBuiltinType(symbols_1.BuiltinType.Any);
        };
        TypeScriptSymbolQuery.prototype.getPipes = function () {
            var result = this.pipesCache;
            if (!result) {
                result = this.pipesCache = this.fetchPipes();
            }
            return result;
        };
        TypeScriptSymbolQuery.prototype.getTemplateContext = function (type) {
            var context = { node: this.source, program: this.program, checker: this.checker };
            var typeSymbol = findClassSymbolInContext(type, context);
            if (typeSymbol) {
                var contextType = this.getTemplateRefContextType(typeSymbol);
                if (contextType)
                    return new SymbolWrapper(contextType, context).members();
            }
        };
        TypeScriptSymbolQuery.prototype.getTypeSymbol = function (type) {
            var context = { node: this.source, program: this.program, checker: this.checker };
            var typeSymbol = findClassSymbolInContext(type, context);
            return typeSymbol && new SymbolWrapper(typeSymbol, context);
        };
        TypeScriptSymbolQuery.prototype.createSymbolTable = function (symbols) {
            var result = new MapSymbolTable();
            result.addAll(symbols.map(function (s) { return new DeclaredSymbol(s); }));
            return result;
        };
        TypeScriptSymbolQuery.prototype.mergeSymbolTable = function (symbolTables) {
            var e_1, _a;
            var result = new MapSymbolTable();
            try {
                for (var symbolTables_1 = tslib_1.__values(symbolTables), symbolTables_1_1 = symbolTables_1.next(); !symbolTables_1_1.done; symbolTables_1_1 = symbolTables_1.next()) {
                    var symbolTable = symbolTables_1_1.value;
                    result.addAll(symbolTable.values());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (symbolTables_1_1 && !symbolTables_1_1.done && (_a = symbolTables_1.return)) _a.call(symbolTables_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        };
        TypeScriptSymbolQuery.prototype.getSpanAt = function (line, column) {
            return spanAt(this.source, line, column);
        };
        TypeScriptSymbolQuery.prototype.getTemplateRefContextType = function (typeSymbol) {
            var e_2, _a;
            var type = this.checker.getTypeOfSymbolAtLocation(typeSymbol, this.source);
            var constructor = type.symbol && type.symbol.members &&
                getFromSymbolTable(type.symbol.members, '__constructor');
            if (constructor) {
                var constructorDeclaration = constructor.declarations[0];
                try {
                    for (var _b = tslib_1.__values(constructorDeclaration.parameters), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var parameter = _c.value;
                        var type_1 = this.checker.getTypeAtLocation(parameter.type);
                        if (type_1.symbol.name == 'TemplateRef' && isReferenceType(type_1)) {
                            var typeReference = type_1;
                            if (typeReference.typeArguments && typeReference.typeArguments.length === 1) {
                                return typeReference.typeArguments[0].symbol;
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        TypeScriptSymbolQuery.prototype.getTsTypeOf = function (symbol) {
            var type = this.getTypeWrapper(symbol);
            return type && type.tsType;
        };
        TypeScriptSymbolQuery.prototype.getTypeWrapper = function (symbol) {
            var type = undefined;
            if (symbol instanceof TypeWrapper) {
                type = symbol;
            }
            else if (symbol.type instanceof TypeWrapper) {
                type = symbol.type;
            }
            return type;
        };
        return TypeScriptSymbolQuery;
    }());
    function typeCallable(type) {
        var signatures = type.getCallSignatures();
        return signatures && signatures.length != 0;
    }
    function signaturesOf(type, context) {
        return type.getCallSignatures().map(function (s) { return new SignatureWrapper(s, context); });
    }
    function selectSignature(type, context, types) {
        // TODO: Do a better job of selecting the right signature.
        var signatures = type.getCallSignatures();
        return signatures.length ? new SignatureWrapper(signatures[0], context) : undefined;
    }
    var TypeWrapper = /** @class */ (function () {
        function TypeWrapper(tsType, context) {
            this.tsType = tsType;
            this.context = context;
            this.kind = 'type';
            this.language = 'typescript';
            this.type = undefined;
            this.container = undefined;
            this.public = true;
            if (!tsType) {
                throw Error('Internal: null type');
            }
        }
        Object.defineProperty(TypeWrapper.prototype, "name", {
            get: function () {
                var symbol = this.tsType.symbol;
                return (symbol && symbol.name) || '<anonymous>';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TypeWrapper.prototype, "callable", {
            get: function () { return typeCallable(this.tsType); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TypeWrapper.prototype, "nullable", {
            get: function () {
                return this.context.checker.getNonNullableType(this.tsType) != this.tsType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TypeWrapper.prototype, "definition", {
            get: function () {
                var symbol = this.tsType.getSymbol();
                return symbol ? definitionFromTsSymbol(symbol) : undefined;
            },
            enumerable: true,
            configurable: true
        });
        TypeWrapper.prototype.members = function () {
            return new SymbolTableWrapper(this.tsType.getProperties(), this.context);
        };
        TypeWrapper.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
        TypeWrapper.prototype.selectSignature = function (types) {
            return selectSignature(this.tsType, this.context, types);
        };
        TypeWrapper.prototype.indexed = function (argument) { return undefined; };
        return TypeWrapper;
    }());
    var SymbolWrapper = /** @class */ (function () {
        function SymbolWrapper(symbol, context) {
            this.context = context;
            this.nullable = false;
            this.language = 'typescript';
            this.symbol = symbol && context && (symbol.flags & ts.SymbolFlags.Alias) ?
                context.checker.getAliasedSymbol(symbol) :
                symbol;
        }
        Object.defineProperty(SymbolWrapper.prototype, "name", {
            get: function () { return this.symbol.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SymbolWrapper.prototype, "kind", {
            get: function () { return this.callable ? 'method' : 'property'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SymbolWrapper.prototype, "type", {
            get: function () { return new TypeWrapper(this.tsType, this.context); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SymbolWrapper.prototype, "container", {
            get: function () { return getContainerOf(this.symbol, this.context); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SymbolWrapper.prototype, "public", {
            get: function () {
                // Symbols that are not explicitly made private are public.
                return !isSymbolPrivate(this.symbol);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SymbolWrapper.prototype, "callable", {
            get: function () { return typeCallable(this.tsType); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SymbolWrapper.prototype, "definition", {
            get: function () { return definitionFromTsSymbol(this.symbol); },
            enumerable: true,
            configurable: true
        });
        SymbolWrapper.prototype.members = function () {
            if (!this._members) {
                if ((this.symbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)) != 0) {
                    var declaredType = this.context.checker.getDeclaredTypeOfSymbol(this.symbol);
                    var typeWrapper = new TypeWrapper(declaredType, this.context);
                    this._members = typeWrapper.members();
                }
                else {
                    this._members = new SymbolTableWrapper(this.symbol.members, this.context);
                }
            }
            return this._members;
        };
        SymbolWrapper.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
        SymbolWrapper.prototype.selectSignature = function (types) {
            return selectSignature(this.tsType, this.context, types);
        };
        SymbolWrapper.prototype.indexed = function (argument) { return undefined; };
        Object.defineProperty(SymbolWrapper.prototype, "tsType", {
            get: function () {
                var type = this._tsType;
                if (!type) {
                    type = this._tsType =
                        this.context.checker.getTypeOfSymbolAtLocation(this.symbol, this.context.node);
                }
                return type;
            },
            enumerable: true,
            configurable: true
        });
        return SymbolWrapper;
    }());
    var DeclaredSymbol = /** @class */ (function () {
        function DeclaredSymbol(declaration) {
            this.declaration = declaration;
            this.language = 'ng-template';
            this.nullable = false;
            this.public = true;
        }
        Object.defineProperty(DeclaredSymbol.prototype, "name", {
            get: function () { return this.declaration.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeclaredSymbol.prototype, "kind", {
            get: function () { return this.declaration.kind; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeclaredSymbol.prototype, "container", {
            get: function () { return undefined; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeclaredSymbol.prototype, "type", {
            get: function () { return this.declaration.type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeclaredSymbol.prototype, "callable", {
            get: function () { return this.declaration.type.callable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeclaredSymbol.prototype, "definition", {
            get: function () { return this.declaration.definition; },
            enumerable: true,
            configurable: true
        });
        DeclaredSymbol.prototype.members = function () { return this.declaration.type.members(); };
        DeclaredSymbol.prototype.signatures = function () { return this.declaration.type.signatures(); };
        DeclaredSymbol.prototype.selectSignature = function (types) {
            return this.declaration.type.selectSignature(types);
        };
        DeclaredSymbol.prototype.indexed = function (argument) { return undefined; };
        return DeclaredSymbol;
    }());
    var SignatureWrapper = /** @class */ (function () {
        function SignatureWrapper(signature, context) {
            this.signature = signature;
            this.context = context;
        }
        Object.defineProperty(SignatureWrapper.prototype, "arguments", {
            get: function () {
                return new SymbolTableWrapper(this.signature.getParameters(), this.context);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignatureWrapper.prototype, "result", {
            get: function () { return new TypeWrapper(this.signature.getReturnType(), this.context); },
            enumerable: true,
            configurable: true
        });
        return SignatureWrapper;
    }());
    var SignatureResultOverride = /** @class */ (function () {
        function SignatureResultOverride(signature, resultType) {
            this.signature = signature;
            this.resultType = resultType;
        }
        Object.defineProperty(SignatureResultOverride.prototype, "arguments", {
            get: function () { return this.signature.arguments; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignatureResultOverride.prototype, "result", {
            get: function () { return this.resultType; },
            enumerable: true,
            configurable: true
        });
        return SignatureResultOverride;
    }());
    /**
     * Indicates the lower bound TypeScript version supporting `SymbolTable` as an ES6 `Map`.
     * For lower versions, `SymbolTable` is implemented as a dictionary
     */
    var MIN_TS_VERSION_SUPPORTING_MAP = '2.2';
    exports.toSymbolTableFactory = function (tsVersion) { return function (symbols) {
        var e_3, _a, e_4, _b;
        if (typescript_version_1.isVersionBetween(tsVersion, MIN_TS_VERSION_SUPPORTING_MAP)) {
            // ∀ Typescript version >= 2.2, `SymbolTable` is implemented as an ES6 `Map`
            var result_1 = new Map();
            try {
                for (var symbols_2 = tslib_1.__values(symbols), symbols_2_1 = symbols_2.next(); !symbols_2_1.done; symbols_2_1 = symbols_2.next()) {
                    var symbol = symbols_2_1.value;
                    result_1.set(symbol.name, symbol);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (symbols_2_1 && !symbols_2_1.done && (_a = symbols_2.return)) _a.call(symbols_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            // First, tell the compiler that `result` is of type `any`. Then, use a second type assertion
            // to `ts.SymbolTable`.
            // Otherwise, `Map<string, ts.Symbol>` and `ts.SymbolTable` will be considered as incompatible
            // types by the compiler
            return result_1;
        }
        // ∀ Typescript version < 2.2, `SymbolTable` is implemented as a dictionary
        var result = {};
        try {
            for (var symbols_3 = tslib_1.__values(symbols), symbols_3_1 = symbols_3.next(); !symbols_3_1.done; symbols_3_1 = symbols_3.next()) {
                var symbol = symbols_3_1.value;
                result[symbol.name] = symbol;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (symbols_3_1 && !symbols_3_1.done && (_b = symbols_3.return)) _b.call(symbols_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    }; };
    function toSymbols(symbolTable) {
        if (!symbolTable)
            return [];
        var table = symbolTable;
        if (typeof table.values === 'function') {
            return Array.from(table.values());
        }
        var result = [];
        var own = typeof table.hasOwnProperty === 'function' ?
            function (name) { return table.hasOwnProperty(name); } :
            function (name) { return !!table[name]; };
        for (var name in table) {
            if (own(name)) {
                result.push(table[name]);
            }
        }
        return result;
    }
    var SymbolTableWrapper = /** @class */ (function () {
        function SymbolTableWrapper(symbols, context) {
            this.context = context;
            symbols = symbols || [];
            if (Array.isArray(symbols)) {
                this.symbols = symbols;
                var toSymbolTable = exports.toSymbolTableFactory(ts.version);
                this.symbolTable = toSymbolTable(symbols);
            }
            else {
                this.symbols = toSymbols(symbols);
                this.symbolTable = symbols;
            }
        }
        Object.defineProperty(SymbolTableWrapper.prototype, "size", {
            get: function () { return this.symbols.length; },
            enumerable: true,
            configurable: true
        });
        SymbolTableWrapper.prototype.get = function (key) {
            var symbol = getFromSymbolTable(this.symbolTable, key);
            return symbol ? new SymbolWrapper(symbol, this.context) : undefined;
        };
        SymbolTableWrapper.prototype.has = function (key) {
            var table = this.symbolTable;
            return (typeof table.has === 'function') ? table.has(key) : table[key] != null;
        };
        SymbolTableWrapper.prototype.values = function () {
            var _this = this;
            return this.symbols.map(function (s) { return new SymbolWrapper(s, _this.context); });
        };
        return SymbolTableWrapper;
    }());
    var MapSymbolTable = /** @class */ (function () {
        function MapSymbolTable() {
            this.map = new Map();
            this._values = [];
        }
        Object.defineProperty(MapSymbolTable.prototype, "size", {
            get: function () { return this.map.size; },
            enumerable: true,
            configurable: true
        });
        MapSymbolTable.prototype.get = function (key) { return this.map.get(key); };
        MapSymbolTable.prototype.add = function (symbol) {
            if (this.map.has(symbol.name)) {
                var previous = this.map.get(symbol.name);
                this._values[this._values.indexOf(previous)] = symbol;
            }
            this.map.set(symbol.name, symbol);
            this._values.push(symbol);
        };
        MapSymbolTable.prototype.addAll = function (symbols) {
            var e_5, _a;
            try {
                for (var symbols_4 = tslib_1.__values(symbols), symbols_4_1 = symbols_4.next(); !symbols_4_1.done; symbols_4_1 = symbols_4.next()) {
                    var symbol = symbols_4_1.value;
                    this.add(symbol);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (symbols_4_1 && !symbols_4_1.done && (_a = symbols_4.return)) _a.call(symbols_4);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        MapSymbolTable.prototype.has = function (key) { return this.map.has(key); };
        MapSymbolTable.prototype.values = function () {
            // Switch to this.map.values once iterables are supported by the target language.
            return this._values;
        };
        return MapSymbolTable;
    }());
    var PipesTable = /** @class */ (function () {
        function PipesTable(pipes, context) {
            this.pipes = pipes;
            this.context = context;
        }
        Object.defineProperty(PipesTable.prototype, "size", {
            get: function () { return this.pipes.length; },
            enumerable: true,
            configurable: true
        });
        PipesTable.prototype.get = function (key) {
            var pipe = this.pipes.find(function (pipe) { return pipe.name == key; });
            if (pipe) {
                return new PipeSymbol(pipe, this.context);
            }
        };
        PipesTable.prototype.has = function (key) { return this.pipes.find(function (pipe) { return pipe.name == key; }) != null; };
        PipesTable.prototype.values = function () {
            var _this = this;
            return this.pipes.map(function (pipe) { return new PipeSymbol(pipe, _this.context); });
        };
        return PipesTable;
    }());
    // This matches .d.ts files that look like ".../<package-name>/<package-name>.d.ts",
    var INDEX_PATTERN = /[\\/]([^\\/]+)[\\/]\1\.d\.ts$/;
    var PipeSymbol = /** @class */ (function () {
        function PipeSymbol(pipe, context) {
            this.pipe = pipe;
            this.context = context;
            this.kind = 'pipe';
            this.language = 'typescript';
            this.container = undefined;
            this.callable = true;
            this.nullable = false;
            this.public = true;
        }
        Object.defineProperty(PipeSymbol.prototype, "name", {
            get: function () { return this.pipe.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PipeSymbol.prototype, "type", {
            get: function () { return new TypeWrapper(this.tsType, this.context); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PipeSymbol.prototype, "definition", {
            get: function () {
                var symbol = this.tsType.getSymbol();
                return symbol ? definitionFromTsSymbol(symbol) : undefined;
            },
            enumerable: true,
            configurable: true
        });
        PipeSymbol.prototype.members = function () { return EmptyTable.instance; };
        PipeSymbol.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
        PipeSymbol.prototype.selectSignature = function (types) {
            var signature = selectSignature(this.tsType, this.context, types);
            if (types.length == 1) {
                var parameterType = types[0];
                if (parameterType instanceof TypeWrapper) {
                    var resultType = undefined;
                    switch (this.name) {
                        case 'async':
                            switch (parameterType.name) {
                                case 'Observable':
                                case 'Promise':
                                case 'EventEmitter':
                                    resultType = getTypeParameterOf(parameterType.tsType, parameterType.name);
                                    break;
                                default:
                                    resultType = getBuiltinTypeFromTs(symbols_1.BuiltinType.Any, this.context);
                                    break;
                            }
                            break;
                        case 'slice':
                            resultType = getTypeParameterOf(parameterType.tsType, 'Array');
                            break;
                    }
                    if (resultType) {
                        signature = new SignatureResultOverride(signature, new TypeWrapper(resultType, parameterType.context));
                    }
                }
            }
            return signature;
        };
        PipeSymbol.prototype.indexed = function (argument) { return undefined; };
        Object.defineProperty(PipeSymbol.prototype, "tsType", {
            get: function () {
                var type = this._tsType;
                if (!type) {
                    var classSymbol = this.findClassSymbol(this.pipe.type.reference);
                    if (classSymbol) {
                        type = this._tsType = this.findTransformMethodType(classSymbol);
                    }
                    if (!type) {
                        type = this._tsType = getBuiltinTypeFromTs(symbols_1.BuiltinType.Any, this.context);
                    }
                }
                return type;
            },
            enumerable: true,
            configurable: true
        });
        PipeSymbol.prototype.findClassSymbol = function (type) {
            return findClassSymbolInContext(type, this.context);
        };
        PipeSymbol.prototype.findTransformMethodType = function (classSymbol) {
            var classType = this.context.checker.getDeclaredTypeOfSymbol(classSymbol);
            if (classType) {
                var transform = classType.getProperty('transform');
                if (transform) {
                    return this.context.checker.getTypeOfSymbolAtLocation(transform, this.context.node);
                }
            }
        };
        return PipeSymbol;
    }());
    function findClassSymbolInContext(type, context) {
        var sourceFile = context.program.getSourceFile(type.filePath);
        if (!sourceFile) {
            // This handles a case where an <packageName>/index.d.ts and a <packageName>/<packageName>.d.ts
            // are in the same directory. If we are looking for <packageName>/<packageName> and didn't
            // find it, look for <packageName>/index.d.ts as the program might have found that instead.
            var p = type.filePath;
            var m = p.match(INDEX_PATTERN);
            if (m) {
                var indexVersion = path.join(path.dirname(p), 'index.d.ts');
                sourceFile = context.program.getSourceFile(indexVersion);
            }
        }
        if (sourceFile) {
            var moduleSymbol = sourceFile.module || sourceFile.symbol;
            var exports_1 = context.checker.getExportsOfModule(moduleSymbol);
            return (exports_1 || []).find(function (symbol) { return symbol.name == type.name; });
        }
    }
    var EmptyTable = /** @class */ (function () {
        function EmptyTable() {
            this.size = 0;
        }
        EmptyTable.prototype.get = function (key) { return undefined; };
        EmptyTable.prototype.has = function (key) { return false; };
        EmptyTable.prototype.values = function () { return []; };
        EmptyTable.instance = new EmptyTable();
        return EmptyTable;
    }());
    function isSymbolPrivate(s) {
        return !!s.valueDeclaration && isPrivate(s.valueDeclaration);
    }
    function getBuiltinTypeFromTs(kind, context) {
        var type;
        var checker = context.checker;
        var node = context.node;
        switch (kind) {
            case symbols_1.BuiltinType.Any:
                type = checker.getTypeAtLocation(setParents({
                    kind: ts.SyntaxKind.AsExpression,
                    expression: { kind: ts.SyntaxKind.TrueKeyword },
                    type: { kind: ts.SyntaxKind.AnyKeyword }
                }, node));
                break;
            case symbols_1.BuiltinType.Boolean:
                type =
                    checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.TrueKeyword }, node));
                break;
            case symbols_1.BuiltinType.Null:
                type =
                    checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.NullKeyword }, node));
                break;
            case symbols_1.BuiltinType.Number:
                var numeric = {
                    kind: ts.SyntaxKind.NumericLiteral,
                    text: node.getText(),
                };
                setParents({ kind: ts.SyntaxKind.ExpressionStatement, expression: numeric }, node);
                type = checker.getTypeAtLocation(numeric);
                break;
            case symbols_1.BuiltinType.String:
                type = checker.getTypeAtLocation(setParents({
                    kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral,
                    text: node.getText(),
                }, node));
                break;
            case symbols_1.BuiltinType.Undefined:
                type = checker.getTypeAtLocation(setParents({
                    kind: ts.SyntaxKind.VoidExpression,
                    expression: { kind: ts.SyntaxKind.NumericLiteral }
                }, node));
                break;
            default:
                throw new Error("Internal error, unhandled literal kind " + kind + ":" + symbols_1.BuiltinType[kind]);
        }
        return type;
    }
    function setParents(node, parent) {
        node.parent = parent;
        ts.forEachChild(node, function (child) { return setParents(child, node); });
        return node;
    }
    function spanAt(sourceFile, line, column) {
        if (line != null && column != null) {
            var position_1 = ts.getPositionOfLineAndCharacter(sourceFile, line, column);
            var findChild = function findChild(node) {
                if (node.kind > ts.SyntaxKind.LastToken && node.pos <= position_1 && node.end > position_1) {
                    var betterNode = ts.forEachChild(node, findChild);
                    return betterNode || node;
                }
            };
            var node = ts.forEachChild(sourceFile, findChild);
            if (node) {
                return { start: node.getStart(), end: node.getEnd() };
            }
        }
    }
    function definitionFromTsSymbol(symbol) {
        var declarations = symbol.declarations;
        if (declarations) {
            return declarations.map(function (declaration) {
                var sourceFile = declaration.getSourceFile();
                return {
                    fileName: sourceFile.fileName,
                    span: { start: declaration.getStart(), end: declaration.getEnd() }
                };
            });
        }
    }
    function parentDeclarationOf(node) {
        while (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.InterfaceDeclaration:
                    return node;
                case ts.SyntaxKind.SourceFile:
                    return undefined;
            }
            node = node.parent;
        }
    }
    function getContainerOf(symbol, context) {
        var e_6, _a;
        if (symbol.getFlags() & ts.SymbolFlags.ClassMember && symbol.declarations) {
            try {
                for (var _b = tslib_1.__values(symbol.declarations), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var declaration = _c.value;
                    var parent = parentDeclarationOf(declaration);
                    if (parent) {
                        var type = context.checker.getTypeAtLocation(parent);
                        if (type) {
                            return new TypeWrapper(type, context);
                        }
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    }
    function getTypeParameterOf(type, name) {
        if (type && type.symbol && type.symbol.name == name) {
            var typeArguments = type.typeArguments;
            if (typeArguments && typeArguments.length <= 1) {
                return typeArguments[0];
            }
        }
    }
    function typeKindOf(type) {
        var e_7, _a;
        if (type) {
            if (type.flags & ts.TypeFlags.Any) {
                return symbols_1.BuiltinType.Any;
            }
            else if (type.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral)) {
                return symbols_1.BuiltinType.String;
            }
            else if (type.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike)) {
                return symbols_1.BuiltinType.Number;
            }
            else if (type.flags & (ts.TypeFlags.Undefined)) {
                return symbols_1.BuiltinType.Undefined;
            }
            else if (type.flags & (ts.TypeFlags.Null)) {
                return symbols_1.BuiltinType.Null;
            }
            else if (type.flags & ts.TypeFlags.Union) {
                // If all the constituent types of a union are the same kind, it is also that kind.
                var candidate = null;
                var unionType_1 = type;
                if (unionType_1.types.length > 0) {
                    candidate = typeKindOf(unionType_1.types[0]);
                    try {
                        for (var _b = tslib_1.__values(unionType_1.types), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var subType = _c.value;
                            if (candidate != typeKindOf(subType)) {
                                return symbols_1.BuiltinType.Other;
                            }
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                }
                if (candidate != null) {
                    return candidate;
                }
            }
            else if (type.flags & ts.TypeFlags.TypeParameter) {
                return symbols_1.BuiltinType.Unbound;
            }
        }
        return symbols_1.BuiltinType.Other;
    }
    function getFromSymbolTable(symbolTable, key) {
        var table = symbolTable;
        var symbol;
        if (typeof table.get === 'function') {
            // TS 2.2 uses a Map
            symbol = table.get(key);
        }
        else {
            // TS pre-2.2 uses an object
            symbol = table[key];
        }
        return symbol;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9zeW1ib2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy90eXBlc2NyaXB0X3N5bWJvbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBR0gsMkJBQTZCO0lBQzdCLCtCQUFpQztJQUVqQyx5RUFBeUk7SUFDekksK0ZBQXNEO0lBRXRELHNDQUFzQztJQUN0QywyQ0FBMkM7SUFDM0MsSUFBTSxTQUFTLEdBQUksRUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsVUFBQyxJQUFhO1lBQ1YsT0FBQSxDQUFDLENBQUMsQ0FBRSxFQUFVLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEdBQUksRUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFBbEYsQ0FBa0YsQ0FBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQyxVQUFDLElBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUksRUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO0lBRXhFLElBQU0sZUFBZSxHQUFJLEVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxDQUFDLFVBQUMsSUFBYTtZQUNWLE9BQUEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBSSxFQUFVLENBQUMsU0FBUyxDQUFDLE1BQU07Z0JBQ3hDLElBQVksQ0FBQyxXQUFXLEdBQUksRUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7UUFEakUsQ0FDaUUsQ0FBQyxDQUFDLENBQUM7UUFDekUsQ0FBQyxVQUFDLElBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUksRUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENB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Q3pCO2FBQU07WUFDTCw0QkFBNEI7WUFDNUIsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZVBpcGVTdW1tYXJ5LCBTdGF0aWNTeW1ib2x9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtCdWlsdGluVHlwZSwgRGVjbGFyYXRpb25LaW5kLCBEZWZpbml0aW9uLCBTaWduYXR1cmUsIFNwYW4sIFN5bWJvbCwgU3ltYm9sRGVjbGFyYXRpb24sIFN5bWJvbFF1ZXJ5LCBTeW1ib2xUYWJsZX0gZnJvbSAnLi9zeW1ib2xzJztcbmltcG9ydCB7aXNWZXJzaW9uQmV0d2Vlbn0gZnJvbSAnLi90eXBlc2NyaXB0X3ZlcnNpb24nO1xuXG4vLyBJbiBUeXBlU2NyaXB0IDIuMSB0aGVzZSBmbGFncyBtb3ZlZFxuLy8gVGhlc2UgaGVscGVycyB3b3JrIGZvciBib3RoIDIuMCBhbmQgMi4xLlxuY29uc3QgaXNQcml2YXRlID0gKHRzIGFzIGFueSkuTW9kaWZpZXJGbGFncyA/XG4gICAgKChub2RlOiB0cy5Ob2RlKSA9PlxuICAgICAgICAgISEoKHRzIGFzIGFueSkuZ2V0Q29tYmluZWRNb2RpZmllckZsYWdzKG5vZGUpICYgKHRzIGFzIGFueSkuTW9kaWZpZXJGbGFncy5Qcml2YXRlKSkgOlxuICAgICgobm9kZTogdHMuTm9kZSkgPT4gISEobm9kZS5mbGFncyAmICh0cyBhcyBhbnkpLk5vZGVGbGFncy5Qcml2YXRlKSk7XG5cbmNvbnN0IGlzUmVmZXJlbmNlVHlwZSA9ICh0cyBhcyBhbnkpLk9iamVjdEZsYWdzID9cbiAgICAoKHR5cGU6IHRzLlR5cGUpID0+XG4gICAgICAgICAhISh0eXBlLmZsYWdzICYgKHRzIGFzIGFueSkuVHlwZUZsYWdzLk9iamVjdCAmJlxuICAgICAgICAgICAgKHR5cGUgYXMgYW55KS5vYmplY3RGbGFncyAmICh0cyBhcyBhbnkpLk9iamVjdEZsYWdzLlJlZmVyZW5jZSkpIDpcbiAgICAoKHR5cGU6IHRzLlR5cGUpID0+ICEhKHR5cGUuZmxhZ3MgJiAodHMgYXMgYW55KS5UeXBlRmxhZ3MuUmVmZXJlbmNlKSk7XG5cbmludGVyZmFjZSBUeXBlQ29udGV4dCB7XG4gIG5vZGU6IHRzLk5vZGU7XG4gIHByb2dyYW06IHRzLlByb2dyYW07XG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sUXVlcnkoXG4gICAgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgICBmZXRjaFBpcGVzOiAoKSA9PiBTeW1ib2xUYWJsZSk6IFN5bWJvbFF1ZXJ5IHtcbiAgcmV0dXJuIG5ldyBUeXBlU2NyaXB0U3ltYm9sUXVlcnkocHJvZ3JhbSwgY2hlY2tlciwgc291cmNlLCBmZXRjaFBpcGVzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzTWVtYmVycyhcbiAgICBwcm9ncmFtOiB0cy5Qcm9ncmFtLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgc3RhdGljU3ltYm9sOiBTdGF0aWNTeW1ib2wpOiBTeW1ib2xUYWJsZXxcbiAgICB1bmRlZmluZWQge1xuICBjb25zdCBkZWNsYXJhdGlvbiA9IGdldENsYXNzRnJvbVN0YXRpY1N5bWJvbChwcm9ncmFtLCBzdGF0aWNTeW1ib2wpO1xuICBpZiAoZGVjbGFyYXRpb24pIHtcbiAgICBjb25zdCB0eXBlID0gY2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihkZWNsYXJhdGlvbik7XG4gICAgY29uc3Qgbm9kZSA9IHByb2dyYW0uZ2V0U291cmNlRmlsZShzdGF0aWNTeW1ib2wuZmlsZVBhdGgpO1xuICAgIGlmIChub2RlKSB7XG4gICAgICByZXR1cm4gbmV3IFR5cGVXcmFwcGVyKHR5cGUsIHtub2RlLCBwcm9ncmFtLCBjaGVja2VyfSkubWVtYmVycygpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NNZW1iZXJzRnJvbURlY2xhcmF0aW9uKFxuICAgIHByb2dyYW06IHRzLlByb2dyYW0sIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gICAgZGVjbGFyYXRpb246IHRzLkNsYXNzRGVjbGFyYXRpb24pIHtcbiAgY29uc3QgdHlwZSA9IGNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24oZGVjbGFyYXRpb24pO1xuICByZXR1cm4gbmV3IFR5cGVXcmFwcGVyKHR5cGUsIHtub2RlOiBzb3VyY2UsIHByb2dyYW0sIGNoZWNrZXJ9KS5tZW1iZXJzKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzc0Zyb21TdGF0aWNTeW1ib2woXG4gICAgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgdHlwZTogU3RhdGljU3ltYm9sKTogdHMuQ2xhc3NEZWNsYXJhdGlvbnx1bmRlZmluZWQge1xuICBjb25zdCBzb3VyY2UgPSBwcm9ncmFtLmdldFNvdXJjZUZpbGUodHlwZS5maWxlUGF0aCk7XG4gIGlmIChzb3VyY2UpIHtcbiAgICByZXR1cm4gdHMuZm9yRWFjaENoaWxkKHNvdXJjZSwgY2hpbGQgPT4ge1xuICAgICAgaWYgKGNoaWxkLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xuICAgICAgICBjb25zdCBjbGFzc0RlY2xhcmF0aW9uID0gY2hpbGQgYXMgdHMuQ2xhc3NEZWNsYXJhdGlvbjtcbiAgICAgICAgaWYgKGNsYXNzRGVjbGFyYXRpb24ubmFtZSAhPSBudWxsICYmIGNsYXNzRGVjbGFyYXRpb24ubmFtZS50ZXh0ID09PSB0eXBlLm5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY2xhc3NEZWNsYXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pIGFzKHRzLkNsYXNzRGVjbGFyYXRpb24gfCB1bmRlZmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBpcGVzVGFibGUoXG4gICAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLCBwcm9ncmFtOiB0cy5Qcm9ncmFtLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbiAgICBwaXBlczogQ29tcGlsZVBpcGVTdW1tYXJ5W10pOiBTeW1ib2xUYWJsZSB7XG4gIHJldHVybiBuZXcgUGlwZXNUYWJsZShwaXBlcywge3Byb2dyYW0sIGNoZWNrZXIsIG5vZGU6IHNvdXJjZX0pO1xufVxuXG5jbGFzcyBUeXBlU2NyaXB0U3ltYm9sUXVlcnkgaW1wbGVtZW50cyBTeW1ib2xRdWVyeSB7XG4gIHByaXZhdGUgdHlwZUNhY2hlID0gbmV3IE1hcDxCdWlsdGluVHlwZSwgU3ltYm9sPigpO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBwaXBlc0NhY2hlICE6IFN5bWJvbFRhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBwcm9ncmFtOiB0cy5Qcm9ncmFtLCBwcml2YXRlIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBwcml2YXRlIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgICAgIHByaXZhdGUgZmV0Y2hQaXBlczogKCkgPT4gU3ltYm9sVGFibGUpIHt9XG5cbiAgZ2V0VHlwZUtpbmQoc3ltYm9sOiBTeW1ib2wpOiBCdWlsdGluVHlwZSB7IHJldHVybiB0eXBlS2luZE9mKHRoaXMuZ2V0VHNUeXBlT2Yoc3ltYm9sKSk7IH1cblxuICBnZXRCdWlsdGluVHlwZShraW5kOiBCdWlsdGluVHlwZSk6IFN5bWJvbCB7XG4gICAgbGV0IHJlc3VsdCA9IHRoaXMudHlwZUNhY2hlLmdldChraW5kKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgY29uc3QgdHlwZSA9IGdldEJ1aWx0aW5UeXBlRnJvbVRzKFxuICAgICAgICAgIGtpbmQsIHtjaGVja2VyOiB0aGlzLmNoZWNrZXIsIG5vZGU6IHRoaXMuc291cmNlLCBwcm9ncmFtOiB0aGlzLnByb2dyYW19KTtcbiAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgbmV3IFR5cGVXcmFwcGVyKHR5cGUsIHtwcm9ncmFtOiB0aGlzLnByb2dyYW0sIGNoZWNrZXI6IHRoaXMuY2hlY2tlciwgbm9kZTogdGhpcy5zb3VyY2V9KTtcbiAgICAgIHRoaXMudHlwZUNhY2hlLnNldChraW5kLCByZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0VHlwZVVuaW9uKC4uLnR5cGVzOiBTeW1ib2xbXSk6IFN5bWJvbCB7XG4gICAgLy8gTm8gQVBJIGV4aXN0cyBzbyByZXR1cm4gYW55IGlmIHRoZSB0eXBlcyBhcmUgbm90IGFsbCB0aGUgc2FtZSB0eXBlLlxuICAgIGxldCByZXN1bHQ6IFN5bWJvbHx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHR5cGVzLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gdHlwZXNbMF07XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlc1tpXSAhPSByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCB8fCB0aGlzLmdldEJ1aWx0aW5UeXBlKEJ1aWx0aW5UeXBlLkFueSk7XG4gIH1cblxuICBnZXRBcnJheVR5cGUodHlwZTogU3ltYm9sKTogU3ltYm9sIHsgcmV0dXJuIHRoaXMuZ2V0QnVpbHRpblR5cGUoQnVpbHRpblR5cGUuQW55KTsgfVxuXG4gIGdldEVsZW1lbnRUeXBlKHR5cGU6IFN5bWJvbCk6IFN5bWJvbHx1bmRlZmluZWQge1xuICAgIGlmICh0eXBlIGluc3RhbmNlb2YgVHlwZVdyYXBwZXIpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRUeXBlID0gZ2V0VHlwZVBhcmFtZXRlck9mKHR5cGUudHNUeXBlLCAnQXJyYXknKTtcbiAgICAgIGlmIChlbGVtZW50VHlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IFR5cGVXcmFwcGVyKGVsZW1lbnRUeXBlLCB0eXBlLmNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5vbk51bGxhYmxlVHlwZShzeW1ib2w6IFN5bWJvbCk6IFN5bWJvbCB7XG4gICAgaWYgKHN5bWJvbCBpbnN0YW5jZW9mIFR5cGVXcmFwcGVyICYmICh0eXBlb2YgdGhpcy5jaGVja2VyLmdldE5vbk51bGxhYmxlVHlwZSA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgY29uc3QgdHNUeXBlID0gc3ltYm9sLnRzVHlwZTtcbiAgICAgIGNvbnN0IG5vbk51bGxhYmxlVHlwZSA9IHRoaXMuY2hlY2tlci5nZXROb25OdWxsYWJsZVR5cGUodHNUeXBlKTtcbiAgICAgIGlmIChub25OdWxsYWJsZVR5cGUgIT0gdHNUeXBlKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHlwZVdyYXBwZXIobm9uTnVsbGFibGVUeXBlLCBzeW1ib2wuY29udGV4dCk7XG4gICAgICB9IGVsc2UgaWYgKG5vbk51bGxhYmxlVHlwZSA9PSB0c1R5cGUpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0QnVpbHRpblR5cGUoQnVpbHRpblR5cGUuQW55KTtcbiAgfVxuXG4gIGdldFBpcGVzKCk6IFN5bWJvbFRhYmxlIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5waXBlc0NhY2hlO1xuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnBpcGVzQ2FjaGUgPSB0aGlzLmZldGNoUGlwZXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldFRlbXBsYXRlQ29udGV4dCh0eXBlOiBTdGF0aWNTeW1ib2wpOiBTeW1ib2xUYWJsZXx1bmRlZmluZWQge1xuICAgIGNvbnN0IGNvbnRleHQ6IFR5cGVDb250ZXh0ID0ge25vZGU6IHRoaXMuc291cmNlLCBwcm9ncmFtOiB0aGlzLnByb2dyYW0sIGNoZWNrZXI6IHRoaXMuY2hlY2tlcn07XG4gICAgY29uc3QgdHlwZVN5bWJvbCA9IGZpbmRDbGFzc1N5bWJvbEluQ29udGV4dCh0eXBlLCBjb250ZXh0KTtcbiAgICBpZiAodHlwZVN5bWJvbCkge1xuICAgICAgY29uc3QgY29udGV4dFR5cGUgPSB0aGlzLmdldFRlbXBsYXRlUmVmQ29udGV4dFR5cGUodHlwZVN5bWJvbCk7XG4gICAgICBpZiAoY29udGV4dFR5cGUpIHJldHVybiBuZXcgU3ltYm9sV3JhcHBlcihjb250ZXh0VHlwZSwgY29udGV4dCkubWVtYmVycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldFR5cGVTeW1ib2wodHlwZTogU3RhdGljU3ltYm9sKTogU3ltYm9sfHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29udGV4dDogVHlwZUNvbnRleHQgPSB7bm9kZTogdGhpcy5zb3VyY2UsIHByb2dyYW06IHRoaXMucHJvZ3JhbSwgY2hlY2tlcjogdGhpcy5jaGVja2VyfTtcbiAgICBjb25zdCB0eXBlU3ltYm9sID0gZmluZENsYXNzU3ltYm9sSW5Db250ZXh0KHR5cGUsIGNvbnRleHQpO1xuICAgIHJldHVybiB0eXBlU3ltYm9sICYmIG5ldyBTeW1ib2xXcmFwcGVyKHR5cGVTeW1ib2wsIGNvbnRleHQpO1xuICB9XG5cbiAgY3JlYXRlU3ltYm9sVGFibGUoc3ltYm9sczogU3ltYm9sRGVjbGFyYXRpb25bXSk6IFN5bWJvbFRhYmxlIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwU3ltYm9sVGFibGUoKTtcbiAgICByZXN1bHQuYWRkQWxsKHN5bWJvbHMubWFwKHMgPT4gbmV3IERlY2xhcmVkU3ltYm9sKHMpKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG1lcmdlU3ltYm9sVGFibGUoc3ltYm9sVGFibGVzOiBTeW1ib2xUYWJsZVtdKTogU3ltYm9sVGFibGUge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXBTeW1ib2xUYWJsZSgpO1xuICAgIGZvciAoY29uc3Qgc3ltYm9sVGFibGUgb2Ygc3ltYm9sVGFibGVzKSB7XG4gICAgICByZXN1bHQuYWRkQWxsKHN5bWJvbFRhYmxlLnZhbHVlcygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldFNwYW5BdChsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogU3Bhbnx1bmRlZmluZWQge1xuICAgIHJldHVybiBzcGFuQXQodGhpcy5zb3VyY2UsIGxpbmUsIGNvbHVtbik7XG4gIH1cblxuICBwcml2YXRlIGdldFRlbXBsYXRlUmVmQ29udGV4dFR5cGUodHlwZVN5bWJvbDogdHMuU3ltYm9sKTogdHMuU3ltYm9sfHVuZGVmaW5lZCB7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuY2hlY2tlci5nZXRUeXBlT2ZTeW1ib2xBdExvY2F0aW9uKHR5cGVTeW1ib2wsIHRoaXMuc291cmNlKTtcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IHR5cGUuc3ltYm9sICYmIHR5cGUuc3ltYm9sLm1lbWJlcnMgJiZcbiAgICAgICAgZ2V0RnJvbVN5bWJvbFRhYmxlKHR5cGUuc3ltYm9sLm1lbWJlcnMgISwgJ19fY29uc3RydWN0b3InKTtcblxuICAgIGlmIChjb25zdHJ1Y3Rvcikge1xuICAgICAgY29uc3QgY29uc3RydWN0b3JEZWNsYXJhdGlvbiA9IGNvbnN0cnVjdG9yLmRlY2xhcmF0aW9ucyAhWzBdIGFzIHRzLkNvbnN0cnVjdG9yVHlwZU5vZGU7XG4gICAgICBmb3IgKGNvbnN0IHBhcmFtZXRlciBvZiBjb25zdHJ1Y3RvckRlY2xhcmF0aW9uLnBhcmFtZXRlcnMpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuY2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihwYXJhbWV0ZXIudHlwZSAhKTtcbiAgICAgICAgaWYgKHR5cGUuc3ltYm9sICEubmFtZSA9PSAnVGVtcGxhdGVSZWYnICYmIGlzUmVmZXJlbmNlVHlwZSh0eXBlKSkge1xuICAgICAgICAgIGNvbnN0IHR5cGVSZWZlcmVuY2UgPSB0eXBlIGFzIHRzLlR5cGVSZWZlcmVuY2U7XG4gICAgICAgICAgaWYgKHR5cGVSZWZlcmVuY2UudHlwZUFyZ3VtZW50cyAmJiB0eXBlUmVmZXJlbmNlLnR5cGVBcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZVJlZmVyZW5jZS50eXBlQXJndW1lbnRzWzBdLnN5bWJvbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRzVHlwZU9mKHN5bWJvbDogU3ltYm9sKTogdHMuVHlwZXx1bmRlZmluZWQge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLmdldFR5cGVXcmFwcGVyKHN5bWJvbCk7XG4gICAgcmV0dXJuIHR5cGUgJiYgdHlwZS50c1R5cGU7XG4gIH1cblxuICBwcml2YXRlIGdldFR5cGVXcmFwcGVyKHN5bWJvbDogU3ltYm9sKTogVHlwZVdyYXBwZXJ8dW5kZWZpbmVkIHtcbiAgICBsZXQgdHlwZTogVHlwZVdyYXBwZXJ8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmIChzeW1ib2wgaW5zdGFuY2VvZiBUeXBlV3JhcHBlcikge1xuICAgICAgdHlwZSA9IHN5bWJvbDtcbiAgICB9IGVsc2UgaWYgKHN5bWJvbC50eXBlIGluc3RhbmNlb2YgVHlwZVdyYXBwZXIpIHtcbiAgICAgIHR5cGUgPSBzeW1ib2wudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHlwZUNhbGxhYmxlKHR5cGU6IHRzLlR5cGUpOiBib29sZWFuIHtcbiAgY29uc3Qgc2lnbmF0dXJlcyA9IHR5cGUuZ2V0Q2FsbFNpZ25hdHVyZXMoKTtcbiAgcmV0dXJuIHNpZ25hdHVyZXMgJiYgc2lnbmF0dXJlcy5sZW5ndGggIT0gMDtcbn1cblxuZnVuY3Rpb24gc2lnbmF0dXJlc09mKHR5cGU6IHRzLlR5cGUsIGNvbnRleHQ6IFR5cGVDb250ZXh0KTogU2lnbmF0dXJlW10ge1xuICByZXR1cm4gdHlwZS5nZXRDYWxsU2lnbmF0dXJlcygpLm1hcChzID0+IG5ldyBTaWduYXR1cmVXcmFwcGVyKHMsIGNvbnRleHQpKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0U2lnbmF0dXJlKHR5cGU6IHRzLlR5cGUsIGNvbnRleHQ6IFR5cGVDb250ZXh0LCB0eXBlczogU3ltYm9sW10pOiBTaWduYXR1cmV8XG4gICAgdW5kZWZpbmVkIHtcbiAgLy8gVE9ETzogRG8gYSBiZXR0ZXIgam9iIG9mIHNlbGVjdGluZyB0aGUgcmlnaHQgc2lnbmF0dXJlLlxuICBjb25zdCBzaWduYXR1cmVzID0gdHlwZS5nZXRDYWxsU2lnbmF0dXJlcygpO1xuICByZXR1cm4gc2lnbmF0dXJlcy5sZW5ndGggPyBuZXcgU2lnbmF0dXJlV3JhcHBlcihzaWduYXR1cmVzWzBdLCBjb250ZXh0KSA6IHVuZGVmaW5lZDtcbn1cblxuY2xhc3MgVHlwZVdyYXBwZXIgaW1wbGVtZW50cyBTeW1ib2wge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHNUeXBlOiB0cy5UeXBlLCBwdWJsaWMgY29udGV4dDogVHlwZUNvbnRleHQpIHtcbiAgICBpZiAoIXRzVHlwZSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ludGVybmFsOiBudWxsIHR5cGUnKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHNUeXBlLnN5bWJvbDtcbiAgICByZXR1cm4gKHN5bWJvbCAmJiBzeW1ib2wubmFtZSkgfHwgJzxhbm9ueW1vdXM+JztcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBraW5kOiBEZWNsYXJhdGlvbktpbmQgPSAndHlwZSc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGxhbmd1YWdlOiBzdHJpbmcgPSAndHlwZXNjcmlwdCc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IFN5bWJvbHx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lcjogU3ltYm9sfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgcmVhZG9ubHkgcHVibGljOiBib29sZWFuID0gdHJ1ZTtcblxuICBnZXQgY2FsbGFibGUoKTogYm9vbGVhbiB7IHJldHVybiB0eXBlQ2FsbGFibGUodGhpcy50c1R5cGUpOyB9XG5cbiAgZ2V0IG51bGxhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuY2hlY2tlci5nZXROb25OdWxsYWJsZVR5cGUodGhpcy50c1R5cGUpICE9IHRoaXMudHNUeXBlO1xuICB9XG5cbiAgZ2V0IGRlZmluaXRpb24oKTogRGVmaW5pdGlvbnx1bmRlZmluZWQge1xuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMudHNUeXBlLmdldFN5bWJvbCgpO1xuICAgIHJldHVybiBzeW1ib2wgPyBkZWZpbml0aW9uRnJvbVRzU3ltYm9sKHN5bWJvbCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBtZW1iZXJzKCk6IFN5bWJvbFRhYmxlIHtcbiAgICByZXR1cm4gbmV3IFN5bWJvbFRhYmxlV3JhcHBlcih0aGlzLnRzVHlwZS5nZXRQcm9wZXJ0aWVzKCksIHRoaXMuY29udGV4dCk7XG4gIH1cblxuICBzaWduYXR1cmVzKCk6IFNpZ25hdHVyZVtdIHsgcmV0dXJuIHNpZ25hdHVyZXNPZih0aGlzLnRzVHlwZSwgdGhpcy5jb250ZXh0KTsgfVxuXG4gIHNlbGVjdFNpZ25hdHVyZSh0eXBlczogU3ltYm9sW10pOiBTaWduYXR1cmV8dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gc2VsZWN0U2lnbmF0dXJlKHRoaXMudHNUeXBlLCB0aGlzLmNvbnRleHQsIHR5cGVzKTtcbiAgfVxuXG4gIGluZGV4ZWQoYXJndW1lbnQ6IFN5bWJvbCk6IFN5bWJvbHx1bmRlZmluZWQgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG59XG5cbmNsYXNzIFN5bWJvbFdyYXBwZXIgaW1wbGVtZW50cyBTeW1ib2wge1xuICBwcml2YXRlIHN5bWJvbDogdHMuU3ltYm9sO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdHNUeXBlICE6IHRzLlR5cGU7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9tZW1iZXJzICE6IFN5bWJvbFRhYmxlO1xuXG4gIHB1YmxpYyByZWFkb25seSBudWxsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgcmVhZG9ubHkgbGFuZ3VhZ2U6IHN0cmluZyA9ICd0eXBlc2NyaXB0JztcblxuICBjb25zdHJ1Y3RvcihzeW1ib2w6IHRzLlN5bWJvbCwgcHJpdmF0ZSBjb250ZXh0OiBUeXBlQ29udGV4dCkge1xuICAgIHRoaXMuc3ltYm9sID0gc3ltYm9sICYmIGNvbnRleHQgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSA/XG4gICAgICAgIGNvbnRleHQuY2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCkgOlxuICAgICAgICBzeW1ib2w7XG4gIH1cblxuICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zeW1ib2wubmFtZTsgfVxuXG4gIGdldCBraW5kKCk6IERlY2xhcmF0aW9uS2luZCB7IHJldHVybiB0aGlzLmNhbGxhYmxlID8gJ21ldGhvZCcgOiAncHJvcGVydHknOyB9XG5cbiAgZ2V0IHR5cGUoKTogU3ltYm9sfHVuZGVmaW5lZCB7IHJldHVybiBuZXcgVHlwZVdyYXBwZXIodGhpcy50c1R5cGUsIHRoaXMuY29udGV4dCk7IH1cblxuICBnZXQgY29udGFpbmVyKCk6IFN5bWJvbHx1bmRlZmluZWQgeyByZXR1cm4gZ2V0Q29udGFpbmVyT2YodGhpcy5zeW1ib2wsIHRoaXMuY29udGV4dCk7IH1cblxuICBnZXQgcHVibGljKCk6IGJvb2xlYW4ge1xuICAgIC8vIFN5bWJvbHMgdGhhdCBhcmUgbm90IGV4cGxpY2l0bHkgbWFkZSBwcml2YXRlIGFyZSBwdWJsaWMuXG4gICAgcmV0dXJuICFpc1N5bWJvbFByaXZhdGUodGhpcy5zeW1ib2wpO1xuICB9XG5cbiAgZ2V0IGNhbGxhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHlwZUNhbGxhYmxlKHRoaXMudHNUeXBlKTsgfVxuXG4gIGdldCBkZWZpbml0aW9uKCk6IERlZmluaXRpb24geyByZXR1cm4gZGVmaW5pdGlvbkZyb21Uc1N5bWJvbCh0aGlzLnN5bWJvbCk7IH1cblxuICBtZW1iZXJzKCk6IFN5bWJvbFRhYmxlIHtcbiAgICBpZiAoIXRoaXMuX21lbWJlcnMpIHtcbiAgICAgIGlmICgodGhpcy5zeW1ib2wuZmxhZ3MgJiAodHMuU3ltYm9sRmxhZ3MuQ2xhc3MgfCB0cy5TeW1ib2xGbGFncy5JbnRlcmZhY2UpKSAhPSAwKSB7XG4gICAgICAgIGNvbnN0IGRlY2xhcmVkVHlwZSA9IHRoaXMuY29udGV4dC5jaGVja2VyLmdldERlY2xhcmVkVHlwZU9mU3ltYm9sKHRoaXMuc3ltYm9sKTtcbiAgICAgICAgY29uc3QgdHlwZVdyYXBwZXIgPSBuZXcgVHlwZVdyYXBwZXIoZGVjbGFyZWRUeXBlLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLl9tZW1iZXJzID0gdHlwZVdyYXBwZXIubWVtYmVycygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbWVtYmVycyA9IG5ldyBTeW1ib2xUYWJsZVdyYXBwZXIodGhpcy5zeW1ib2wubWVtYmVycyAhLCB0aGlzLmNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbWVtYmVycztcbiAgfVxuXG4gIHNpZ25hdHVyZXMoKTogU2lnbmF0dXJlW10geyByZXR1cm4gc2lnbmF0dXJlc09mKHRoaXMudHNUeXBlLCB0aGlzLmNvbnRleHQpOyB9XG5cbiAgc2VsZWN0U2lnbmF0dXJlKHR5cGVzOiBTeW1ib2xbXSk6IFNpZ25hdHVyZXx1bmRlZmluZWQge1xuICAgIHJldHVybiBzZWxlY3RTaWduYXR1cmUodGhpcy50c1R5cGUsIHRoaXMuY29udGV4dCwgdHlwZXMpO1xuICB9XG5cbiAgaW5kZXhlZChhcmd1bWVudDogU3ltYm9sKTogU3ltYm9sfHVuZGVmaW5lZCB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICBwcml2YXRlIGdldCB0c1R5cGUoKTogdHMuVHlwZSB7XG4gICAgbGV0IHR5cGUgPSB0aGlzLl90c1R5cGU7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICB0eXBlID0gdGhpcy5fdHNUeXBlID1cbiAgICAgICAgICB0aGlzLmNvbnRleHQuY2hlY2tlci5nZXRUeXBlT2ZTeW1ib2xBdExvY2F0aW9uKHRoaXMuc3ltYm9sLCB0aGlzLmNvbnRleHQubm9kZSk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlO1xuICB9XG59XG5cbmNsYXNzIERlY2xhcmVkU3ltYm9sIGltcGxlbWVudHMgU3ltYm9sIHtcbiAgcHVibGljIHJlYWRvbmx5IGxhbmd1YWdlOiBzdHJpbmcgPSAnbmctdGVtcGxhdGUnO1xuXG4gIHB1YmxpYyByZWFkb25seSBudWxsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyByZWFkb25seSBwdWJsaWM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVjbGFyYXRpb246IFN5bWJvbERlY2xhcmF0aW9uKSB7fVxuXG4gIGdldCBuYW1lKCkgeyByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5uYW1lOyB9XG5cbiAgZ2V0IGtpbmQoKSB7IHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLmtpbmQ7IH1cblxuICBnZXQgY29udGFpbmVyKCk6IFN5bWJvbHx1bmRlZmluZWQgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgZ2V0IHR5cGUoKSB7IHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnR5cGU7IH1cblxuICBnZXQgY2FsbGFibGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnR5cGUuY2FsbGFibGU7IH1cblxuXG4gIGdldCBkZWZpbml0aW9uKCk6IERlZmluaXRpb24geyByZXR1cm4gdGhpcy5kZWNsYXJhdGlvbi5kZWZpbml0aW9uOyB9XG5cbiAgbWVtYmVycygpOiBTeW1ib2xUYWJsZSB7IHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnR5cGUubWVtYmVycygpOyB9XG5cbiAgc2lnbmF0dXJlcygpOiBTaWduYXR1cmVbXSB7IHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnR5cGUuc2lnbmF0dXJlcygpOyB9XG5cbiAgc2VsZWN0U2lnbmF0dXJlKHR5cGVzOiBTeW1ib2xbXSk6IFNpZ25hdHVyZXx1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmRlY2xhcmF0aW9uLnR5cGUuc2VsZWN0U2lnbmF0dXJlKHR5cGVzKTtcbiAgfVxuXG4gIGluZGV4ZWQoYXJndW1lbnQ6IFN5bWJvbCk6IFN5bWJvbHx1bmRlZmluZWQgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG59XG5cbmNsYXNzIFNpZ25hdHVyZVdyYXBwZXIgaW1wbGVtZW50cyBTaWduYXR1cmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNpZ25hdHVyZTogdHMuU2lnbmF0dXJlLCBwcml2YXRlIGNvbnRleHQ6IFR5cGVDb250ZXh0KSB7fVxuXG4gIGdldCBhcmd1bWVudHMoKTogU3ltYm9sVGFibGUge1xuICAgIHJldHVybiBuZXcgU3ltYm9sVGFibGVXcmFwcGVyKHRoaXMuc2lnbmF0dXJlLmdldFBhcmFtZXRlcnMoKSwgdGhpcy5jb250ZXh0KTtcbiAgfVxuXG4gIGdldCByZXN1bHQoKTogU3ltYm9sIHsgcmV0dXJuIG5ldyBUeXBlV3JhcHBlcih0aGlzLnNpZ25hdHVyZS5nZXRSZXR1cm5UeXBlKCksIHRoaXMuY29udGV4dCk7IH1cbn1cblxuY2xhc3MgU2lnbmF0dXJlUmVzdWx0T3ZlcnJpZGUgaW1wbGVtZW50cyBTaWduYXR1cmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNpZ25hdHVyZTogU2lnbmF0dXJlLCBwcml2YXRlIHJlc3VsdFR5cGU6IFN5bWJvbCkge31cblxuICBnZXQgYXJndW1lbnRzKCk6IFN5bWJvbFRhYmxlIHsgcmV0dXJuIHRoaXMuc2lnbmF0dXJlLmFyZ3VtZW50czsgfVxuXG4gIGdldCByZXN1bHQoKTogU3ltYm9sIHsgcmV0dXJuIHRoaXMucmVzdWx0VHlwZTsgfVxufVxuXG4vKipcbiAqIEluZGljYXRlcyB0aGUgbG93ZXIgYm91bmQgVHlwZVNjcmlwdCB2ZXJzaW9uIHN1cHBvcnRpbmcgYFN5bWJvbFRhYmxlYCBhcyBhbiBFUzYgYE1hcGAuXG4gKiBGb3IgbG93ZXIgdmVyc2lvbnMsIGBTeW1ib2xUYWJsZWAgaXMgaW1wbGVtZW50ZWQgYXMgYSBkaWN0aW9uYXJ5XG4gKi9cbmNvbnN0IE1JTl9UU19WRVJTSU9OX1NVUFBPUlRJTkdfTUFQID0gJzIuMic7XG5cbmV4cG9ydCBjb25zdCB0b1N5bWJvbFRhYmxlRmFjdG9yeSA9ICh0c1ZlcnNpb246IHN0cmluZykgPT4gKHN5bWJvbHM6IHRzLlN5bWJvbFtdKSA9PiB7XG4gIGlmIChpc1ZlcnNpb25CZXR3ZWVuKHRzVmVyc2lvbiwgTUlOX1RTX1ZFUlNJT05fU1VQUE9SVElOR19NQVApKSB7XG4gICAgLy8g4oiAIFR5cGVzY3JpcHQgdmVyc2lvbiA+PSAyLjIsIGBTeW1ib2xUYWJsZWAgaXMgaW1wbGVtZW50ZWQgYXMgYW4gRVM2IGBNYXBgXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcDxzdHJpbmcsIHRzLlN5bWJvbD4oKTtcbiAgICBmb3IgKGNvbnN0IHN5bWJvbCBvZiBzeW1ib2xzKSB7XG4gICAgICByZXN1bHQuc2V0KHN5bWJvbC5uYW1lLCBzeW1ib2wpO1xuICAgIH1cbiAgICAvLyBGaXJzdCwgdGVsbCB0aGUgY29tcGlsZXIgdGhhdCBgcmVzdWx0YCBpcyBvZiB0eXBlIGBhbnlgLiBUaGVuLCB1c2UgYSBzZWNvbmQgdHlwZSBhc3NlcnRpb25cbiAgICAvLyB0byBgdHMuU3ltYm9sVGFibGVgLlxuICAgIC8vIE90aGVyd2lzZSwgYE1hcDxzdHJpbmcsIHRzLlN5bWJvbD5gIGFuZCBgdHMuU3ltYm9sVGFibGVgIHdpbGwgYmUgY29uc2lkZXJlZCBhcyBpbmNvbXBhdGlibGVcbiAgICAvLyB0eXBlcyBieSB0aGUgY29tcGlsZXJcbiAgICByZXR1cm4gPHRzLlN5bWJvbFRhYmxlPig8YW55PnJlc3VsdCk7XG4gIH1cblxuICAvLyDiiIAgVHlwZXNjcmlwdCB2ZXJzaW9uIDwgMi4yLCBgU3ltYm9sVGFibGVgIGlzIGltcGxlbWVudGVkIGFzIGEgZGljdGlvbmFyeVxuICBjb25zdCByZXN1bHQ6IHtbbmFtZTogc3RyaW5nXTogdHMuU3ltYm9sfSA9IHt9O1xuICBmb3IgKGNvbnN0IHN5bWJvbCBvZiBzeW1ib2xzKSB7XG4gICAgcmVzdWx0W3N5bWJvbC5uYW1lXSA9IHN5bWJvbDtcbiAgfVxuICByZXR1cm4gPHRzLlN5bWJvbFRhYmxlPig8YW55PnJlc3VsdCk7XG59O1xuXG5mdW5jdGlvbiB0b1N5bWJvbHMoc3ltYm9sVGFibGU6IHRzLlN5bWJvbFRhYmxlIHwgdW5kZWZpbmVkKTogdHMuU3ltYm9sW10ge1xuICBpZiAoIXN5bWJvbFRhYmxlKSByZXR1cm4gW107XG5cbiAgY29uc3QgdGFibGUgPSBzeW1ib2xUYWJsZSBhcyBhbnk7XG5cbiAgaWYgKHR5cGVvZiB0YWJsZS52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0YWJsZS52YWx1ZXMoKSkgYXMgdHMuU3ltYm9sW107XG4gIH1cblxuICBjb25zdCByZXN1bHQ6IHRzLlN5bWJvbFtdID0gW107XG5cbiAgY29uc3Qgb3duID0gdHlwZW9mIHRhYmxlLmhhc093blByb3BlcnR5ID09PSAnZnVuY3Rpb24nID9cbiAgICAgIChuYW1lOiBzdHJpbmcpID0+IHRhYmxlLmhhc093blByb3BlcnR5KG5hbWUpIDpcbiAgICAgIChuYW1lOiBzdHJpbmcpID0+ICEhdGFibGVbbmFtZV07XG5cbiAgZm9yIChjb25zdCBuYW1lIGluIHRhYmxlKSB7XG4gICAgaWYgKG93bihuYW1lKSkge1xuICAgICAgcmVzdWx0LnB1c2godGFibGVbbmFtZV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5jbGFzcyBTeW1ib2xUYWJsZVdyYXBwZXIgaW1wbGVtZW50cyBTeW1ib2xUYWJsZSB7XG4gIHByaXZhdGUgc3ltYm9sczogdHMuU3ltYm9sW107XG4gIHByaXZhdGUgc3ltYm9sVGFibGU6IHRzLlN5bWJvbFRhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKHN5bWJvbHM6IHRzLlN5bWJvbFRhYmxlfHRzLlN5bWJvbFtdfHVuZGVmaW5lZCwgcHJpdmF0ZSBjb250ZXh0OiBUeXBlQ29udGV4dCkge1xuICAgIHN5bWJvbHMgPSBzeW1ib2xzIHx8IFtdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3ltYm9scykpIHtcbiAgICAgIHRoaXMuc3ltYm9scyA9IHN5bWJvbHM7XG4gICAgICBjb25zdCB0b1N5bWJvbFRhYmxlID0gdG9TeW1ib2xUYWJsZUZhY3RvcnkodHMudmVyc2lvbik7XG4gICAgICB0aGlzLnN5bWJvbFRhYmxlID0gdG9TeW1ib2xUYWJsZShzeW1ib2xzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zeW1ib2xzID0gdG9TeW1ib2xzKHN5bWJvbHMpO1xuICAgICAgdGhpcy5zeW1ib2xUYWJsZSA9IHN5bWJvbHM7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNpemUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuc3ltYm9scy5sZW5ndGg7IH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBTeW1ib2x8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBzeW1ib2wgPSBnZXRGcm9tU3ltYm9sVGFibGUodGhpcy5zeW1ib2xUYWJsZSwga2V5KTtcbiAgICByZXR1cm4gc3ltYm9sID8gbmV3IFN5bWJvbFdyYXBwZXIoc3ltYm9sLCB0aGlzLmNvbnRleHQpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgaGFzKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdGFibGU6IGFueSA9IHRoaXMuc3ltYm9sVGFibGU7XG4gICAgcmV0dXJuICh0eXBlb2YgdGFibGUuaGFzID09PSAnZnVuY3Rpb24nKSA/IHRhYmxlLmhhcyhrZXkpIDogdGFibGVba2V5XSAhPSBudWxsO1xuICB9XG5cbiAgdmFsdWVzKCk6IFN5bWJvbFtdIHsgcmV0dXJuIHRoaXMuc3ltYm9scy5tYXAocyA9PiBuZXcgU3ltYm9sV3JhcHBlcihzLCB0aGlzLmNvbnRleHQpKTsgfVxufVxuXG5jbGFzcyBNYXBTeW1ib2xUYWJsZSBpbXBsZW1lbnRzIFN5bWJvbFRhYmxlIHtcbiAgcHJpdmF0ZSBtYXAgPSBuZXcgTWFwPHN0cmluZywgU3ltYm9sPigpO1xuICBwcml2YXRlIF92YWx1ZXM6IFN5bWJvbFtdID0gW107XG5cbiAgZ2V0IHNpemUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMubWFwLnNpemU7IH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBTeW1ib2x8dW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMubWFwLmdldChrZXkpOyB9XG5cbiAgYWRkKHN5bWJvbDogU3ltYm9sKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhcyhzeW1ib2wubmFtZSkpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5tYXAuZ2V0KHN5bWJvbC5uYW1lKSAhO1xuICAgICAgdGhpcy5fdmFsdWVzW3RoaXMuX3ZhbHVlcy5pbmRleE9mKHByZXZpb3VzKV0gPSBzeW1ib2w7XG4gICAgfVxuICAgIHRoaXMubWFwLnNldChzeW1ib2wubmFtZSwgc3ltYm9sKTtcbiAgICB0aGlzLl92YWx1ZXMucHVzaChzeW1ib2wpO1xuICB9XG5cbiAgYWRkQWxsKHN5bWJvbHM6IFN5bWJvbFtdKSB7XG4gICAgZm9yIChjb25zdCBzeW1ib2wgb2Ygc3ltYm9scykge1xuICAgICAgdGhpcy5hZGQoc3ltYm9sKTtcbiAgICB9XG4gIH1cblxuICBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubWFwLmhhcyhrZXkpOyB9XG5cbiAgdmFsdWVzKCk6IFN5bWJvbFtdIHtcbiAgICAvLyBTd2l0Y2ggdG8gdGhpcy5tYXAudmFsdWVzIG9uY2UgaXRlcmFibGVzIGFyZSBzdXBwb3J0ZWQgYnkgdGhlIHRhcmdldCBsYW5ndWFnZS5cbiAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICB9XG59XG5cbmNsYXNzIFBpcGVzVGFibGUgaW1wbGVtZW50cyBTeW1ib2xUYWJsZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGlwZXM6IENvbXBpbGVQaXBlU3VtbWFyeVtdLCBwcml2YXRlIGNvbnRleHQ6IFR5cGVDb250ZXh0KSB7fVxuXG4gIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5waXBlcy5sZW5ndGg7IH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBTeW1ib2x8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBwaXBlID0gdGhpcy5waXBlcy5maW5kKHBpcGUgPT4gcGlwZS5uYW1lID09IGtleSk7XG4gICAgaWYgKHBpcGUpIHtcbiAgICAgIHJldHVybiBuZXcgUGlwZVN5bWJvbChwaXBlLCB0aGlzLmNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5waXBlcy5maW5kKHBpcGUgPT4gcGlwZS5uYW1lID09IGtleSkgIT0gbnVsbDsgfVxuXG4gIHZhbHVlcygpOiBTeW1ib2xbXSB7IHJldHVybiB0aGlzLnBpcGVzLm1hcChwaXBlID0+IG5ldyBQaXBlU3ltYm9sKHBpcGUsIHRoaXMuY29udGV4dCkpOyB9XG59XG5cbi8vIFRoaXMgbWF0Y2hlcyAuZC50cyBmaWxlcyB0aGF0IGxvb2sgbGlrZSBcIi4uLi88cGFja2FnZS1uYW1lPi88cGFja2FnZS1uYW1lPi5kLnRzXCIsXG5jb25zdCBJTkRFWF9QQVRURVJOID0gL1tcXFxcL10oW15cXFxcL10rKVtcXFxcL11cXDFcXC5kXFwudHMkLztcblxuY2xhc3MgUGlwZVN5bWJvbCBpbXBsZW1lbnRzIFN5bWJvbCB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF90c1R5cGUgITogdHMuVHlwZTtcbiAgcHVibGljIHJlYWRvbmx5IGtpbmQ6IERlY2xhcmF0aW9uS2luZCA9ICdwaXBlJztcbiAgcHVibGljIHJlYWRvbmx5IGxhbmd1YWdlOiBzdHJpbmcgPSAndHlwZXNjcmlwdCc7XG4gIHB1YmxpYyByZWFkb25seSBjb250YWluZXI6IFN5bWJvbHx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIHB1YmxpYyByZWFkb25seSBjYWxsYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyByZWFkb25seSBudWxsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgcmVhZG9ubHkgcHVibGljOiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBpcGU6IENvbXBpbGVQaXBlU3VtbWFyeSwgcHJpdmF0ZSBjb250ZXh0OiBUeXBlQ29udGV4dCkge31cblxuICBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5waXBlLm5hbWU7IH1cblxuICBnZXQgdHlwZSgpOiBTeW1ib2x8dW5kZWZpbmVkIHsgcmV0dXJuIG5ldyBUeXBlV3JhcHBlcih0aGlzLnRzVHlwZSwgdGhpcy5jb250ZXh0KTsgfVxuXG4gIGdldCBkZWZpbml0aW9uKCk6IERlZmluaXRpb258dW5kZWZpbmVkIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLnRzVHlwZS5nZXRTeW1ib2woKTtcbiAgICByZXR1cm4gc3ltYm9sID8gZGVmaW5pdGlvbkZyb21Uc1N5bWJvbChzeW1ib2wpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgbWVtYmVycygpOiBTeW1ib2xUYWJsZSB7IHJldHVybiBFbXB0eVRhYmxlLmluc3RhbmNlOyB9XG5cbiAgc2lnbmF0dXJlcygpOiBTaWduYXR1cmVbXSB7IHJldHVybiBzaWduYXR1cmVzT2YodGhpcy50c1R5cGUsIHRoaXMuY29udGV4dCk7IH1cblxuICBzZWxlY3RTaWduYXR1cmUodHlwZXM6IFN5bWJvbFtdKTogU2lnbmF0dXJlfHVuZGVmaW5lZCB7XG4gICAgbGV0IHNpZ25hdHVyZSA9IHNlbGVjdFNpZ25hdHVyZSh0aGlzLnRzVHlwZSwgdGhpcy5jb250ZXh0LCB0eXBlcykgITtcbiAgICBpZiAodHlwZXMubGVuZ3RoID09IDEpIHtcbiAgICAgIGNvbnN0IHBhcmFtZXRlclR5cGUgPSB0eXBlc1swXTtcbiAgICAgIGlmIChwYXJhbWV0ZXJUeXBlIGluc3RhbmNlb2YgVHlwZVdyYXBwZXIpIHtcbiAgICAgICAgbGV0IHJlc3VsdFR5cGU6IHRzLlR5cGV8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICBzd2l0Y2ggKHRoaXMubmFtZSkge1xuICAgICAgICAgIGNhc2UgJ2FzeW5jJzpcbiAgICAgICAgICAgIHN3aXRjaCAocGFyYW1ldGVyVHlwZS5uYW1lKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ09ic2VydmFibGUnOlxuICAgICAgICAgICAgICBjYXNlICdQcm9taXNlJzpcbiAgICAgICAgICAgICAgY2FzZSAnRXZlbnRFbWl0dGVyJzpcbiAgICAgICAgICAgICAgICByZXN1bHRUeXBlID0gZ2V0VHlwZVBhcmFtZXRlck9mKHBhcmFtZXRlclR5cGUudHNUeXBlLCBwYXJhbWV0ZXJUeXBlLm5hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJlc3VsdFR5cGUgPSBnZXRCdWlsdGluVHlwZUZyb21UcyhCdWlsdGluVHlwZS5BbnksIHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzbGljZSc6XG4gICAgICAgICAgICByZXN1bHRUeXBlID0gZ2V0VHlwZVBhcmFtZXRlck9mKHBhcmFtZXRlclR5cGUudHNUeXBlLCAnQXJyYXknKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHRUeXBlKSB7XG4gICAgICAgICAgc2lnbmF0dXJlID0gbmV3IFNpZ25hdHVyZVJlc3VsdE92ZXJyaWRlKFxuICAgICAgICAgICAgICBzaWduYXR1cmUsIG5ldyBUeXBlV3JhcHBlcihyZXN1bHRUeXBlLCBwYXJhbWV0ZXJUeXBlLmNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2lnbmF0dXJlO1xuICB9XG5cbiAgaW5kZXhlZChhcmd1bWVudDogU3ltYm9sKTogU3ltYm9sfHVuZGVmaW5lZCB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICBwcml2YXRlIGdldCB0c1R5cGUoKTogdHMuVHlwZSB7XG4gICAgbGV0IHR5cGUgPSB0aGlzLl90c1R5cGU7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICBjb25zdCBjbGFzc1N5bWJvbCA9IHRoaXMuZmluZENsYXNzU3ltYm9sKHRoaXMucGlwZS50eXBlLnJlZmVyZW5jZSk7XG4gICAgICBpZiAoY2xhc3NTeW1ib2wpIHtcbiAgICAgICAgdHlwZSA9IHRoaXMuX3RzVHlwZSA9IHRoaXMuZmluZFRyYW5zZm9ybU1ldGhvZFR5cGUoY2xhc3NTeW1ib2wpICE7XG4gICAgICB9XG4gICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgdHlwZSA9IHRoaXMuX3RzVHlwZSA9IGdldEJ1aWx0aW5UeXBlRnJvbVRzKEJ1aWx0aW5UeXBlLkFueSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGZpbmRDbGFzc1N5bWJvbCh0eXBlOiBTdGF0aWNTeW1ib2wpOiB0cy5TeW1ib2x8dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gZmluZENsYXNzU3ltYm9sSW5Db250ZXh0KHR5cGUsIHRoaXMuY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIGZpbmRUcmFuc2Zvcm1NZXRob2RUeXBlKGNsYXNzU3ltYm9sOiB0cy5TeW1ib2wpOiB0cy5UeXBlfHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY2xhc3NUeXBlID0gdGhpcy5jb250ZXh0LmNoZWNrZXIuZ2V0RGVjbGFyZWRUeXBlT2ZTeW1ib2woY2xhc3NTeW1ib2wpO1xuICAgIGlmIChjbGFzc1R5cGUpIHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsYXNzVHlwZS5nZXRQcm9wZXJ0eSgndHJhbnNmb3JtJyk7XG4gICAgICBpZiAodHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY2hlY2tlci5nZXRUeXBlT2ZTeW1ib2xBdExvY2F0aW9uKHRyYW5zZm9ybSwgdGhpcy5jb250ZXh0Lm5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kQ2xhc3NTeW1ib2xJbkNvbnRleHQodHlwZTogU3RhdGljU3ltYm9sLCBjb250ZXh0OiBUeXBlQ29udGV4dCk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICBsZXQgc291cmNlRmlsZSA9IGNvbnRleHQucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKHR5cGUuZmlsZVBhdGgpO1xuICBpZiAoIXNvdXJjZUZpbGUpIHtcbiAgICAvLyBUaGlzIGhhbmRsZXMgYSBjYXNlIHdoZXJlIGFuIDxwYWNrYWdlTmFtZT4vaW5kZXguZC50cyBhbmQgYSA8cGFja2FnZU5hbWU+LzxwYWNrYWdlTmFtZT4uZC50c1xuICAgIC8vIGFyZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuIElmIHdlIGFyZSBsb29raW5nIGZvciA8cGFja2FnZU5hbWU+LzxwYWNrYWdlTmFtZT4gYW5kIGRpZG4ndFxuICAgIC8vIGZpbmQgaXQsIGxvb2sgZm9yIDxwYWNrYWdlTmFtZT4vaW5kZXguZC50cyBhcyB0aGUgcHJvZ3JhbSBtaWdodCBoYXZlIGZvdW5kIHRoYXQgaW5zdGVhZC5cbiAgICBjb25zdCBwID0gdHlwZS5maWxlUGF0aCBhcyBzdHJpbmc7XG4gICAgY29uc3QgbSA9IHAubWF0Y2goSU5ERVhfUEFUVEVSTik7XG4gICAgaWYgKG0pIHtcbiAgICAgIGNvbnN0IGluZGV4VmVyc2lvbiA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocCksICdpbmRleC5kLnRzJyk7XG4gICAgICBzb3VyY2VGaWxlID0gY29udGV4dC5wcm9ncmFtLmdldFNvdXJjZUZpbGUoaW5kZXhWZXJzaW9uKTtcbiAgICB9XG4gIH1cbiAgaWYgKHNvdXJjZUZpbGUpIHtcbiAgICBjb25zdCBtb2R1bGVTeW1ib2wgPSAoc291cmNlRmlsZSBhcyBhbnkpLm1vZHVsZSB8fCAoc291cmNlRmlsZSBhcyBhbnkpLnN5bWJvbDtcbiAgICBjb25zdCBleHBvcnRzID0gY29udGV4dC5jaGVja2VyLmdldEV4cG9ydHNPZk1vZHVsZShtb2R1bGVTeW1ib2wpO1xuICAgIHJldHVybiAoZXhwb3J0cyB8fCBbXSkuZmluZChzeW1ib2wgPT4gc3ltYm9sLm5hbWUgPT0gdHlwZS5uYW1lKTtcbiAgfVxufVxuXG5jbGFzcyBFbXB0eVRhYmxlIGltcGxlbWVudHMgU3ltYm9sVGFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgc2l6ZTogbnVtYmVyID0gMDtcbiAgZ2V0KGtleTogc3RyaW5nKTogU3ltYm9sfHVuZGVmaW5lZCB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgaGFzKGtleTogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxuICB2YWx1ZXMoKTogU3ltYm9sW10geyByZXR1cm4gW107IH1cbiAgc3RhdGljIGluc3RhbmNlID0gbmV3IEVtcHR5VGFibGUoKTtcbn1cblxuZnVuY3Rpb24gaXNTeW1ib2xQcml2YXRlKHM6IHRzLlN5bWJvbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gISFzLnZhbHVlRGVjbGFyYXRpb24gJiYgaXNQcml2YXRlKHMudmFsdWVEZWNsYXJhdGlvbik7XG59XG5cbmZ1bmN0aW9uIGdldEJ1aWx0aW5UeXBlRnJvbVRzKGtpbmQ6IEJ1aWx0aW5UeXBlLCBjb250ZXh0OiBUeXBlQ29udGV4dCk6IHRzLlR5cGUge1xuICBsZXQgdHlwZTogdHMuVHlwZTtcbiAgY29uc3QgY2hlY2tlciA9IGNvbnRleHQuY2hlY2tlcjtcbiAgY29uc3Qgbm9kZSA9IGNvbnRleHQubm9kZTtcbiAgc3dpdGNoIChraW5kKSB7XG4gICAgY2FzZSBCdWlsdGluVHlwZS5Bbnk6XG4gICAgICB0eXBlID0gY2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihzZXRQYXJlbnRzKFxuICAgICAgICAgIDx0cy5Ob2RlPjxhbnk+e1xuICAgICAgICAgICAga2luZDogdHMuU3ludGF4S2luZC5Bc0V4cHJlc3Npb24sXG4gICAgICAgICAgICBleHByZXNzaW9uOiA8dHMuTm9kZT57a2luZDogdHMuU3ludGF4S2luZC5UcnVlS2V5d29yZH0sXG4gICAgICAgICAgICB0eXBlOiA8dHMuTm9kZT57a2luZDogdHMuU3ludGF4S2luZC5BbnlLZXl3b3JkfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbm9kZSkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCdWlsdGluVHlwZS5Cb29sZWFuOlxuICAgICAgdHlwZSA9XG4gICAgICAgICAgY2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihzZXRQYXJlbnRzKDx0cy5Ob2RlPntraW5kOiB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkfSwgbm9kZSkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCdWlsdGluVHlwZS5OdWxsOlxuICAgICAgdHlwZSA9XG4gICAgICAgICAgY2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihzZXRQYXJlbnRzKDx0cy5Ob2RlPntraW5kOiB0cy5TeW50YXhLaW5kLk51bGxLZXl3b3JkfSwgbm9kZSkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCdWlsdGluVHlwZS5OdW1iZXI6XG4gICAgICBjb25zdCBudW1lcmljID0gPHRzLkxpdGVyYWxMaWtlTm9kZT57XG4gICAgICAgIGtpbmQ6IHRzLlN5bnRheEtpbmQuTnVtZXJpY0xpdGVyYWwsXG4gICAgICAgIHRleHQ6IG5vZGUuZ2V0VGV4dCgpLFxuICAgICAgfTtcbiAgICAgIHNldFBhcmVudHMoPGFueT57a2luZDogdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50LCBleHByZXNzaW9uOiBudW1lcmljfSwgbm9kZSk7XG4gICAgICB0eXBlID0gY2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihudW1lcmljKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQnVpbHRpblR5cGUuU3RyaW5nOlxuICAgICAgdHlwZSA9IGNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24oc2V0UGFyZW50cyhcbiAgICAgICAgICA8dHMuTGl0ZXJhbExpa2VOb2RlPntcbiAgICAgICAgICAgIGtpbmQ6IHRzLlN5bnRheEtpbmQuTm9TdWJzdGl0dXRpb25UZW1wbGF0ZUxpdGVyYWwsXG4gICAgICAgICAgICB0ZXh0OiBub2RlLmdldFRleHQoKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5vZGUpKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQnVpbHRpblR5cGUuVW5kZWZpbmVkOlxuICAgICAgdHlwZSA9IGNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24oc2V0UGFyZW50cyhcbiAgICAgICAgICA8dHMuTm9kZT48YW55PntcbiAgICAgICAgICAgIGtpbmQ6IHRzLlN5bnRheEtpbmQuVm9pZEV4cHJlc3Npb24sXG4gICAgICAgICAgICBleHByZXNzaW9uOiA8dHMuTm9kZT57a2luZDogdHMuU3ludGF4S2luZC5OdW1lcmljTGl0ZXJhbH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG5vZGUpKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludGVybmFsIGVycm9yLCB1bmhhbmRsZWQgbGl0ZXJhbCBraW5kICR7a2luZH06JHtCdWlsdGluVHlwZVtraW5kXX1gKTtcbiAgfVxuICByZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gc2V0UGFyZW50czxUIGV4dGVuZHMgdHMuTm9kZT4obm9kZTogVCwgcGFyZW50OiB0cy5Ob2RlKTogVCB7XG4gIG5vZGUucGFyZW50ID0gcGFyZW50O1xuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgY2hpbGQgPT4gc2V0UGFyZW50cyhjaGlsZCwgbm9kZSkpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gc3BhbkF0KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBTcGFufHVuZGVmaW5lZCB7XG4gIGlmIChsaW5lICE9IG51bGwgJiYgY29sdW1uICE9IG51bGwpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRzLmdldFBvc2l0aW9uT2ZMaW5lQW5kQ2hhcmFjdGVyKHNvdXJjZUZpbGUsIGxpbmUsIGNvbHVtbik7XG4gICAgY29uc3QgZmluZENoaWxkID0gZnVuY3Rpb24gZmluZENoaWxkKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmIChub2RlLmtpbmQgPiB0cy5TeW50YXhLaW5kLkxhc3RUb2tlbiAmJiBub2RlLnBvcyA8PSBwb3NpdGlvbiAmJiBub2RlLmVuZCA+IHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGJldHRlck5vZGUgPSB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgZmluZENoaWxkKTtcbiAgICAgICAgcmV0dXJuIGJldHRlck5vZGUgfHwgbm9kZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgbm9kZSA9IHRzLmZvckVhY2hDaGlsZChzb3VyY2VGaWxlLCBmaW5kQ2hpbGQpO1xuICAgIGlmIChub2RlKSB7XG4gICAgICByZXR1cm4ge3N0YXJ0OiBub2RlLmdldFN0YXJ0KCksIGVuZDogbm9kZS5nZXRFbmQoKX07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluaXRpb25Gcm9tVHNTeW1ib2woc3ltYm9sOiB0cy5TeW1ib2wpOiBEZWZpbml0aW9uIHtcbiAgY29uc3QgZGVjbGFyYXRpb25zID0gc3ltYm9sLmRlY2xhcmF0aW9ucztcbiAgaWYgKGRlY2xhcmF0aW9ucykge1xuICAgIHJldHVybiBkZWNsYXJhdGlvbnMubWFwKGRlY2xhcmF0aW9uID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBkZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmaWxlTmFtZTogc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICAgICAgc3Bhbjoge3N0YXJ0OiBkZWNsYXJhdGlvbi5nZXRTdGFydCgpLCBlbmQ6IGRlY2xhcmF0aW9uLmdldEVuZCgpfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJlbnREZWNsYXJhdGlvbk9mKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlfHVuZGVmaW5lZCB7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5DbGFzc0RlY2xhcmF0aW9uOlxuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkludGVyZmFjZURlY2xhcmF0aW9uOlxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5Tb3VyY2VGaWxlOlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBub2RlID0gbm9kZS5wYXJlbnQgITtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXJPZihzeW1ib2w6IHRzLlN5bWJvbCwgY29udGV4dDogVHlwZUNvbnRleHQpOiBTeW1ib2x8dW5kZWZpbmVkIHtcbiAgaWYgKHN5bWJvbC5nZXRGbGFncygpICYgdHMuU3ltYm9sRmxhZ3MuQ2xhc3NNZW1iZXIgJiYgc3ltYm9sLmRlY2xhcmF0aW9ucykge1xuICAgIGZvciAoY29uc3QgZGVjbGFyYXRpb24gb2Ygc3ltYm9sLmRlY2xhcmF0aW9ucykge1xuICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50RGVjbGFyYXRpb25PZihkZWNsYXJhdGlvbik7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBjb250ZXh0LmNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24ocGFyZW50KTtcbiAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFR5cGVXcmFwcGVyKHR5cGUsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFR5cGVQYXJhbWV0ZXJPZih0eXBlOiB0cy5UeXBlLCBuYW1lOiBzdHJpbmcpOiB0cy5UeXBlfHVuZGVmaW5lZCB7XG4gIGlmICh0eXBlICYmIHR5cGUuc3ltYm9sICYmIHR5cGUuc3ltYm9sLm5hbWUgPT0gbmFtZSkge1xuICAgIGNvbnN0IHR5cGVBcmd1bWVudHM6IHRzLlR5cGVbXSA9ICh0eXBlIGFzIGFueSkudHlwZUFyZ3VtZW50cztcbiAgICBpZiAodHlwZUFyZ3VtZW50cyAmJiB0eXBlQXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICByZXR1cm4gdHlwZUFyZ3VtZW50c1swXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdHlwZUtpbmRPZih0eXBlOiB0cy5UeXBlIHwgdW5kZWZpbmVkKTogQnVpbHRpblR5cGUge1xuICBpZiAodHlwZSkge1xuICAgIGlmICh0eXBlLmZsYWdzICYgdHMuVHlwZUZsYWdzLkFueSkge1xuICAgICAgcmV0dXJuIEJ1aWx0aW5UeXBlLkFueTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0eXBlLmZsYWdzICYgKHRzLlR5cGVGbGFncy5TdHJpbmcgfCB0cy5UeXBlRmxhZ3MuU3RyaW5nTGlrZSB8IHRzLlR5cGVGbGFncy5TdHJpbmdMaXRlcmFsKSkge1xuICAgICAgcmV0dXJuIEJ1aWx0aW5UeXBlLlN0cmluZztcbiAgICB9IGVsc2UgaWYgKHR5cGUuZmxhZ3MgJiAodHMuVHlwZUZsYWdzLk51bWJlciB8IHRzLlR5cGVGbGFncy5OdW1iZXJMaWtlKSkge1xuICAgICAgcmV0dXJuIEJ1aWx0aW5UeXBlLk51bWJlcjtcbiAgICB9IGVsc2UgaWYgKHR5cGUuZmxhZ3MgJiAodHMuVHlwZUZsYWdzLlVuZGVmaW5lZCkpIHtcbiAgICAgIHJldHVybiBCdWlsdGluVHlwZS5VbmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh0eXBlLmZsYWdzICYgKHRzLlR5cGVGbGFncy5OdWxsKSkge1xuICAgICAgcmV0dXJuIEJ1aWx0aW5UeXBlLk51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlLmZsYWdzICYgdHMuVHlwZUZsYWdzLlVuaW9uKSB7XG4gICAgICAvLyBJZiBhbGwgdGhlIGNvbnN0aXR1ZW50IHR5cGVzIG9mIGEgdW5pb24gYXJlIHRoZSBzYW1lIGtpbmQsIGl0IGlzIGFsc28gdGhhdCBraW5kLlxuICAgICAgbGV0IGNhbmRpZGF0ZTogQnVpbHRpblR5cGV8bnVsbCA9IG51bGw7XG4gICAgICBjb25zdCB1bmlvblR5cGUgPSB0eXBlIGFzIHRzLlVuaW9uVHlwZTtcbiAgICAgIGlmICh1bmlvblR5cGUudHlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjYW5kaWRhdGUgPSB0eXBlS2luZE9mKHVuaW9uVHlwZS50eXBlc1swXSk7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViVHlwZSBvZiB1bmlvblR5cGUudHlwZXMpIHtcbiAgICAgICAgICBpZiAoY2FuZGlkYXRlICE9IHR5cGVLaW5kT2Yoc3ViVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBCdWlsdGluVHlwZS5PdGhlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjYW5kaWRhdGUgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZS5mbGFncyAmIHRzLlR5cGVGbGFncy5UeXBlUGFyYW1ldGVyKSB7XG4gICAgICByZXR1cm4gQnVpbHRpblR5cGUuVW5ib3VuZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIEJ1aWx0aW5UeXBlLk90aGVyO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3ltYm9sVGFibGUoc3ltYm9sVGFibGU6IHRzLlN5bWJvbFRhYmxlLCBrZXk6IHN0cmluZyk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICBjb25zdCB0YWJsZSA9IHN5bWJvbFRhYmxlIGFzIGFueTtcbiAgbGV0IHN5bWJvbDogdHMuU3ltYm9sfHVuZGVmaW5lZDtcblxuICBpZiAodHlwZW9mIHRhYmxlLmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFRTIDIuMiB1c2VzIGEgTWFwXG4gICAgc3ltYm9sID0gdGFibGUuZ2V0KGtleSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVFMgcHJlLTIuMiB1c2VzIGFuIG9iamVjdFxuICAgIHN5bWJvbCA9IHRhYmxlW2tleV07XG4gIH1cblxuICByZXR1cm4gc3ltYm9sO1xufVxuIl19