/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getDOM } from '../../dom/dom_adapter';
/**
 * Predicates for use with {\@link DebugElement}'s query functions.
 *
 * \@publicApi
 */
export class By {
    /**
     * Match all nodes.
     *
     * \@usageNotes
     * ### Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_all'}
     * @return {?}
     */
    static all() { return (/**
     * @return {?}
     */
    () => true); }
    /**
     * Match elements by the given CSS selector.
     *
     * \@usageNotes
     * ### Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_css'}
     * @param {?} selector
     * @return {?}
     */
    static css(selector) {
        return (/**
         * @param {?} debugElement
         * @return {?}
         */
        (debugElement) => {
            return debugElement.nativeElement != null ?
                getDOM().elementMatches(debugElement.nativeElement, selector) :
                false;
        });
    }
    /**
     * Match nodes that have the given directive present.
     *
     * \@usageNotes
     * ### Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_directive'}
     * @param {?} type
     * @return {?}
     */
    static directive(type) {
        return (/**
         * @param {?} debugNode
         * @return {?}
         */
        (debugNode) => (/** @type {?} */ (debugNode.providerTokens)).indexOf(type) !== -1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZGVidWcvYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7Ozs7OztBQVM3QyxNQUFNLE9BQU8sRUFBRTs7Ozs7Ozs7OztJQVNiLE1BQU0sQ0FBQyxHQUFHLEtBQTJCOzs7SUFBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7OztJQVV6RCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQWdCO1FBQ3pCOzs7O1FBQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUN0QixPQUFPLFlBQVksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELEtBQUssQ0FBQztRQUNaLENBQUMsRUFBQztJQUNKLENBQUM7Ozs7Ozs7Ozs7O0lBVUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFlO1FBQzlCOzs7O1FBQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7SUFDeEUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RlYnVnRWxlbWVudCwgRGVidWdOb2RlLCBQcmVkaWNhdGUsIFR5cGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnZXRET019IGZyb20gJy4uLy4uL2RvbS9kb21fYWRhcHRlcic7XG5cblxuXG4vKipcbiAqIFByZWRpY2F0ZXMgZm9yIHVzZSB3aXRoIHtAbGluayBEZWJ1Z0VsZW1lbnR9J3MgcXVlcnkgZnVuY3Rpb25zLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEJ5IHtcbiAgLyoqXG4gICAqIE1hdGNoIGFsbCBub2Rlcy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHBsYXRmb3JtLWJyb3dzZXIvZG9tL2RlYnVnL3RzL2J5L2J5LnRzIHJlZ2lvbj0nYnlfYWxsJ31cbiAgICovXG4gIHN0YXRpYyBhbGwoKTogUHJlZGljYXRlPERlYnVnTm9kZT4geyByZXR1cm4gKCkgPT4gdHJ1ZTsgfVxuXG4gIC8qKlxuICAgKiBNYXRjaCBlbGVtZW50cyBieSB0aGUgZ2l2ZW4gQ1NTIHNlbGVjdG9yLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgcGxhdGZvcm0tYnJvd3Nlci9kb20vZGVidWcvdHMvYnkvYnkudHMgcmVnaW9uPSdieV9jc3MnfVxuICAgKi9cbiAgc3RhdGljIGNzcyhzZWxlY3Rvcjogc3RyaW5nKTogUHJlZGljYXRlPERlYnVnRWxlbWVudD4ge1xuICAgIHJldHVybiAoZGVidWdFbGVtZW50KSA9PiB7XG4gICAgICByZXR1cm4gZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQgIT0gbnVsbCA/XG4gICAgICAgICAgZ2V0RE9NKCkuZWxlbWVudE1hdGNoZXMoZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHNlbGVjdG9yKSA6XG4gICAgICAgICAgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaCBub2RlcyB0aGF0IGhhdmUgdGhlIGdpdmVuIGRpcmVjdGl2ZSBwcmVzZW50LlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgcGxhdGZvcm0tYnJvd3Nlci9kb20vZGVidWcvdHMvYnkvYnkudHMgcmVnaW9uPSdieV9kaXJlY3RpdmUnfVxuICAgKi9cbiAgc3RhdGljIGRpcmVjdGl2ZSh0eXBlOiBUeXBlPGFueT4pOiBQcmVkaWNhdGU8RGVidWdOb2RlPiB7XG4gICAgcmV0dXJuIChkZWJ1Z05vZGUpID0+IGRlYnVnTm9kZS5wcm92aWRlclRva2VucyAhLmluZGV4T2YodHlwZSkgIT09IC0xO1xuICB9XG59XG4iXX0=