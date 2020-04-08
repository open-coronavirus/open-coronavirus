/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getDOM } from '../../dom/dom_adapter';
/**
 * Predicates for use with {@link DebugElement}'s query functions.
 *
 * @publicApi
 */
var By = /** @class */ (function () {
    function By() {
    }
    /**
     * Match all nodes.
     *
     * @usageNotes
     * ### Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_all'}
     */
    By.all = function () { return function () { return true; }; };
    /**
     * Match elements by the given CSS selector.
     *
     * @usageNotes
     * ### Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_css'}
     */
    By.css = function (selector) {
        return function (debugElement) {
            return debugElement.nativeElement != null ?
                getDOM().elementMatches(debugElement.nativeElement, selector) :
                false;
        };
    };
    /**
     * Match nodes that have the given directive present.
     *
     * @usageNotes
     * ### Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_directive'}
     */
    By.directive = function (type) {
        return function (debugNode) { return debugNode.providerTokens.indexOf(type) !== -1; };
    };
    return By;
}());
export { By };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZGVidWcvYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSTdDOzs7O0dBSUc7QUFDSDtJQUFBO0lBc0NBLENBQUM7SUFyQ0M7Ozs7Ozs7T0FPRztJQUNJLE1BQUcsR0FBVixjQUFxQyxPQUFPLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUMsQ0FBQztJQUV6RDs7Ozs7OztPQU9HO0lBQ0ksTUFBRyxHQUFWLFVBQVcsUUFBZ0I7UUFDekIsT0FBTyxVQUFDLFlBQVk7WUFDbEIsT0FBTyxZQUFZLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxLQUFLLENBQUM7UUFDWixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFlBQVMsR0FBaEIsVUFBaUIsSUFBZTtRQUM5QixPQUFPLFVBQUMsU0FBUyxJQUFLLE9BQUEsU0FBUyxDQUFDLGNBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUEvQyxDQUErQyxDQUFDO0lBQ3hFLENBQUM7SUFDSCxTQUFDO0FBQUQsQ0FBQyxBQXRDRCxJQXNDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEZWJ1Z0VsZW1lbnQsIERlYnVnTm9kZSwgUHJlZGljYXRlLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Z2V0RE9NfSBmcm9tICcuLi8uLi9kb20vZG9tX2FkYXB0ZXInO1xuXG5cblxuLyoqXG4gKiBQcmVkaWNhdGVzIGZvciB1c2Ugd2l0aCB7QGxpbmsgRGVidWdFbGVtZW50fSdzIHF1ZXJ5IGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBCeSB7XG4gIC8qKlxuICAgKiBNYXRjaCBhbGwgbm9kZXMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIHtAZXhhbXBsZSBwbGF0Zm9ybS1icm93c2VyL2RvbS9kZWJ1Zy90cy9ieS9ieS50cyByZWdpb249J2J5X2FsbCd9XG4gICAqL1xuICBzdGF0aWMgYWxsKCk6IFByZWRpY2F0ZTxEZWJ1Z05vZGU+IHsgcmV0dXJuICgpID0+IHRydWU7IH1cblxuICAvKipcbiAgICogTWF0Y2ggZWxlbWVudHMgYnkgdGhlIGdpdmVuIENTUyBzZWxlY3Rvci5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHBsYXRmb3JtLWJyb3dzZXIvZG9tL2RlYnVnL3RzL2J5L2J5LnRzIHJlZ2lvbj0nYnlfY3NzJ31cbiAgICovXG4gIHN0YXRpYyBjc3Moc2VsZWN0b3I6IHN0cmluZyk6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gKGRlYnVnRWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuIGRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50ICE9IG51bGwgP1xuICAgICAgICAgIGdldERPTSgpLmVsZW1lbnRNYXRjaGVzKGRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50LCBzZWxlY3RvcikgOlxuICAgICAgICAgIGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2ggbm9kZXMgdGhhdCBoYXZlIHRoZSBnaXZlbiBkaXJlY3RpdmUgcHJlc2VudC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHBsYXRmb3JtLWJyb3dzZXIvZG9tL2RlYnVnL3RzL2J5L2J5LnRzIHJlZ2lvbj0nYnlfZGlyZWN0aXZlJ31cbiAgICovXG4gIHN0YXRpYyBkaXJlY3RpdmUodHlwZTogVHlwZTxhbnk+KTogUHJlZGljYXRlPERlYnVnTm9kZT4ge1xuICAgIHJldHVybiAoZGVidWdOb2RlKSA9PiBkZWJ1Z05vZGUucHJvdmlkZXJUb2tlbnMgIS5pbmRleE9mKHR5cGUpICE9PSAtMTtcbiAgfVxufVxuIl19