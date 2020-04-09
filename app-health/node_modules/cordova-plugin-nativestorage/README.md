# Cordova plugin NativeStorage

[![npm version](https://badge.fury.io/js/cordova-plugin-nativestorage.svg)](https://badge.fury.io/js/cordova-plugin-nativestorage) [![Build Status](https://travis-ci.org/TheCocoaProject/cordova-plugin-nativestorage.svg?branch=master)](https://travis-ci.org/TheCocoaProject/cordova-plugin-nativestorage)  [![Known Vulnerabilities](https://snyk.io/test/npm/cordova-plugin-nativestorage/badge.svg)](https://snyk.io/test/npm/cordova-plugin-nativestorage)


[![NPM](https://nodei.co/npm/cordova-plugin-nativestorage.png?downloads=true&downloadRank=true)](https://nodei.co/npm/cordova-plugin-nativestorage/)

Join the chat for questions and updates [![Join the chat at https://gitter.im/TheCocoaProject/cordova-plugin-nativestorage](https://badges.gitter.im/TheCocoaProject/cordova-plugin-nativestorage.svg)](https://gitter.im/TheCocoaProject/cordova-plugin-nativestorage?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

*** 

Cite this plugin:
```latex
@misc{callebautNS,
author =   {Gilles Callebaut and Alok Rajiv},
title =    {{NativeStorage - A Cordova Plugin}},
howpublished = {\url{https://github.com/TheCocoaProject/cordova-plugin-nativestorage}},
}
```

You can also provide a `version` field to include a version number e.g., `version = {2.3.1}`.

***

#### :) As per [npm-stat](https://npm-stat.com/charts.html?package=cordova-plugin-nativestorage&from=2016-04-01) we just crossed 150k downloads!! Thanks to everyone who helped and to everyone who have send in their kind words!

NEW: Windows and OS X is supported!
UPDATE: The Plugin can now also be found at the [Telerik Plugin Market](http://plugins.telerik.com/cordova/plugin/nativestorage).

Documentation about the API prior to v2 can be found at the [wiki](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/wiki/Usage-API-(prior-to-v2.0.0))
***

The plugin was created and developed by [Gilles Callebaut](https://be.linkedin.com/in/gilles-callebaut-46a751104), in the scope of an [IWT/VlAIO](http://www.vlaio.be/english) Tetra project [CrossMoS](https://www.msec.be/crossmos/) which assesses Mobile Cross-Platform Tools. This wouldn't be possible without the contributions of [Alok Rajiv](https://github.com/alokrajiv), our Cordova and JavaScript guru.

Please consider reading our [wiki](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/wiki) for more documentation about this plugin.

## Contents
- [Why the need for this plugin?](#why)
	* [When to use the plugin](#when)
- [Scientific articles](#articles)
- [Installation](#installation)
- [Supported Platforms](#supported_platforms)
- [Supported Frameworks](#supported_frameworks)
- [Usage](#usage)
	* [Supported data types](#supported_data_types)
	* [Storing values](#storing_values)
	* [Retrieving values](#retrieving_values)
	* [Retrieving all keys](#retrieving_keys)
	* [Removing values](#removing_values)
	* [Demo Example](#demo_example)
- [Security](#security)
- [Errors](#errors)
- [Problems](#problems)
- [F.A.Q](#FAQ)
- [Applications using this plugin](#applications)


## <a name="why"></a>Why?
This plugin is created because of the non-persistent property of LocalStorage in the WebView of Android and iOS.
In iOS stored data from LocalStorage can be removed by the OS, when running out of memory.

Some complaints:
- http://gonehybrid.com/dont-assume-localstorage-will-always-work-in-your-hybrid-app/
- http://stackoverflow.com/questions/7750857/how-permanent-is-local-storage-on-android-and-ios
- http://stackoverflow.com/questions/25627991/ios-7-webview-and-localstorage-persistence-update
- http://stackoverflow.com/questions/28082624/localstorage-persistence-in-ios-android-webview
- https://forum.ionicframework.com/t/localstorage-is-it-cleared-after-app-restarts-periodically-in-ios/21819
- https://bugs.chromium.org/p/chromium/issues/detail?id=481380
- From Cordova itself: http://cordova.apache.org/docs/en/latest/cordova/storage/storage.html

### <a name="when"></a>When to use the plugin
- **Simple**: Uniform and convenient way of organizing, storing, and accessing the data
- **Fast**: Less than 1 milisecond to save or retrieve an object (in general)
- **Persistence**: Save data over multiple sessions, i.e. holds the data till the application is removed from the device
- **Small data**: Store small amounts of persistent data (less than a few hundred kilobytes)
	* It is possible to store more than a few megabytes, but that's not the intended usage of the plugin.
	* See issue [#31](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/issues/31) for a more 'in-depth' explanation of size limit.

#### Examples
Storage of:
- User preferences
- Game progress
- Text
- ...

### When not to use the plugin
- Storing and retrieving files can be done by means of the [file plugin](https://github.com/apache/cordova-plugin-file)
- For storing many objects please consider trying a database-based strategy, for instance: WebSQL and [SQLite plugin](https://github.com/litehelpers/Cordova-sqlite-storage).


## <a name="articles"></a>Scientific Articles
[Assessment of Data Storage Strategies Using the Mobile Cross-Platform Tool Cordova](https://thinkmind.org/download.php?articleid=mobility_2017_2_10_90007)

## <a name="installation"></a>Installation
The plugin can be installed via the Cordova command line interface:
* Navigate to the root folder for your Cordova/Phonegap/Ionic project.
* Run the command:
```sh
cordova plugin add cordova-plugin-nativestorage
```
or through this git repo if you want to be running the development version:
```sh
cordova plugin add https://github.com/TheCocoaProject/cordova-plugin-nativestorage
```

If you're using ngCordova you can use the ngCordova-wrapper:
```sh
bower install git://github.com/TheCocoaProject/ngcordova-wrapper-nativestorage --save-dev
```
For more information about the usage of the plugin check the repo for the [ngCordova-wrapper](https://github.com/TheCocoaProject/ngcordova-wrapper-nativestorage) - Ionic V1. The plugin is also supported for Ionic, please check the [official Ionic documentation](http://ionicframework.com/docs/v2/native/native-storage/) for the installation procedure and use.



### <a name="reinstalling_dev"></a>Reinstalling/installing developer version
Remove the plugin from the current project:
```sh
cordova plugin remove cordova-plugin-nativestorage
```
Install the developer version from Github:
```sh
cordova plugin add https://github.com/TheCocoaProject/cordova-plugin-nativestorage
```

## <a name="supported_platforms"></a>Supported platforms
- Android
- iOS
- Browser (for testing purposes)
- Windows (thanks to Christian Helbig see [PR](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/pull/38))
- OS X (thanks to [Javier Ribó](https://github.com/elribonazo) see [PR](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/pull/58))

## <a name="supported_frameworks"></a>Supported frameworks
- [vanilla Cordova](https://www.npmjs.com/package/cordova-plugin-nativestorage)
- [Cordova 3.9.2](https://github.com/GillesC/cordova-plugin-nativestorage-3.9.2-compatible) and previous versions
- [Ionic](http://ionicframework.com/docs/v2/native/nativestorage/)
- [ngCordova](https://github.com/TheCocoaProject/ngcordova-wrapper-nativestorage) (not all functions are yet supported)

## <a name="usage"></a>Usage
The parameter of the success-callback function will be the saved or retrieved value, the error-callback will specify the occurred error.

### <a name="supported_data_types"></a>Supported data types
As of version v2.0 all data types that can be stringified can be stored with the `setItem` and `getItem` method, see [storing values](#storing_values). A more fine grained storage method is also provided. These methods can be used to store type-specific data types, see [API prior to v2](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/wiki/Usage-API-(prior-to-v2.0.0)).

### <a name="storing_values"></a>Storing values
```javascript
NativeStorage.setItem("reference_to_value",<value>, <success-callback>, <error-callback>);
```
### <a name="retrieving_values"></a>Retrieving values
```javascript
NativeStorage.getItem("reference_to_value",<success-callback>, <error-callback>);
```

### <a name="retrieving_keys"></a>Retrieving all keys
```javascript
NativeStorage.keys(<success-callback>, <error-callback>);
```

### <a name="removing_values"></a>Removing values

Removing a single variable:
```javascript
NativeStorage.remove("reference_to_value",<success-callback>, <error-callback>);
```

Removing all stored variables:
```javascript
NativeStorage.clear(<success-callback>, <error-callback>);
```

### iOS specific features
- App Groups (share data between apps)
First the suite name must be provided before accessing and retrieving data.
```javascript
NativeStorage.initWithSuiteName("suitename");
```
### <a name="example"></a>Example
```javascript
var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        var obj = {name: "NativeStorage", author: "GillesCallebaut"};

        // be certain to make an unique reference String for each variable!
        NativeStorage.setItem("reference", obj, this.setSuccess, this.setError);
    },
    setSuccess: function (obj) {
        console.log(obj.name);
        NativeStorage.getItem("reference", this.getSuccess, this.getError);
    },
    setError: function (error) {
        console.log(error.code);
        if (error.exception !== "") console.log(error.exception);
    },
    getSuccess: function (obj) {
        console.log(obj.name);
        NativeStorage.remove("reference", this.removeSuccess, this.removeError);
    },
    getError: function (error) {
        console.log(error.code);
        if (error.exception !== "") console.log(error.exception);
    },
    removeSuccess: function () {
        console.log("Removed");
    },
    removeError: function (error) {
        console.log(error.code);
        if (error.exception !== "") console.log(error.exception);
    }
};

app.initialize();
```

### <a name="ngcordova_example"></a>ngCordova (Ionic V1) example
```javascript
var app = angular.module('starter.controllers', ['ngCordova.plugins.nativeStorage'])

app.controller('myCtrl', function ($ionicPlatform, $scope, $cordovaNativeStorage, $log) {
    $ionicPlatform.ready(function () {
        $scope.$apply(function () {
            $cordovaNativeStorage.setItem("ref", "value").then(function (value) {
                $log.log(value);
                $cordovaNativeStorage.getItem("ref").then(function (value) {
                    $log.log(value);
                }, function (error) {
                    $log.log(error);
                });
            }, function (error) {
                $log.log(error);
            });
        });
    });
});
```

### <a name="demo_example"></a>Demo Example
A demo application can be found at `cordova-plugin-nativestorage/examples/demo`. This application will save a String when the SAVE (`btn_load`) is pushed. This String is the value which has been typed in the input field (`data_input`). When the LOAD button is pressed, the value is shown by means of an alert message.

#### Installation
* Cloning the repo to a local dir
```sh
git clone https://github.com/GillesC/cordova-plugin-nativestorage.git
```
* Navigating to the demo dir
```sh
cd cordova-plugin-nativestorage/examples/demo/
```
* Adding target platforms
```sh
cordova platform add ios
cordova platform add android
cordova platform add browser
cordova platform add windows
```
* Adding the plugin
```sh
cordova plugin add cordova-plugin-nativestorage
```
* For testing the plugin
```sh
cordova plugin add http://git-wip-us.apache.org/repos/asf/cordova-plugin-test-framework.git
cordova plugin add https://github.com/TheCocoaProject/cordova-plugin-nativestorage.git#:/tests
```
* Run or emulate the demo application
```sh
cordova emulate ios
cordova run android
cordova run browser
cordova run windows
```

## <a name="security"></a>Security
Is it safe to store sensitive data via this plugin?
 - Yes and No, all stored values are only accessible by your application, which makes it safe. However, the values can be viewed when the attacker has access to your phone's password (e.g. lock-pattern) through an un-encrypted back-up on Android (if back-up is enabled) or through root-access. The latter is only possible if the phone is rooted. An extra encryption mechanism would be of value when an extra user-supplied password is used. This mode is on our [Future Track](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/wiki/Future-track) list.

## <a name="errors"></a>Errors
Error object contains:
- code
- source (= "Native"/"JS")
- exception (if any, e.g. JSON exception)

### Error codes
the code contains an integer whichs specifies the occurred error/problem
- `NATIVE_WRITE_FAILED` = 1
- `ITEM_NOT_FOUND` = 2
- `NULL_REFERENCE` = 3
- `UNDEFINED_TYPE` = 4
- `JSON_ERROR` = 5
- `WRONG_PARAMETER` = 6

## <a name="problems"></a>Problems
If you encounter any problems, please remove the current plugin and re-add it.
This will install the latest version.

If you have code issues, things not related to a bug of the plugin please consider posting your question on Stackoverflow. And add our own tag, [cordova-nativestorage](http://stackoverflow.com/tags/cordova-nativestorage).

- Be certain to only retrieve a saved value when the put/set success-callback method was invoked.
- When using Ionic V1 the plugin can be undefined, the solution was descibed in issue [#10](../../issues/10):
	* Remove `ng-app` from `body`
	* put this code at the end of `index.html`:
	* ```<script type="text/javascript"> document.addEventListener('deviceready', function onDeviceReady() { angular.bootstrap(document.querySelector('body'), ['starter']); }, false); </script>```
- `Unknown provider: $cordovaNativeStorageProvider`
	* Are you certain you've included the [wrapper](https://github.com/TheCocoaProject/ngcordova-wrapper-nativestorage)?
- `Failed to instantiate module ngCordova.plugins.nativeStorage`
- `Module 'ngCordova.plugins.nativeStorage' is not available`
	* Check your bower json file (`bower.json`) to see if everything is correct
	* be certain that the wrappers js file is included as described in the [README of the wrapper](https://github.com/TheCocoaProject/ngcordova-wrapper-nativestorage/blob/master/README.md)
- Plugin doesn't seem to work in iOS 10
	* Solution is presented on Stackoverflow in [this thread](http://stackoverflow.com/questions/38410159/cordova-app-hanging-during-startup-on-ios-10-beta). The issue was also discussed in issue [#36](../../issues/36).

## <a name="FAQ"></a>F.A.Q.
- Is data persistent between app updates?
	* Yes. The data should persistent till the app has been deleted from the device. This because the plugin uses `Sharedpreferences` in Android and `NSUserDefaults` in iOS.
- Oh no my stored data is not cleared after reinstalling my application. How do I resolve this 'issue'?
	* You need to set `android:allowBackup=false` in the application tag of AndroidManifest.xml. More information at [this issue](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/issues/57) and [this StackOverflow question](http://stackoverflow.com/questions/42538421/ionic-nativestorage-not-clear-when-reinstal-application-release).
- What database are you using and why?
	* None. The plugin uses `Sharedpreferences` in Android and `NSUserDefaults` in iOS. These strategies are designed for storing data quick and easy. See the [usage of the plugin](#when) for more info about DB vs NativeStorage.
- Is it possible to save images and audio with the plugin?
	* Yes. If you could stringify the data. Should I save imaged and audio is a different question. If the provided data isn't large and there isn't need to store a large amount of it, it will be OK.  See the [usage of the plugin](#when) for more info about storing large data with the plugin.
- Is there a forum where people interested in the plugin could discuss issues like this?
	* Yes
		- See our own [issues page](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/issues)
		- Check out our [chat](https://gitter.im/TheCocoaProject/cordova-plugin-nativestorage?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) on Gitter
- Can I access the saved value in Android?
	* Yes, check out [this thread](http://stackoverflow.com/questions/39159754/how-get-data-from-cordova-plugin-nativestorage-in-android-java/39269620#39269620) on StackOverflow. Or see [this issue](https://github.com/TheCocoaProject/cordova-plugin-nativestorage/issues/53) on Github.
- Can I access saved values in JavaScript?
	* Yes, see [this thread](http://stackoverflow.com/questions/25657749/cordova-plugin-expose-js-variable-android-cardflight/39331899#39331899) on StackOverflow.
- Does this plugin supports Cordova 3.9.2?
	* Yes, look at [this fork](cordova-plugin-nativestorage-3.9.2-compatible)


## <a name="applications"></a>Applications using this plugin

- [Battles of East March](https://itunes.apple.com/us/app/id1135312617) (it was made using the Phaser game engine and compiled using CocoonJS)

If you're utilizing this plugin and wish to add your application to this readme, please contact [me](mailto:callebaut.gilles@gmail.com).
