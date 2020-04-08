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
        define("@angular/compiler-cli/src/ngtsc/diagnostics/src/code", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorCode;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["DECORATOR_ARG_NOT_LITERAL"] = 1001] = "DECORATOR_ARG_NOT_LITERAL";
        ErrorCode[ErrorCode["DECORATOR_ARITY_WRONG"] = 1002] = "DECORATOR_ARITY_WRONG";
        ErrorCode[ErrorCode["DECORATOR_NOT_CALLED"] = 1003] = "DECORATOR_NOT_CALLED";
        ErrorCode[ErrorCode["DECORATOR_ON_ANONYMOUS_CLASS"] = 1004] = "DECORATOR_ON_ANONYMOUS_CLASS";
        ErrorCode[ErrorCode["DECORATOR_UNEXPECTED"] = 1005] = "DECORATOR_UNEXPECTED";
        /**
         * This error code indicates that there are incompatible decorators on a type or a class field.
         */
        ErrorCode[ErrorCode["DECORATOR_COLLISION"] = 1006] = "DECORATOR_COLLISION";
        ErrorCode[ErrorCode["VALUE_HAS_WRONG_TYPE"] = 1010] = "VALUE_HAS_WRONG_TYPE";
        ErrorCode[ErrorCode["VALUE_NOT_LITERAL"] = 1011] = "VALUE_NOT_LITERAL";
        ErrorCode[ErrorCode["COMPONENT_MISSING_TEMPLATE"] = 2001] = "COMPONENT_MISSING_TEMPLATE";
        ErrorCode[ErrorCode["PIPE_MISSING_NAME"] = 2002] = "PIPE_MISSING_NAME";
        ErrorCode[ErrorCode["PARAM_MISSING_TOKEN"] = 2003] = "PARAM_MISSING_TOKEN";
        ErrorCode[ErrorCode["SYMBOL_NOT_EXPORTED"] = 3001] = "SYMBOL_NOT_EXPORTED";
        ErrorCode[ErrorCode["SYMBOL_EXPORTED_UNDER_DIFFERENT_NAME"] = 3002] = "SYMBOL_EXPORTED_UNDER_DIFFERENT_NAME";
        ErrorCode[ErrorCode["CONFIG_FLAT_MODULE_NO_INDEX"] = 4001] = "CONFIG_FLAT_MODULE_NO_INDEX";
        /**
         * Raised when a host expression has a parse error, such as a host listener or host binding
         * expression containing a pipe.
         */
        ErrorCode[ErrorCode["HOST_BINDING_PARSE_ERROR"] = 5001] = "HOST_BINDING_PARSE_ERROR";
        /**
         * Raised when an NgModule contains an invalid reference in `declarations`.
         */
        ErrorCode[ErrorCode["NGMODULE_INVALID_DECLARATION"] = 6001] = "NGMODULE_INVALID_DECLARATION";
        /**
         * Raised when an NgModule contains an invalid type in `imports`.
         */
        ErrorCode[ErrorCode["NGMODULE_INVALID_IMPORT"] = 6002] = "NGMODULE_INVALID_IMPORT";
        /**
         * Raised when an NgModule contains an invalid type in `exports`.
         */
        ErrorCode[ErrorCode["NGMODULE_INVALID_EXPORT"] = 6003] = "NGMODULE_INVALID_EXPORT";
        /**
         * Raised when an NgModule contains a type in `exports` which is neither in `declarations` nor
         * otherwise imported.
         */
        ErrorCode[ErrorCode["NGMODULE_INVALID_REEXPORT"] = 6004] = "NGMODULE_INVALID_REEXPORT";
        /**
         * Raised when ngcc tries to inject a synthetic decorator over one that already exists.
         */
        ErrorCode[ErrorCode["NGCC_MIGRATION_DECORATOR_INJECTION_ERROR"] = 7001] = "NGCC_MIGRATION_DECORATOR_INJECTION_ERROR";
        /**
         * Raised when ngcc tries to decorate a base class that was imported from outside the package.
         */
        ErrorCode[ErrorCode["NGCC_MIGRATION_EXTERNAL_BASE_CLASS"] = 7002] = "NGCC_MIGRATION_EXTERNAL_BASE_CLASS";
        /**
         * Raised when ngcc tries to migrate a class that is extended from a dynamic base class
         * expression.
         */
        ErrorCode[ErrorCode["NGCC_MIGRATION_DYNAMIC_BASE_CLASS"] = 7003] = "NGCC_MIGRATION_DYNAMIC_BASE_CLASS";
    })(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
    function ngErrorCode(code) {
        return parseInt('-99' + code);
    }
    exports.ngErrorCode = ngErrorCode;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZGlhZ25vc3RpY3Mvc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCxJQUFZLFNBa0VYO0lBbEVELFdBQVksU0FBUztRQUNuQixzRkFBZ0MsQ0FBQTtRQUNoQyw4RUFBNEIsQ0FBQTtRQUM1Qiw0RUFBMkIsQ0FBQTtRQUMzQiw0RkFBbUMsQ0FBQTtRQUNuQyw0RUFBMkIsQ0FBQTtRQUUzQjs7V0FFRztRQUNILDBFQUEwQixDQUFBO1FBRTFCLDRFQUEyQixDQUFBO1FBQzNCLHNFQUF3QixDQUFBO1FBRXhCLHdGQUFpQyxDQUFBO1FBQ2pDLHNFQUF3QixDQUFBO1FBQ3hCLDBFQUEwQixDQUFBO1FBRTFCLDBFQUEwQixDQUFBO1FBQzFCLDRHQUEyQyxDQUFBO1FBRTNDLDBGQUFrQyxDQUFBO1FBRWxDOzs7V0FHRztRQUNILG9GQUErQixDQUFBO1FBRS9COztXQUVHO1FBQ0gsNEZBQW1DLENBQUE7UUFFbkM7O1dBRUc7UUFDSCxrRkFBOEIsQ0FBQTtRQUU5Qjs7V0FFRztRQUNILGtGQUE4QixDQUFBO1FBRTlCOzs7V0FHRztRQUNILHNGQUFnQyxDQUFBO1FBRWhDOztXQUVHO1FBQ0gsb0hBQStDLENBQUE7UUFFL0M7O1dBRUc7UUFDSCx3R0FBeUMsQ0FBQTtRQUV6Qzs7O1dBR0c7UUFDSCxzR0FBd0MsQ0FBQTtJQUMxQyxDQUFDLEVBbEVXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBa0VwQjtJQUVELFNBQWdCLFdBQVcsQ0FBQyxJQUFlO1FBQ3pDLE9BQU8sUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRkQsa0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCBlbnVtIEVycm9yQ29kZSB7XG4gIERFQ09SQVRPUl9BUkdfTk9UX0xJVEVSQUwgPSAxMDAxLFxuICBERUNPUkFUT1JfQVJJVFlfV1JPTkcgPSAxMDAyLFxuICBERUNPUkFUT1JfTk9UX0NBTExFRCA9IDEwMDMsXG4gIERFQ09SQVRPUl9PTl9BTk9OWU1PVVNfQ0xBU1MgPSAxMDA0LFxuICBERUNPUkFUT1JfVU5FWFBFQ1RFRCA9IDEwMDUsXG5cbiAgLyoqXG4gICAqIFRoaXMgZXJyb3IgY29kZSBpbmRpY2F0ZXMgdGhhdCB0aGVyZSBhcmUgaW5jb21wYXRpYmxlIGRlY29yYXRvcnMgb24gYSB0eXBlIG9yIGEgY2xhc3MgZmllbGQuXG4gICAqL1xuICBERUNPUkFUT1JfQ09MTElTSU9OID0gMTAwNixcblxuICBWQUxVRV9IQVNfV1JPTkdfVFlQRSA9IDEwMTAsXG4gIFZBTFVFX05PVF9MSVRFUkFMID0gMTAxMSxcblxuICBDT01QT05FTlRfTUlTU0lOR19URU1QTEFURSA9IDIwMDEsXG4gIFBJUEVfTUlTU0lOR19OQU1FID0gMjAwMixcbiAgUEFSQU1fTUlTU0lOR19UT0tFTiA9IDIwMDMsXG5cbiAgU1lNQk9MX05PVF9FWFBPUlRFRCA9IDMwMDEsXG4gIFNZTUJPTF9FWFBPUlRFRF9VTkRFUl9ESUZGRVJFTlRfTkFNRSA9IDMwMDIsXG5cbiAgQ09ORklHX0ZMQVRfTU9EVUxFX05PX0lOREVYID0gNDAwMSxcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gYSBob3N0IGV4cHJlc3Npb24gaGFzIGEgcGFyc2UgZXJyb3IsIHN1Y2ggYXMgYSBob3N0IGxpc3RlbmVyIG9yIGhvc3QgYmluZGluZ1xuICAgKiBleHByZXNzaW9uIGNvbnRhaW5pbmcgYSBwaXBlLlxuICAgKi9cbiAgSE9TVF9CSU5ESU5HX1BBUlNFX0VSUk9SID0gNTAwMSxcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gYW4gTmdNb2R1bGUgY29udGFpbnMgYW4gaW52YWxpZCByZWZlcmVuY2UgaW4gYGRlY2xhcmF0aW9uc2AuXG4gICAqL1xuICBOR01PRFVMRV9JTlZBTElEX0RFQ0xBUkFUSU9OID0gNjAwMSxcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gYW4gTmdNb2R1bGUgY29udGFpbnMgYW4gaW52YWxpZCB0eXBlIGluIGBpbXBvcnRzYC5cbiAgICovXG4gIE5HTU9EVUxFX0lOVkFMSURfSU1QT1JUID0gNjAwMixcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gYW4gTmdNb2R1bGUgY29udGFpbnMgYW4gaW52YWxpZCB0eXBlIGluIGBleHBvcnRzYC5cbiAgICovXG4gIE5HTU9EVUxFX0lOVkFMSURfRVhQT1JUID0gNjAwMyxcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gYW4gTmdNb2R1bGUgY29udGFpbnMgYSB0eXBlIGluIGBleHBvcnRzYCB3aGljaCBpcyBuZWl0aGVyIGluIGBkZWNsYXJhdGlvbnNgIG5vclxuICAgKiBvdGhlcndpc2UgaW1wb3J0ZWQuXG4gICAqL1xuICBOR01PRFVMRV9JTlZBTElEX1JFRVhQT1JUID0gNjAwNCxcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gbmdjYyB0cmllcyB0byBpbmplY3QgYSBzeW50aGV0aWMgZGVjb3JhdG9yIG92ZXIgb25lIHRoYXQgYWxyZWFkeSBleGlzdHMuXG4gICAqL1xuICBOR0NDX01JR1JBVElPTl9ERUNPUkFUT1JfSU5KRUNUSU9OX0VSUk9SID0gNzAwMSxcblxuICAvKipcbiAgICogUmFpc2VkIHdoZW4gbmdjYyB0cmllcyB0byBkZWNvcmF0ZSBhIGJhc2UgY2xhc3MgdGhhdCB3YXMgaW1wb3J0ZWQgZnJvbSBvdXRzaWRlIHRoZSBwYWNrYWdlLlxuICAgKi9cbiAgTkdDQ19NSUdSQVRJT05fRVhURVJOQUxfQkFTRV9DTEFTUyA9IDcwMDIsXG5cbiAgLyoqXG4gICAqIFJhaXNlZCB3aGVuIG5nY2MgdHJpZXMgdG8gbWlncmF0ZSBhIGNsYXNzIHRoYXQgaXMgZXh0ZW5kZWQgZnJvbSBhIGR5bmFtaWMgYmFzZSBjbGFzc1xuICAgKiBleHByZXNzaW9uLlxuICAgKi9cbiAgTkdDQ19NSUdSQVRJT05fRFlOQU1JQ19CQVNFX0NMQVNTID0gNzAwMyxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nRXJyb3JDb2RlKGNvZGU6IEVycm9yQ29kZSk6IG51bWJlciB7XG4gIHJldHVybiBwYXJzZUludCgnLTk5JyArIGNvZGUpO1xufSJdfQ==