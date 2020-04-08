var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var NativeStorageOriginal = /** @class */ (function (_super) {
    __extends(NativeStorageOriginal, _super);
    function NativeStorageOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeStorageOriginal.prototype.setItem = function (reference, value) { return cordova(this, "setItem", {}, arguments); };
    NativeStorageOriginal.prototype.getItem = function (reference) { return cordova(this, "getItem", {}, arguments); };
    NativeStorageOriginal.prototype.keys = function () { return cordova(this, "keys", {}, arguments); };
    NativeStorageOriginal.prototype.remove = function (reference) { return cordova(this, "remove", {}, arguments); };
    NativeStorageOriginal.prototype.clear = function () { return cordova(this, "clear", {}, arguments); };
    NativeStorageOriginal.pluginName = "NativeStorage";
    NativeStorageOriginal.plugin = "cordova-plugin-nativestorage";
    NativeStorageOriginal.pluginRef = "NativeStorage";
    NativeStorageOriginal.repo = "https://github.com/TheCocoaProject/cordova-plugin-nativestorage";
    NativeStorageOriginal.platforms = ["Android", "Browser", "iOS", "macOS", "Windows"];
    return NativeStorageOriginal;
}(IonicNativePlugin));
var NativeStorage = new NativeStorageOriginal();
export { NativeStorage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL25hdGl2ZS1zdG9yYWdlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxPQUFPLDhCQUFzQyxNQUFNLG9CQUFvQixDQUFDOztJQW9DckMsaUNBQWlCOzs7O0lBUWxELCtCQUFPLGFBQUMsU0FBaUIsRUFBRSxLQUFVO0lBVXJDLCtCQUFPLGFBQUMsU0FBaUI7SUFTekIsNEJBQUk7SUFVSiw4QkFBTSxhQUFDLFNBQWlCO0lBU3hCLDZCQUFLOzs7Ozs7d0JBbkZQO0VBcUNtQyxpQkFBaUI7U0FBdkMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvcmRvdmEsIElvbmljTmF0aXZlUGx1Z2luLCBQbHVnaW4gfSBmcm9tICdAaW9uaWMtbmF0aXZlL2NvcmUnO1xuXG5cbi8qKlxuICogQG5hbWUgTmF0aXZlIFN0b3JhZ2VcbiAqIEBkZXNjcmlwdGlvbiBOYXRpdmUgc3RvcmFnZSBvZiB2YXJpYWJsZXMgaW4gQW5kcm9pZCBhbmQgaU9TXG4gKlxuICogQHVzYWdlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBOYXRpdmVTdG9yYWdlIH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9uYXRpdmUtc3RvcmFnZS9uZ3gnO1xuICpcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgbmF0aXZlU3RvcmFnZTogTmF0aXZlU3RvcmFnZSkgeyB9XG4gKlxuICogLi4uXG4gKlxuICogdGhpcy5uYXRpdmVTdG9yYWdlLnNldEl0ZW0oJ215aXRlbScsIHtwcm9wZXJ0eTogJ3ZhbHVlJywgYW5vdGhlclByb3BlcnR5OiAnYW5vdGhlclZhbHVlJ30pXG4gKiAgIC50aGVuKFxuICogICAgICgpID0+IGNvbnNvbGUubG9nKCdTdG9yZWQgaXRlbSEnKSxcbiAqICAgICBlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBzdG9yaW5nIGl0ZW0nLCBlcnJvcilcbiAqICAgKTtcbiAqXG4gKiB0aGlzLm5hdGl2ZVN0b3JhZ2UuZ2V0SXRlbSgnbXlpdGVtJylcbiAqICAgLnRoZW4oXG4gKiAgICAgZGF0YSA9PiBjb25zb2xlLmxvZyhkYXRhKSxcbiAqICAgICBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKVxuICogICApO1xuICogYGBgXG4gKi9cbkBQbHVnaW4oe1xuICBwbHVnaW5OYW1lOiAnTmF0aXZlU3RvcmFnZScsXG4gIHBsdWdpbjogJ2NvcmRvdmEtcGx1Z2luLW5hdGl2ZXN0b3JhZ2UnLFxuICBwbHVnaW5SZWY6ICdOYXRpdmVTdG9yYWdlJyxcbiAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9UaGVDb2NvYVByb2plY3QvY29yZG92YS1wbHVnaW4tbmF0aXZlc3RvcmFnZScsXG4gIHBsYXRmb3JtczogWydBbmRyb2lkJywgJ0Jyb3dzZXInLCAnaU9TJywgJ21hY09TJywgJ1dpbmRvd3MnXVxufSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOYXRpdmVTdG9yYWdlIGV4dGVuZHMgSW9uaWNOYXRpdmVQbHVnaW4ge1xuICAvKipcbiAgICogU3RvcmVzIGEgdmFsdWVcbiAgICogQHBhcmFtIHJlZmVyZW5jZSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKClcbiAgc2V0SXRlbShyZWZlcmVuY2U6IHN0cmluZywgdmFsdWU6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzdG9yZWQgaXRlbVxuICAgKiBAcGFyYW0gcmVmZXJlbmNlIHtzdHJpbmd9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBAQ29yZG92YSgpXG4gIGdldEl0ZW0ocmVmZXJlbmNlOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2aW5nIGFsbCBrZXlzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBAQ29yZG92YSgpXG4gIGtleXMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHNpbmdsZSBzdG9yZWQgaXRlbVxuICAgKiBAcGFyYW0gcmVmZXJlbmNlIHtzdHJpbmd9XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBAQ29yZG92YSgpXG4gIHJlbW92ZShyZWZlcmVuY2U6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIHN0b3JlZCB2YWx1ZXMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBAQ29yZG92YSgpXG4gIGNsZWFyKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbn1cbiJdfQ==