var getPlatforms = function (win) { return setupPlatforms(win); };
var isPlatform = function (winOrPlatform, platform) {
    if (typeof winOrPlatform === 'string') {
        platform = winOrPlatform;
        winOrPlatform = undefined;
    }
    return getPlatforms(winOrPlatform).includes(platform);
};
var setupPlatforms = function (win) {
    if (win === void 0) { win = window; }
    win.Ionic = win.Ionic || {};
    var platforms = win.Ionic.platforms;
    if (platforms == null) {
        platforms = win.Ionic.platforms = detectPlatforms(win);
        platforms.forEach(function (p) { return win.document.documentElement.classList.add("plt-" + p); });
    }
    return platforms;
};
var detectPlatforms = function (win) { return Object.keys(PLATFORMS_MAP).filter(function (p) { return PLATFORMS_MAP[p](win); }); };
var isMobileWeb = function (win) { return isMobile(win) && !isHybrid(win); };
var isIpad = function (win) {
    // iOS 12 and below
    if (testUserAgent(win, /iPad/i)) {
        return true;
    }
    // iOS 13+
    if (testUserAgent(win, /Macintosh/i) && isMobile(win)) {
        return true;
    }
    return false;
};
var isIphone = function (win) { return testUserAgent(win, /iPhone/i); };
var isIOS = function (win) { return testUserAgent(win, /iPhone|iPod/i) || isIpad(win); };
var isAndroid = function (win) { return testUserAgent(win, /android|sink/i); };
var isAndroidTablet = function (win) {
    return isAndroid(win) && !testUserAgent(win, /mobile/i);
};
var isPhablet = function (win) {
    var width = win.innerWidth;
    var height = win.innerHeight;
    var smallest = Math.min(width, height);
    var largest = Math.max(width, height);
    return (smallest > 390 && smallest < 520) &&
        (largest > 620 && largest < 800);
};
var isTablet = function (win) {
    var width = win.innerWidth;
    var height = win.innerHeight;
    var smallest = Math.min(width, height);
    var largest = Math.max(width, height);
    return (isIpad(win) ||
        isAndroidTablet(win) ||
        ((smallest > 460 && smallest < 820) &&
            (largest > 780 && largest < 1400)));
};
var isMobile = function (win) { return matchMedia(win, '(any-pointer:coarse)'); };
var isDesktop = function (win) { return !isMobile(win); };
var isHybrid = function (win) { return isCordova(win) || isCapacitorNative(win); };
var isCordova = function (win) { return !!(win['cordova'] || win['phonegap'] || win['PhoneGap']); };
var isCapacitorNative = function (win) {
    var capacitor = win['Capacitor'];
    return !!(capacitor && capacitor.isNative);
};
var isElectron = function (win) { return testUserAgent(win, /electron/i); };
var isPWA = function (win) { return !!(win.matchMedia('(display-mode: standalone)').matches || win.navigator.standalone); };
var testUserAgent = function (win, expr) { return expr.test(win.navigator.userAgent); };
var matchMedia = function (win, query) { return win.matchMedia(query).matches; };
var PLATFORMS_MAP = {
    'ipad': isIpad,
    'iphone': isIphone,
    'ios': isIOS,
    'android': isAndroid,
    'phablet': isPhablet,
    'tablet': isTablet,
    'cordova': isCordova,
    'capacitor': isCapacitorNative,
    'electron': isElectron,
    'pwa': isPWA,
    'mobile': isMobile,
    'mobileweb': isMobileWeb,
    'desktop': isDesktop,
    'hybrid': isHybrid
};
var Config = /** @class */ (function () {
    function Config() {
        this.m = new Map();
    }
    Config.prototype.reset = function (configObj) {
        this.m = new Map(Object.entries(configObj));
    };
    Config.prototype.get = function (key, fallback) {
        var value = this.m.get(key);
        return (value !== undefined) ? value : fallback;
    };
    Config.prototype.getBoolean = function (key, fallback) {
        if (fallback === void 0) { fallback = false; }
        var val = this.m.get(key);
        if (val === undefined) {
            return fallback;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    };
    Config.prototype.getNumber = function (key, fallback) {
        var val = parseFloat(this.m.get(key));
        return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    };
    Config.prototype.set = function (key, value) {
        this.m.set(key, value);
    };
    return Config;
}());
var config = /*@__PURE__*/ new Config();
var configFromSession = function (win) {
    try {
        var configStr = win.sessionStorage.getItem(IONIC_SESSION_KEY);
        return configStr !== null ? JSON.parse(configStr) : {};
    }
    catch (e) {
        return {};
    }
};
var saveConfig = function (win, c) {
    try {
        win.sessionStorage.setItem(IONIC_SESSION_KEY, JSON.stringify(c));
    }
    catch (e) {
        return;
    }
};
var configFromURL = function (win) {
    var configObj = {};
    win.location.search.slice(1)
        .split('&')
        .map(function (entry) { return entry.split('='); })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return [decodeURIComponent(key), decodeURIComponent(value)];
    })
        .filter(function (_a) {
        var key = _a[0];
        return startsWith(key, IONIC_PREFIX);
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key.slice(IONIC_PREFIX.length), value];
    })
        .forEach(function (_a) {
        var key = _a[0], value = _a[1];
        configObj[key] = value;
    });
    return configObj;
};
var startsWith = function (input, search) {
    return input.substr(0, search.length) === search;
};
var IONIC_PREFIX = 'ionic:';
var IONIC_SESSION_KEY = 'ionic-persist-config';
export { configFromURL as a, config as b, configFromSession as c, saveConfig as d, getPlatforms as g, isPlatform as i, setupPlatforms as s };
