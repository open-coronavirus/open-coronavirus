//
//  CDVBackgroundGeolocation.h
//
//  Created by Marian Hello on 04/06/16.
//  Version 2.0.0
//
//  According to apache license
//
//  This is class is using code from christocracy cordova-plugin-background-geolocation plugin
//  https://github.com/christocracy/cordova-plugin-background-geolocation

#import <UserNotifications/UserNotifications.h>
#import <Cordova/CDVPlugin.h>
#import "MAURProviderDelegate.h"

@interface CDVBackgroundGeolocation : CDVPlugin <MAURProviderDelegate, UNUserNotificationCenterDelegate>

- (void) configure:(CDVInvokedUrlCommand*)command;
- (void) start:(CDVInvokedUrlCommand*)command;
- (void) stop:(CDVInvokedUrlCommand*)command;
- (void) getConfig:(CDVInvokedUrlCommand*)command;
- (void) checkStatus:(CDVInvokedUrlCommand*)command;
- (void) switchMode:(CDVInvokedUrlCommand*)command;
- (void) isLocationEnabled:(CDVInvokedUrlCommand*)command;
- (void) showAppSettings:(CDVInvokedUrlCommand*)command;
- (void) showLocationSettings:(CDVInvokedUrlCommand*)command;
- (void) getStationaryLocation:(CDVInvokedUrlCommand *)command;
- (void) getLocations:(CDVInvokedUrlCommand*)command;
- (void) getValidLocations:(CDVInvokedUrlCommand*)command;
- (void) deleteLocation:(CDVInvokedUrlCommand*)command;
- (void) deleteAllLocations:(CDVInvokedUrlCommand*)command;
- (void) getCurrentLocation:(CDVInvokedUrlCommand*)command;
- (void) getLogEntries:(CDVInvokedUrlCommand*)command;
- (void) startTask:(CDVInvokedUrlCommand*)command;
- (void) endTask:(CDVInvokedUrlCommand*)command;
- (void) forceSync:(CDVInvokedUrlCommand*)command;
- (void) addEventListener:(CDVInvokedUrlCommand*)command;
- (void) removeEventListener:(CDVInvokedUrlCommand*)command;

@end
