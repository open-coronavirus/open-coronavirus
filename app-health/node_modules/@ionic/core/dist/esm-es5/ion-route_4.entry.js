import { __awaiter, __generator, __spreadArrays } from "tslib";
import { r as registerInstance, d as createEvent, e as getElement, c as getIonMode, h, H as Host } from './core-0a8d4d2e.js';
import './config-3c7f3790.js';
import { e as debounce } from './helpers-46f4a262.js';
import { o as openURL, c as createColorClasses } from './theme-18cbe2cc.js';
var Route = /** @class */ (function () {
    function Route(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Relative path that needs to match in order for this route to apply.
         *
         * Accepts paths similar to expressjs so that you can define parameters
         * in the url /foo/:bar where bar would be available in incoming props.
         */
        this.url = '';
        this.ionRouteDataChanged = createEvent(this, "ionRouteDataChanged", 7);
    }
    Route.prototype.onUpdate = function (newValue) {
        this.ionRouteDataChanged.emit(newValue);
    };
    Route.prototype.onComponentProps = function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        var keys1 = newValue ? Object.keys(newValue) : [];
        var keys2 = oldValue ? Object.keys(oldValue) : [];
        if (keys1.length !== keys2.length) {
            this.onUpdate(newValue);
            return;
        }
        for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
            var key = keys1_1[_i];
            if (newValue[key] !== oldValue[key]) {
                this.onUpdate(newValue);
                return;
            }
        }
    };
    Route.prototype.connectedCallback = function () {
        this.ionRouteDataChanged.emit();
    };
    Object.defineProperty(Route, "watchers", {
        get: function () {
            return {
                "url": ["onUpdate"],
                "component": ["onUpdate"],
                "componentProps": ["onComponentProps"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return Route;
}());
var RouteRedirect = /** @class */ (function () {
    function RouteRedirect(hostRef) {
        registerInstance(this, hostRef);
        this.ionRouteRedirectChanged = createEvent(this, "ionRouteRedirectChanged", 7);
    }
    RouteRedirect.prototype.propDidChange = function () {
        this.ionRouteRedirectChanged.emit();
    };
    RouteRedirect.prototype.connectedCallback = function () {
        this.ionRouteRedirectChanged.emit();
    };
    Object.defineProperty(RouteRedirect, "watchers", {
        get: function () {
            return {
                "from": ["propDidChange"],
                "to": ["propDidChange"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return RouteRedirect;
}());
var ROUTER_INTENT_NONE = 'root';
var ROUTER_INTENT_FORWARD = 'forward';
var ROUTER_INTENT_BACK = 'back';
var generatePath = function (segments) {
    var path = segments
        .filter(function (s) { return s.length > 0; })
        .join('/');
    return '/' + path;
};
var chainToPath = function (chain) {
    var path = [];
    for (var _i = 0, chain_1 = chain; _i < chain_1.length; _i++) {
        var route = chain_1[_i];
        for (var _a = 0, _b = route.path; _a < _b.length; _a++) {
            var segment = _b[_a];
            if (segment[0] === ':') {
                var param = route.params && route.params[segment.slice(1)];
                if (!param) {
                    return null;
                }
                path.push(param);
            }
            else if (segment !== '') {
                path.push(segment);
            }
        }
    }
    return path;
};
var writePath = function (history, root, useHash, path, direction, state) {
    var url = generatePath(__spreadArrays(parsePath(root), path));
    if (useHash) {
        url = '#' + url;
    }
    if (direction === ROUTER_INTENT_FORWARD) {
        history.pushState(state, '', url);
    }
    else {
        history.replaceState(state, '', url);
    }
};
var removePrefix = function (prefix, path) {
    if (prefix.length > path.length) {
        return null;
    }
    if (prefix.length <= 1 && prefix[0] === '') {
        return path;
    }
    for (var i = 0; i < prefix.length; i++) {
        if (prefix[i].length > 0 && prefix[i] !== path[i]) {
            return null;
        }
    }
    if (path.length === prefix.length) {
        return [''];
    }
    return path.slice(prefix.length);
};
var readPath = function (loc, root, useHash) {
    var pathname = loc.pathname;
    if (useHash) {
        var hash = loc.hash;
        pathname = (hash[0] === '#')
            ? hash.slice(1)
            : '';
    }
    var prefix = parsePath(root);
    var path = parsePath(pathname);
    return removePrefix(prefix, path);
};
var parsePath = function (path) {
    if (path == null) {
        return [''];
    }
    var segments = path.split('/')
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return s.length > 0; });
    if (segments.length === 0) {
        return [''];
    }
    else {
        return segments;
    }
};
var printRoutes = function (routes) {
    console.group("[ion-core] ROUTES[" + routes.length + "]");
    var _loop_1 = function (chain) {
        var path = [];
        chain.forEach(function (r) { return path.push.apply(path, r.path); });
        var ids = chain.map(function (r) { return r.id; });
        console.debug("%c " + generatePath(path), 'font-weight: bold; padding-left: 20px', '=>\t', "(" + ids.join(', ') + ")");
    };
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var chain = routes_1[_i];
        _loop_1(chain);
    }
    console.groupEnd();
};
var printRedirects = function (redirects) {
    console.group("[ion-core] REDIRECTS[" + redirects.length + "]");
    for (var _i = 0, redirects_1 = redirects; _i < redirects_1.length; _i++) {
        var redirect = redirects_1[_i];
        if (redirect.to) {
            console.debug('FROM: ', "$c " + generatePath(redirect.from), 'font-weight: bold', ' TO: ', "$c " + generatePath(redirect.to), 'font-weight: bold');
        }
    }
    console.groupEnd();
};
var writeNavState = function (root, chain, direction, index, changed) {
    if (changed === void 0) { changed = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var outlet, route, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    outlet = searchNavNode(root);
                    // make sure we can continue interacting the DOM, otherwise abort
                    if (index >= chain.length || !outlet) {
                        return [2 /*return*/, changed];
                    }
                    return [4 /*yield*/, outlet.componentOnReady()];
                case 1:
                    _a.sent();
                    route = chain[index];
                    return [4 /*yield*/, outlet.setRouteId(route.id, route.params, direction)];
                case 2:
                    result = _a.sent();
                    // if the outlet changed the page, reset navigation to neutral (no direction)
                    // this means nested outlets will not animate
                    if (result.changed) {
                        direction = ROUTER_INTENT_NONE;
                        changed = true;
                    }
                    return [4 /*yield*/, writeNavState(result.element, chain, direction, index + 1, changed)];
                case 3:
                    // recursively set nested outlets
                    changed = _a.sent();
                    if (!result.markVisible) return [3 /*break*/, 5];
                    return [4 /*yield*/, result.markVisible()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, changed];
                case 6:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var readNavState = function (root) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, outlet, node, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ids = [];
                node = root;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 5];
                outlet = searchNavNode(node);
                if (!outlet) return [3 /*break*/, 3];
                return [4 /*yield*/, outlet.getRouteId()];
            case 2:
                id = _a.sent();
                if (id) {
                    node = id.element;
                    id.element = undefined;
                    ids.push(id);
                }
                else {
                    return [3 /*break*/, 5];
                }
                return [3 /*break*/, 4];
            case 3: return [3 /*break*/, 5];
            case 4: return [3 /*break*/, 1];
            case 5: return [2 /*return*/, { ids: ids, outlet: outlet }];
        }
    });
}); };
var waitUntilNavNode = function () {
    if (searchNavNode(document.body)) {
        return Promise.resolve();
    }
    return new Promise(function (resolve) {
        window.addEventListener('ionNavWillLoad', resolve, { once: true });
    });
};
var QUERY = ':not([no-router]) ion-nav, :not([no-router]) ion-tabs, :not([no-router]) ion-router-outlet';
var searchNavNode = function (root) {
    if (!root) {
        return undefined;
    }
    if (root.matches(QUERY)) {
        return root;
    }
    var outlet = root.querySelector(QUERY);
    return outlet ? outlet : undefined;
};
var matchesRedirect = function (input, route) {
    var from = route.from, to = route.to;
    if (to === undefined) {
        return false;
    }
    if (from.length > input.length) {
        return false;
    }
    for (var i = 0; i < from.length; i++) {
        var expected = from[i];
        if (expected === '*') {
            return true;
        }
        if (expected !== input[i]) {
            return false;
        }
    }
    return from.length === input.length;
};
var routeRedirect = function (path, routes) {
    return routes.find(function (route) { return matchesRedirect(path, route); });
};
var matchesIDs = function (ids, chain) {
    var len = Math.min(ids.length, chain.length);
    var i = 0;
    for (; i < len; i++) {
        if (ids[i].toLowerCase() !== chain[i].id) {
            break;
        }
    }
    return i;
};
var matchesPath = function (inputPath, chain) {
    var segments = new RouterSegments(inputPath);
    var matchesDefault = false;
    var allparams;
    for (var i = 0; i < chain.length; i++) {
        var path = chain[i].path;
        if (path[0] === '') {
            matchesDefault = true;
        }
        else {
            for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                var segment = path_1[_i];
                var data = segments.next();
                // data param
                if (segment[0] === ':') {
                    if (data === '') {
                        return null;
                    }
                    allparams = allparams || [];
                    var params = allparams[i] || (allparams[i] = {});
                    params[segment.slice(1)] = data;
                }
                else if (data !== segment) {
                    return null;
                }
            }
            matchesDefault = false;
        }
    }
    var matches = (matchesDefault)
        ? matchesDefault === (segments.next() === '')
        : true;
    if (!matches) {
        return null;
    }
    if (allparams) {
        return chain.map(function (route, i) { return ({
            id: route.id,
            path: route.path,
            params: mergeParams(route.params, allparams[i])
        }); });
    }
    return chain;
};
var mergeParams = function (a, b) {
    if (!a && b) {
        return b;
    }
    else if (a && !b) {
        return a;
    }
    else if (a && b) {
        return Object.assign(Object.assign({}, a), b);
    }
    return undefined;
};
var routerIDsToChain = function (ids, chains) {
    var match = null;
    var maxMatches = 0;
    var plainIDs = ids.map(function (i) { return i.id; });
    for (var _i = 0, chains_1 = chains; _i < chains_1.length; _i++) {
        var chain = chains_1[_i];
        var score = matchesIDs(plainIDs, chain);
        if (score > maxMatches) {
            match = chain;
            maxMatches = score;
        }
    }
    if (match) {
        return match.map(function (route, i) { return ({
            id: route.id,
            path: route.path,
            params: mergeParams(route.params, ids[i] && ids[i].params)
        }); });
    }
    return null;
};
var routerPathToChain = function (path, chains) {
    var match = null;
    var matches = 0;
    for (var _i = 0, chains_2 = chains; _i < chains_2.length; _i++) {
        var chain = chains_2[_i];
        var matchedChain = matchesPath(path, chain);
        if (matchedChain !== null) {
            var score = computePriority(matchedChain);
            if (score > matches) {
                matches = score;
                match = matchedChain;
            }
        }
    }
    return match;
};
var computePriority = function (chain) {
    var score = 1;
    var level = 1;
    for (var _i = 0, chain_2 = chain; _i < chain_2.length; _i++) {
        var route = chain_2[_i];
        for (var _a = 0, _b = route.path; _a < _b.length; _a++) {
            var path = _b[_a];
            if (path[0] === ':') {
                score += Math.pow(1, level);
            }
            else if (path !== '') {
                score += Math.pow(2, level);
            }
            level++;
        }
    }
    return score;
};
var RouterSegments = /** @class */ (function () {
    function RouterSegments(path) {
        this.path = path.slice();
    }
    RouterSegments.prototype.next = function () {
        if (this.path.length > 0) {
            return this.path.shift();
        }
        return '';
    };
    return RouterSegments;
}());
var readRedirects = function (root) {
    return Array.from(root.children)
        .filter(function (el) { return el.tagName === 'ION-ROUTE-REDIRECT'; })
        .map(function (el) {
        var to = readProp(el, 'to');
        return {
            from: parsePath(readProp(el, 'from')),
            to: to == null ? undefined : parsePath(to),
        };
    });
};
var readRoutes = function (root) {
    return flattenRouterTree(readRouteNodes(root));
};
var readRouteNodes = function (root, node) {
    if (node === void 0) { node = root; }
    return Array.from(node.children)
        .filter(function (el) { return el.tagName === 'ION-ROUTE' && el.component; })
        .map(function (el) {
        var component = readProp(el, 'component');
        if (component == null) {
            throw new Error('component missing in ion-route');
        }
        return {
            path: parsePath(readProp(el, 'url')),
            id: component.toLowerCase(),
            params: el.componentProps,
            children: readRouteNodes(root, el)
        };
    });
};
var readProp = function (el, prop) {
    if (prop in el) {
        return el[prop];
    }
    if (el.hasAttribute(prop)) {
        return el.getAttribute(prop);
    }
    return null;
};
var flattenRouterTree = function (nodes) {
    var routes = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        flattenNode([], routes, node);
    }
    return routes;
};
var flattenNode = function (chain, routes, node) {
    var s = chain.slice();
    s.push({
        id: node.id,
        path: node.path,
        params: node.params
    });
    if (node.children.length === 0) {
        routes.push(s);
        return;
    }
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var sub = _a[_i];
        flattenNode(s, routes, sub);
    }
};
var Router = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.previousPath = null;
        this.busy = false;
        this.state = 0;
        this.lastState = 0;
        /**
         * By default `ion-router` will match the routes at the root path ("/").
         * That can be changed when
         *
         */
        this.root = '/';
        /**
         * The router can work in two "modes":
         * - With hash: `/index.html#/path/to/page`
         * - Without hash: `/path/to/page`
         *
         * Using one or another might depend in the requirements of your app and/or where it's deployed.
         *
         * Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might
         * requires additional server-side configuration in order to properly work.
         *
         * On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.
         *
         * By default, this property is `true`, change to `false` to allow hash-less URLs.
         */
        this.useHash = true;
        this.ionRouteWillChange = createEvent(this, "ionRouteWillChange", 7);
        this.ionRouteDidChange = createEvent(this, "ionRouteDidChange", 7);
    }
    class_1.prototype.componentWillLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('[ion-router] router will load');
                        return [4 /*yield*/, waitUntilNavNode()];
                    case 1:
                        _a.sent();
                        console.debug('[ion-router] found nav');
                        return [4 /*yield*/, this.onRoutesChanged()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.componentDidLoad = function () {
        window.addEventListener('ionRouteRedirectChanged', debounce(this.onRedirectChanged.bind(this), 10));
        window.addEventListener('ionRouteDataChanged', debounce(this.onRoutesChanged.bind(this), 100));
    };
    class_1.prototype.onPopState = function () {
        var direction = this.historyDirection();
        var path = this.getPath();
        console.debug('[ion-router] URL changed -> update nav', path, direction);
        return this.writeNavStateRoot(path, direction);
    };
    class_1.prototype.onBackButton = function (ev) {
        var _this = this;
        ev.detail.register(0, function () { return _this.back(); });
    };
    /**
     * Navigate to the specified URL.
     *
     * @param url The url to navigate to.
     * @param direction The direction of the animation. Defaults to `"forward"`.
     */
    class_1.prototype.push = function (url, direction) {
        if (direction === void 0) { direction = 'forward'; }
        if (url.startsWith('.')) {
            url = (new URL(url, window.location.href)).pathname;
        }
        console.debug('[ion-router] URL pushed -> updating nav', url, direction);
        var path = parsePath(url);
        this.setPath(path, direction);
        return this.writeNavStateRoot(path, direction);
    };
    /**
     * Go back to previous page in the window.history.
     */
    class_1.prototype.back = function () {
        window.history.back();
        return Promise.resolve(this.waitPromise);
    };
    /** @internal */
    class_1.prototype.printDebug = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.debug('CURRENT PATH', this.getPath());
                console.debug('PREVIOUS PATH', this.previousPath);
                printRoutes(readRoutes(this.el));
                printRedirects(readRedirects(this.el));
                return [2 /*return*/];
            });
        });
    };
    /** @internal */
    class_1.prototype.navChanged = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ids, outlet, routes, chain, path;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.busy) {
                            console.warn('[ion-router] router is busy, navChanged was cancelled');
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, readNavState(window.document.body)];
                    case 1:
                        _a = _b.sent(), ids = _a.ids, outlet = _a.outlet;
                        routes = readRoutes(this.el);
                        chain = routerIDsToChain(ids, routes);
                        if (!chain) {
                            console.warn('[ion-router] no matching URL for ', ids.map(function (i) { return i.id; }));
                            return [2 /*return*/, false];
                        }
                        path = chainToPath(chain);
                        if (!path) {
                            console.warn('[ion-router] router could not match path because some required param is missing');
                            return [2 /*return*/, false];
                        }
                        console.debug('[ion-router] nav changed -> update URL', ids, path);
                        this.setPath(path, direction);
                        return [4 /*yield*/, this.safeWriteNavState(outlet, chain, ROUTER_INTENT_NONE, path, null, ids.length)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    class_1.prototype.onRedirectChanged = function () {
        var path = this.getPath();
        if (path && routeRedirect(path, readRedirects(this.el))) {
            this.writeNavStateRoot(path, ROUTER_INTENT_NONE);
        }
    };
    class_1.prototype.onRoutesChanged = function () {
        return this.writeNavStateRoot(this.getPath(), ROUTER_INTENT_NONE);
    };
    class_1.prototype.historyDirection = function () {
        var win = window;
        if (win.history.state === null) {
            this.state++;
            win.history.replaceState(this.state, win.document.title, win.document.location && win.document.location.href);
        }
        var state = win.history.state;
        var lastState = this.lastState;
        this.lastState = state;
        if (state > lastState) {
            return ROUTER_INTENT_FORWARD;
        }
        else if (state < lastState) {
            return ROUTER_INTENT_BACK;
        }
        else {
            return ROUTER_INTENT_NONE;
        }
    };
    class_1.prototype.writeNavStateRoot = function (path, direction) {
        return __awaiter(this, void 0, void 0, function () {
            var redirects, redirect, redirectFrom, routes, chain;
            return __generator(this, function (_a) {
                if (!path) {
                    console.error('[ion-router] URL is not part of the routing set');
                    return [2 /*return*/, false];
                }
                redirects = readRedirects(this.el);
                redirect = routeRedirect(path, redirects);
                redirectFrom = null;
                if (redirect) {
                    this.setPath(redirect.to, direction);
                    redirectFrom = redirect.from;
                    path = redirect.to;
                }
                routes = readRoutes(this.el);
                chain = routerPathToChain(path, routes);
                if (!chain) {
                    console.error('[ion-router] the path does not match any route');
                    return [2 /*return*/, false];
                }
                // write DOM give
                return [2 /*return*/, this.safeWriteNavState(document.body, chain, direction, path, redirectFrom)];
            });
        });
    };
    class_1.prototype.safeWriteNavState = function (node, chain, direction, path, redirectFrom, index) {
        if (index === void 0) { index = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var unlock, changed, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lock()];
                    case 1:
                        unlock = _a.sent();
                        changed = false;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.writeNavState(node, chain, direction, path, redirectFrom, index)];
                    case 3:
                        changed = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 5];
                    case 5:
                        unlock();
                        return [2 /*return*/, changed];
                }
            });
        });
    };
    class_1.prototype.lock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var p, resolve;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p = this.waitPromise;
                        this.waitPromise = new Promise(function (r) { return resolve = r; });
                        if (!(p !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, p];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, resolve];
                }
            });
        });
    };
    class_1.prototype.writeNavState = function (node, chain, direction, path, redirectFrom, index) {
        if (index === void 0) { index = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var routeEvent, changed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.busy) {
                            console.warn('[ion-router] router is busy, transition was cancelled');
                            return [2 /*return*/, false];
                        }
                        this.busy = true;
                        routeEvent = this.routeChangeEvent(path, redirectFrom);
                        if (routeEvent) {
                            this.ionRouteWillChange.emit(routeEvent);
                        }
                        return [4 /*yield*/, writeNavState(node, chain, direction, index)];
                    case 1:
                        changed = _a.sent();
                        this.busy = false;
                        if (changed) {
                            console.debug('[ion-router] route changed', path);
                        }
                        // emit did change
                        if (routeEvent) {
                            this.ionRouteDidChange.emit(routeEvent);
                        }
                        return [2 /*return*/, changed];
                }
            });
        });
    };
    class_1.prototype.setPath = function (path, direction) {
        this.state++;
        writePath(window.history, this.root, this.useHash, path, direction, this.state);
    };
    class_1.prototype.getPath = function () {
        return readPath(window.location, this.root, this.useHash);
    };
    class_1.prototype.routeChangeEvent = function (path, redirectFromPath) {
        var from = this.previousPath;
        var to = generatePath(path);
        this.previousPath = to;
        if (to === from) {
            return null;
        }
        var redirectedFrom = redirectFromPath ? generatePath(redirectFromPath) : null;
        return {
            from: from,
            redirectedFrom: redirectedFrom,
            to: to,
        };
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var RouterLink = /** @class */ (function () {
    function RouterLink(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        /**
         * When using a router, it specifies the transition direction when navigating to
         * another page using `href`.
         */
        this.routerDirection = 'forward';
        this.onClick = function (ev) {
            openURL(_this.href, ev, _this.routerDirection);
        };
    }
    RouterLink.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        var attrs = {
            href: this.href,
            rel: this.rel,
            target: this.target
        };
        return (h(Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a['ion-activatable'] = true, _a)) }, h("a", Object.assign({}, attrs), h("slot", null))));
    };
    Object.defineProperty(RouterLink, "style", {
        get: function () { return ":host{--background:transparent;--color:var(--ion-color-primary,#3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}"; },
        enumerable: true,
        configurable: true
    });
    return RouterLink;
}());
export { Route as ion_route, RouteRedirect as ion_route_redirect, Router as ion_router, RouterLink as ion_router_link };
