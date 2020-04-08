import { Component, Input, NgModule, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var QRCode = require('qrcode');
var NgxQRCodeComponent = /** @class */ (function () {
    function NgxQRCodeComponent(renderer) {
        this.renderer = renderer;
        this.elementType = 'url';
        this.cssClass = 'qrcode';
        this.value = 'https://www.techiediaries.com';
        this.version = '';
        this.errorCorrectionLevel = 'M';
    }
    /**
     * @return {?}
     */
    NgxQRCodeComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        this.createQRCode();
    };
    /**
     * @return {?}
     */
    NgxQRCodeComponent.prototype.toDataURL = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            QRCode.toDataURL(_this.value, { version: _this.version, errorCorrectionLevel: _this.errorCorrectionLevel }, function (err, url) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    //console.log(url);
                    resolve(url);
                }
            });
        });
    };
    /**
     * @param {?} canvas
     * @return {?}
     */
    NgxQRCodeComponent.prototype.toCanvas = /**
     * @param {?} canvas
     * @return {?}
     */
    function (canvas) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            QRCode.toCanvas(canvas, _this.value, { version: _this.version, errorCorrectionLevel: _this.errorCorrectionLevel }, function (error) {
                if (error) {
                    //console.error(error);
                    reject(error);
                }
                else {
                    //console.log('success!');
                    resolve("success");
                }
            });
        });
    };
    /**
     * @param {?} element
     * @return {?}
     */
    NgxQRCodeComponent.prototype.renderElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        for (var _i = 0, _a = this.qrcElement.nativeElement.childNodes; _i < _a.length; _i++) {
            var node = _a[_i];
            this.renderer.removeChild(this.qrcElement.nativeElement, node);
        }
        this.renderer.appendChild(this.qrcElement.nativeElement, element);
    };
    /**
     * @return {?}
     */
    NgxQRCodeComponent.prototype.createQRCode = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.value) {
            return;
        }
        
        var /** @type {?} */ element;
        //console.log("QR Encoding " + this.value);
        switch (this.elementType) {
            case 'canvas':
                element = this.renderer.createElement('canvas');
                this.toCanvas(element).then(function (v) {
                    //console.log(v);
                    //console.log(v);
                    _this.renderElement(element);
                }).catch(function (e) {
                    console.error(e);
                });
                break;
            case 'url':
            case 'img':
            default:
                element = this.renderer.createElement('img');
                this.toDataURL().then(function (v) {
                    //console.log(v);
                    element.setAttribute("src", v);
                    _this.renderElement(element);
                }).catch(function (e) {
                    console.error(e);
                });
        }
    };
    NgxQRCodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-qrcode',
                    template: "<div #qrcElement [class]=\"cssClass\"></div>",
                    styles: []
                },] },
    ];
    /** @nocollapse */
    NgxQRCodeComponent.ctorParameters = function () { return [
        { type: Renderer2, },
    ]; };
    NgxQRCodeComponent.propDecorators = {
        "elementType": [{ type: Input, args: ['qrc-element-type',] },],
        "cssClass": [{ type: Input, args: ['qrc-class',] },],
        "value": [{ type: Input, args: ['qrc-value',] },],
        "version": [{ type: Input, args: ['qrc-version',] },],
        "errorCorrectionLevel": [{ type: Input, args: ['qrc-errorCorrectionLevel',] },],
        "qrcElement": [{ type: ViewChild, args: ['qrcElement',] },],
    };
    return NgxQRCodeComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxQRCodeModule = /** @class */ (function () {
    function NgxQRCodeModule() {
    }
    /**
     * @return {?}
     */
    NgxQRCodeModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: NgxQRCodeModule,
            providers: []
        };
    };
    NgxQRCodeModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        NgxQRCodeComponent,
                    ],
                    exports: [
                        NgxQRCodeComponent,
                    ]
                },] },
    ];
    return NgxQRCodeModule;
}());

export { NgxQRCodeModule, NgxQRCodeComponent };
