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
export class NavParams {
    constructor(data = {}) {
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
    get(param) {
        return this.data[param];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LXBhcmFtcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL25hdi1wYXJhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQUVwQixZQUFtQixPQUE2QixFQUFFO1FBQS9CLFNBQUksR0FBSixJQUFJLENBQTJCO0lBQUcsQ0FBQztJQUV0RDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxHQUFHLENBQVUsS0FBYTtRQUN4QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE5hdlBhcmFtcyBhcmUgYW4gb2JqZWN0IHRoYXQgZXhpc3RzIG9uIGEgcGFnZSBhbmQgY2FuIGNvbnRhaW4gZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIHZpZXcuXG4gKiBTaW1pbGFyIHRvIGhvdyBkYXRhIHdhcyBwYXNzIHRvIGEgdmlldyBpbiBWMSB3aXRoIGAkc3RhdGVQYXJhbXNgLCBOYXZQYXJhbXMgb2ZmZXIgYSBtdWNoIG1vcmUgZmxleGlibGVcbiAqIG9wdGlvbiB3aXRoIGEgc2ltcGxlIGBnZXRgIG1ldGhvZC5cbiAqXG4gKiBAdXNhZ2VcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBOYXZQYXJhbXMgfSBmcm9tICdAaW9uaWMvYW5ndWxhcic7XG4gKlxuICogZXhwb3J0IGNsYXNzIE15Q2xhc3N7XG4gKlxuICogIGNvbnN0cnVjdG9yKG5hdlBhcmFtczogTmF2UGFyYW1zKXtcbiAqICAgIC8vIHVzZXJQYXJhbXMgaXMgYW4gb2JqZWN0IHdlIGhhdmUgaW4gb3VyIG5hdi1wYXJhbWV0ZXJzXG4gKiAgICBuYXZQYXJhbXMuZ2V0KCd1c2VyUGFyYW1zJyk7XG4gKiAgfVxuICpcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgTmF2UGFyYW1zIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YToge1trZXk6IHN0cmluZ106IGFueX0gPSB7fSkge31cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIG5hdi1wYXJhbWV0ZXIgZm9yIHRoZSBjdXJyZW50IHZpZXdcbiAgICpcbiAgICogYGBgdHNcbiAgICogaW1wb3J0IHsgTmF2UGFyYW1zIH0gZnJvbSAnaW9uaWMtYW5ndWxhcic7XG4gICAqXG4gICAqIGV4cG9ydCBjbGFzcyBNeUNsYXNze1xuICAgKiAgY29uc3RydWN0b3IocHVibGljIG5hdlBhcmFtczogTmF2UGFyYW1zKXtcbiAgICogICAgLy8gdXNlclBhcmFtcyBpcyBhbiBvYmplY3Qgd2UgaGF2ZSBpbiBvdXIgbmF2LXBhcmFtZXRlcnNcbiAgICogICAgdGhpcy5uYXZQYXJhbXMuZ2V0KCd1c2VyUGFyYW1zJyk7XG4gICAqICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbSBXaGljaCBwYXJhbSB5b3Ugd2FudCB0byBsb29rIHVwXG4gICAqL1xuICBnZXQ8VCA9IGFueT4ocGFyYW06IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLmRhdGFbcGFyYW1dO1xuICB9XG59XG4iXX0=