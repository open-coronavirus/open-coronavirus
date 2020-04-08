## Migration to 2.0

As version 2.0 platform support for Windows Phone 8 was removed.
Some incompatible changes were introduced:

* option `stopOnTerminate` defaults to true
* option `locationService` renamed to `locationProvider`
* android providers are now **ANDROID_DISTANCE_FILTER_PROVIDER** and **ANDROID_ACTIVITY_PROVIDER**
* removed `locationTimeout` option (use `interval` in milliseconds instead)
* `notificationIcon` was replaced with two separate options (`notificationIconSmall` and `notificationIconLarge`)
* js object backgroundGeoLocation is deprecated use `backgroundGeolocation` instead
* iOS foreground mode witch automatic background mode switch
* iOS [switchMode](#switchmodemodeid-success-fail) allows to switch between foreground and background mode
* setPace on iOS is deprecated use switchMode instead


## Migration to 3.0

Version 3.0 is using events instead of callbacks. This means there is no straight forward migration path, that can be described here. Please read docs and checkout provided example app.

- backgroundGeolocation object renamed to BackgroundGeolocation
- start and stop methods doesn't accept callback (use event listeners instead)
- for background syncing syncUrl option is required
- dropped ANDROID prefix from providers
- on Android DISTANCE_FILTER_PROVIDER now accept arbitrary values (before only 10, 100, 1000)
- all plugin constants are in directly BackgroundGeolocation namespace. (check index.js)
- plugin can be started without executing configure (stored settings or defaults will be used)
- location property locationId renamed to just id
- iOS pauseLocationUpdates now default to false (becuase iOS docs now states that you need to restart manually if you set it to true)
- iOS finish method replaced with startTask and endTask