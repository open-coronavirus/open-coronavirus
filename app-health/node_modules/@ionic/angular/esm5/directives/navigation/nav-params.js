/**
 * @description
 * NavParams are an object that exists on a page and can contain data for that particular view.
 * Similar to how data was pass to a view in V1 with `$stateParams`, NavParams offer a much more flexible
 * option with a simple `get` method.
 *
 * @usage
 * ```ts
 * import { NavParams } from '@ionic/angular';
 *
 * export class MyClass{
 *
 *  constructor(navParams: NavParams){
 *    // userParams is an object we have in our nav-parameters
 *    navParams.get('userParams');
 *  }
 *
 * }
 * ```
 */
var NavParams = /** @class */ (function () {
    function NavParams(data) {
        if (data === void 0) { data = {}; }
        this.data = data;
    }
    /**
     * Get the value of a nav-parameter for the current view
     *
     * ```ts
     * import { NavParams } from 'ionic-angular';
     *
     * export class MyClass{
     *  constructor(public navParams: NavParams){
     *    // userParams is an object we have in our nav-parameters
     *    this.navParams.get('userParams');
     *  }
     * }
     * ```
     *
     * @param param Which param you want to look up
     */
    NavParams.prototype.get = function (param) {
        return this.data[param];
    };
    return NavParams;
}());
export { NavParams };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LXBhcmFtcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL25hdi1wYXJhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSDtJQUVFLG1CQUFtQixJQUErQjtRQUEvQixxQkFBQSxFQUFBLFNBQStCO1FBQS9CLFNBQUksR0FBSixJQUFJLENBQTJCO0lBQUcsQ0FBQztJQUV0RDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCx1QkFBRyxHQUFILFVBQWEsS0FBYTtRQUN4QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBOYXZQYXJhbXMgYXJlIGFuIG9iamVjdCB0aGF0IGV4aXN0cyBvbiBhIHBhZ2UgYW5kIGNhbiBjb250YWluIGRhdGEgZm9yIHRoYXQgcGFydGljdWxhciB2aWV3LlxuICogU2ltaWxhciB0byBob3cgZGF0YSB3YXMgcGFzcyB0byBhIHZpZXcgaW4gVjEgd2l0aCBgJHN0YXRlUGFyYW1zYCwgTmF2UGFyYW1zIG9mZmVyIGEgbXVjaCBtb3JlIGZsZXhpYmxlXG4gKiBvcHRpb24gd2l0aCBhIHNpbXBsZSBgZ2V0YCBtZXRob2QuXG4gKlxuICogQHVzYWdlXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgTmF2UGFyYW1zIH0gZnJvbSAnQGlvbmljL2FuZ3VsYXInO1xuICpcbiAqIGV4cG9ydCBjbGFzcyBNeUNsYXNze1xuICpcbiAqICBjb25zdHJ1Y3RvcihuYXZQYXJhbXM6IE5hdlBhcmFtcyl7XG4gKiAgICAvLyB1c2VyUGFyYW1zIGlzIGFuIG9iamVjdCB3ZSBoYXZlIGluIG91ciBuYXYtcGFyYW1ldGVyc1xuICogICAgbmF2UGFyYW1zLmdldCgndXNlclBhcmFtcycpO1xuICogIH1cbiAqXG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIE5hdlBhcmFtcyB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRhdGE6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge30pIHt9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBuYXYtcGFyYW1ldGVyIGZvciB0aGUgY3VycmVudCB2aWV3XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGltcG9ydCB7IE5hdlBhcmFtcyB9IGZyb20gJ2lvbmljLWFuZ3VsYXInO1xuICAgKlxuICAgKiBleHBvcnQgY2xhc3MgTXlDbGFzc3tcbiAgICogIGNvbnN0cnVjdG9yKHB1YmxpYyBuYXZQYXJhbXM6IE5hdlBhcmFtcyl7XG4gICAqICAgIC8vIHVzZXJQYXJhbXMgaXMgYW4gb2JqZWN0IHdlIGhhdmUgaW4gb3VyIG5hdi1wYXJhbWV0ZXJzXG4gICAqICAgIHRoaXMubmF2UGFyYW1zLmdldCgndXNlclBhcmFtcycpO1xuICAgKiAgfVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW0gV2hpY2ggcGFyYW0geW91IHdhbnQgdG8gbG9vayB1cFxuICAgKi9cbiAgZ2V0PFQgPSBhbnk+KHBhcmFtOiBzdHJpbmcpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3BhcmFtXTtcbiAgfVxufVxuIl19