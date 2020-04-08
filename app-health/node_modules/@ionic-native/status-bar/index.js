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
import { IonicNativePlugin, cordova, cordovaPropertyGet, cordovaPropertySet } from '@ionic-native/core';
var StatusBarOriginal = /** @class */ (function (_super) {
    __extends(StatusBarOriginal, _super);
    function StatusBarOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBarOriginal.prototype.overlaysWebView = function (doesOverlay) { return cordova(this, "overlaysWebView", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleDefault = function () { return cordova(this, "styleDefault", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleLightContent = function () { return cordova(this, "styleLightContent", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleBlackTranslucent = function () { return cordova(this, "styleBlackTranslucent", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleBlackOpaque = function () { return cordova(this, "styleBlackOpaque", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.backgroundColorByName = function (colorName) { return cordova(this, "backgroundColorByName", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.backgroundColorByHexString = function (hexString) { return cordova(this, "backgroundColorByHexString", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.hide = function () { return cordova(this, "hide", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.show = function () { return cordova(this, "show", { "sync": true }, arguments); };
    Object.defineProperty(StatusBarOriginal.prototype, "isVisible", {
        get: function () { return cordovaPropertyGet(this, "isVisible"); },
        set: function (value) { cordovaPropertySet(this, "isVisible", value); },
        enumerable: true,
        configurable: true
    });
    StatusBarOriginal.pluginName = "StatusBar";
    StatusBarOriginal.plugin = "cordova-plugin-statusbar";
    StatusBarOriginal.pluginRef = "StatusBar";
    StatusBarOriginal.repo = "https://github.com/apache/cordova-plugin-statusbar";
    StatusBarOriginal.platforms = ["Android", "iOS", "Windows"];
    return StatusBarOriginal;
}(IonicNativePlugin));
var StatusBar = new StatusBarOriginal();
export { StatusBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL3N0YXR1cy1iYXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLE9BQU8sc0VBS04sTUFBTSxvQkFBb0IsQ0FBQzs7SUFpQ0csNkJBQWlCOzs7O0lBZ0I5QyxtQ0FBZSxhQUFDLFdBQW9CO0lBUXBDLGdDQUFZO0lBUVoscUNBQWlCO0lBUWpCLHlDQUFxQjtJQVFyQixvQ0FBZ0I7SUFhaEIseUNBQXFCLGFBQUMsU0FBaUI7SUFZdkMsOENBQTBCLGFBQUMsU0FBaUI7SUFRNUMsd0JBQUk7SUFRSix3QkFBSTswQkFwRkosZ0NBQVM7Ozs7Ozs7Ozs7O29CQTVDWDtFQXVDK0IsaUJBQWlCO1NBQW5DLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb3Jkb3ZhLFxuICBDb3Jkb3ZhUHJvcGVydHksXG4gIElvbmljTmF0aXZlUGx1Z2luLFxuICBQbHVnaW5cbn0gZnJvbSAnQGlvbmljLW5hdGl2ZS9jb3JlJztcblxuLyoqXG4gKiBAbmFtZSBTdGF0dXMgQmFyXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1hbmFnZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgbmF0aXZlIHN0YXR1cyBiYXIuXG4gKlxuICogUmVxdWlyZXMgQ29yZG92YSBwbHVnaW46IGBjb3Jkb3ZhLXBsdWdpbi1zdGF0dXNiYXJgLiBGb3IgbW9yZSBpbmZvLCBwbGVhc2Ugc2VlIHRoZSBbU3RhdHVzQmFyIHBsdWdpbiBkb2NzXShodHRwczovL2dpdGh1Yi5jb20vYXBhY2hlL2NvcmRvdmEtcGx1Z2luLXN0YXR1c2JhcikuXG4gKlxuICogQHVzYWdlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBTdGF0dXNCYXIgfSBmcm9tICdAaW9uaWMtbmF0aXZlL3N0YXR1cy1iYXIvbmd4JztcbiAqXG4gKiBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0YXR1c0JhcjogU3RhdHVzQmFyKSB7IH1cbiAqXG4gKiAuLi5cbiAqXG4gKiAvLyBsZXQgc3RhdHVzIGJhciBvdmVybGF5IHdlYnZpZXdcbiAqIHRoaXMuc3RhdHVzQmFyLm92ZXJsYXlzV2ViVmlldyh0cnVlKTtcbiAqXG4gKiAvLyBzZXQgc3RhdHVzIGJhciB0byB3aGl0ZVxuICogdGhpcy5zdGF0dXNCYXIuYmFja2dyb3VuZENvbG9yQnlIZXhTdHJpbmcoJyNmZmZmZmYnKTtcbiAqIGBgYFxuICpcbiAqL1xuQFBsdWdpbih7XG4gIHBsdWdpbk5hbWU6ICdTdGF0dXNCYXInLFxuICBwbHVnaW46ICdjb3Jkb3ZhLXBsdWdpbi1zdGF0dXNiYXInLFxuICBwbHVnaW5SZWY6ICdTdGF0dXNCYXInLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2FwYWNoZS9jb3Jkb3ZhLXBsdWdpbi1zdGF0dXNiYXInLFxuICBwbGF0Zm9ybXM6IFsnQW5kcm9pZCcsICdpT1MnLCAnV2luZG93cyddXG59KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXR1c0JhciBleHRlbmRzIElvbmljTmF0aXZlUGx1Z2luIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFN0YXR1c0JhciBpcyBjdXJyZW50bHkgdmlzaWJsZSBvciBub3QuXG4gICAqL1xuICBAQ29yZG92YVByb3BlcnR5KClcbiAgaXNWaXNpYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB0aGUgc3RhdHVzIGJhciBvdmVybGF5cyB0aGUgbWFpbiBhcHAgdmlldy4gVGhlIGRlZmF1bHRcbiAgICogaXMgdHJ1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBkb2VzT3ZlcmxheSAgV2hldGhlciB0aGUgc3RhdHVzIGJhciBvdmVybGF5cyB0aGUgbWFpbiBhcHAgdmlldy5cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIG92ZXJsYXlzV2ViVmlldyhkb2VzT3ZlcmxheTogYm9vbGVhbikge31cblxuICAvKipcbiAgICogVXNlIHRoZSBkZWZhdWx0IHN0YXR1c2JhciAoZGFyayB0ZXh0LCBmb3IgbGlnaHQgYmFja2dyb3VuZHMpLlxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIHN5bmM6IHRydWVcbiAgfSlcbiAgc3R5bGVEZWZhdWx0KCkge31cblxuICAvKipcbiAgICogVXNlIHRoZSBsaWdodENvbnRlbnQgc3RhdHVzYmFyIChsaWdodCB0ZXh0LCBmb3IgZGFyayBiYWNrZ3JvdW5kcykuXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBzdHlsZUxpZ2h0Q29udGVudCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYmxhY2tUcmFuc2x1Y2VudCBzdGF0dXNiYXIgKGxpZ2h0IHRleHQsIGZvciBkYXJrIGJhY2tncm91bmRzKS5cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIHN0eWxlQmxhY2tUcmFuc2x1Y2VudCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYmxhY2tPcGFxdWUgc3RhdHVzYmFyIChsaWdodCB0ZXh0LCBmb3IgZGFyayBiYWNrZ3JvdW5kcykuXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBzdHlsZUJsYWNrT3BhcXVlKCkge31cblxuICAvKipcbiAgICogU2V0IHRoZSBzdGF0dXMgYmFyIHRvIGEgc3BlY2lmaWMgbmFtZWQgY29sb3IuIFZhbGlkIG9wdGlvbnM6XG4gICAqIGJsYWNrLCBkYXJrR3JheSwgbGlnaHRHcmF5LCB3aGl0ZSwgZ3JheSwgcmVkLCBncmVlbiwgYmx1ZSwgY3lhbiwgeWVsbG93LCBtYWdlbnRhLCBvcmFuZ2UsIHB1cnBsZSwgYnJvd24uXG4gICAqXG4gICAqIGlPUyBub3RlOiB5b3UgbXVzdCBjYWxsIFN0YXR1c0Jhci5vdmVybGF5c1dlYlZpZXcoZmFsc2UpIHRvIGVuYWJsZSBjb2xvciBjaGFuZ2luZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yTmFtZSAgVGhlIG5hbWUgb2YgdGhlIGNvbG9yIChmcm9tIGFib3ZlKVxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIHN5bmM6IHRydWVcbiAgfSlcbiAgYmFja2dyb3VuZENvbG9yQnlOYW1lKGNvbG9yTmFtZTogc3RyaW5nKSB7fVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHN0YXR1cyBiYXIgdG8gYSBzcGVjaWZpYyBoZXggY29sb3IgKENTUyBzaG9ydGhhbmQgc3VwcG9ydGVkISkuXG4gICAqXG4gICAqIGlPUyBub3RlOiB5b3UgbXVzdCBjYWxsIFN0YXR1c0Jhci5vdmVybGF5c1dlYlZpZXcoZmFsc2UpIHRvIGVuYWJsZSBjb2xvciBjaGFuZ2luZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0cmluZyAgVGhlIGhleCB2YWx1ZSBvZiB0aGUgY29sb3IuXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBiYWNrZ3JvdW5kQ29sb3JCeUhleFN0cmluZyhoZXhTdHJpbmc6IHN0cmluZykge31cblxuICAvKipcbiAgICogSGlkZSB0aGUgU3RhdHVzQmFyXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBoaWRlKCkge31cblxuICAvKipcbiAgICogU2hvdyB0aGUgU3RhdHVzQmFyXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBzaG93KCkge31cbn1cbiJdfQ==