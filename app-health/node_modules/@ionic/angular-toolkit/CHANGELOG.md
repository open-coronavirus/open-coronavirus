# [2.2.0](https://github.com/ionic-team/angular-toolkit/compare/v2.1.2...v2.2.0) (2020-02-24)


### Features

* **deps:** bump deps to support angular 9 ([5b80c04](https://github.com/ionic-team/angular-toolkit/commit/5b80c04de6c00b06339c183bbd30efeff5f51dc3))

## [2.1.2](https://github.com/ionic-team/angular-toolkit/compare/v2.1.1...v2.1.2) (2020-01-13)


### Bug Fixes

* **cordova:** add cordova.js to index.html even without scripts array ([c8bb37b](https://github.com/ionic-team/angular-toolkit/commit/c8bb37bd1f817f762720b0e3a5c89b4d6a7464e0)), closes [#188](https://github.com/ionic-team/angular-toolkit/issues/188)

## [2.1.1](https://github.com/ionic-team/angular-toolkit/compare/v2.1.0...v2.1.1) (2019-10-22)


### Bug Fixes

* **build:** handle no scripts in angular ([#182](https://github.com/ionic-team/angular-toolkit/issues/182)) ([388e1ad](https://github.com/ionic-team/angular-toolkit/commit/388e1ad3dec5004ceaa8030acf7a248c121be94c)), closes [#179](https://github.com/ionic-team/angular-toolkit/issues/179)

# [2.1.0](https://github.com/ionic-team/angular-toolkit/compare/v2.0.0...v2.1.0) (2019-10-22)


### Bug Fixes

* **routing:** split out routes into routing module ([#181](https://github.com/ionic-team/angular-toolkit/issues/181)) ([b13b823](https://github.com/ionic-team/angular-toolkit/commit/b13b8233c1b693be7a845494b3d98cda2c8fe1da))
* **unit-tests:** allow the components to hydrate ([#173](https://github.com/ionic-team/angular-toolkit/issues/173)) ([4159e59](https://github.com/ionic-team/angular-toolkit/commit/4159e598a43bdedaaaa4d179dd7c3fabc2618d42))


### Features

* **router:** change to dynamic import ([#176](https://github.com/ionic-team/angular-toolkit/issues/176)) ([fbf3627](https://github.com/ionic-team/angular-toolkit/commit/fbf3627f8a182b48bdacd6ca601d2c9411cf3fda))

# [2.0.0](https://github.com/ionic-team/angular-toolkit/compare/v1.5.1...v2.0.0) (2019-06-25)


### Features

* support Angular 8 ([#132](https://github.com/ionic-team/angular-toolkit/issues/132)) ([166d547](https://github.com/ionic-team/angular-toolkit/commit/166d547))


### BREAKING CHANGES

* this updates dependencies for Angular 8. Users are
    required to update to 8.0.0 of Angular/Angular CLI in order to use
    this. In order to migrate, please see https://update.angular.io

## [1.5.1](https://github.com/ionic-team/angular-toolkit/compare/v1.5.0...v1.5.1) (2019-04-09)


### Bug Fixes

* **cordova-build:** only set sourceMap if specified ([#107](https://github.com/ionic-team/angular-toolkit/issues/107)) ([2a99ac0](https://github.com/ionic-team/angular-toolkit/commit/2a99ac0))

# [1.5.0](https://github.com/ionic-team/angular-toolkit/compare/v1.4.1...v1.5.0) (2019-03-21)


### Bug Fixes

* **cordova:** obey `--source-map` for production builds ([23481bd](https://github.com/ionic-team/angular-toolkit/commit/23481bd))


### Features

* **cordova-serve:** support --consolelogs option ([#100](https://github.com/ionic-team/angular-toolkit/issues/100)) ([07af906](https://github.com/ionic-team/angular-toolkit/commit/07af906))

## [1.4.1](https://github.com/ionic-team/angular-toolkit/compare/v1.4.0...v1.4.1) (2019-03-19)


### Bug Fixes

* **page:** remove padding attribute in ion-content template ([#106](https://github.com/ionic-team/angular-toolkit/issues/106)) ([c33f932](https://github.com/ionic-team/angular-toolkit/commit/c33f932))
* **schematics:** update component spec ([#88](https://github.com/ionic-team/angular-toolkit/issues/88)) ([f19e6d8](https://github.com/ionic-team/angular-toolkit/commit/f19e6d8))

# [1.4.0](https://github.com/ionic-team/angular-toolkit/compare/v1.3.0...v1.4.0) (2019-02-13)


### Features

* **component:** add custom component schematic ([#68](https://github.com/ionic-team/angular-toolkit/issues/68)) ([527f54e](https://github.com/ionic-team/angular-toolkit/commit/527f54e))

# [1.3.0](https://github.com/ionic-team/angular-toolkit/compare/v1.2.3...v1.3.0) (2019-01-29)


### Bug Fixes

* **serve:** pass `cordovaBasePath` to cordova-build builder ([#57](https://github.com/ionic-team/angular-toolkit/issues/57)) ([93e3bbe](https://github.com/ionic-team/angular-toolkit/commit/93e3bbe))


### Features

* **build:** add `--cordova-mock` option ([#63](https://github.com/ionic-team/angular-toolkit/issues/63)) ([a659636](https://github.com/ionic-team/angular-toolkit/commit/a659636))

## [1.2.3](https://github.com/ionic-team/angular-toolkit/compare/v1.2.2...v1.2.3) (2019-01-24)


### Bug Fixes

* **application:** add e2e schematics to fulfill `ng g app` ([fc1421e](https://github.com/ionic-team/angular-toolkit/commit/fc1421e))
* **build:** never delete output path ([b614db9](https://github.com/ionic-team/angular-toolkit/commit/b614db9))
* **serve:** use proxyConfig option from serve ([859ce96](https://github.com/ionic-team/angular-toolkit/commit/859ce96))

## [1.2.2](https://github.com/ionic-team/angular-toolkit/compare/v1.2.1...v1.2.2) (2018-12-21)


### Bug Fixes

* **page:** properly handle project selection ([4875aa7](https://github.com/ionic-team/angular-toolkit/commit/4875aa7))

## [1.2.1](https://github.com/ionic-team/angular-toolkit/compare/v1.2.0...v1.2.1) (2018-12-19)


### Bug Fixes

* **build:** respect browserTarget setting ([3a9adfa](https://github.com/ionic-team/angular-toolkit/commit/3a9adfa))
* **page:** dasherize route path ([e32e77b](https://github.com/ionic-team/angular-toolkit/commit/e32e77b))

# [1.2.0](https://github.com/ionic-team/angular-toolkit/compare/v1.1.0...v1.2.0) (2018-11-15)


### Bug Fixes

* **changelog:** correctly link to commits ([#33](https://github.com/ionic-team/angular-toolkit/issues/33)) ([be96104](https://github.com/ionic-team/angular-toolkit/commit/be96104))


### Features

* **serve:** support `--ssl` for dev-server ([9d65915](https://github.com/ionic-team/angular-toolkit/commit/9d65915))

# [1.1.0](https://github.com/ionic-team/angular-toolkit.git/compare/v1.0.0...v1.1.0) (2018-10-31)


### Bug Fixes

* **serve:** validate cordova-build options to provide defaults ([98d6a63](https://github.com/ionic-team/angular-toolkit/commit/98d6a63))


### Features

* support Angular 7 ([3d1172b](https://github.com/ionic-team/angular-toolkit/commit/3d1172b))

# 1.0.0 (2018-10-05)


### Features

* Initial release ([2a5fab5](https://github.com/ionic-team/angular-toolkit/commit/2a5fab5))
