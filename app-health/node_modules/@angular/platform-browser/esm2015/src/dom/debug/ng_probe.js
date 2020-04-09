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
import { APP_INITIALIZER, ApplicationRef, NgProbeToken, NgZone, Optional, getDebugNode } from '@angular/core';
import { exportNgVar } from '../util';
const ɵ0 = /**
 * @return {?}
 */
() => ({
    'ApplicationRef': ApplicationRef,
    'NgZone': NgZone,
});
/** @type {?} */
const CORE_TOKENS = ((ɵ0))();
/** @type {?} */
const INSPECT_GLOBAL_NAME = 'probe';
/** @type {?} */
const CORE_TOKENS_GLOBAL_NAME = 'coreTokens';
/**
 * Returns a {\@link DebugElement} for the given native DOM element, or
 * null if the given native element does not have an Angular view associated
 * with it.
 * @param {?} element
 * @return {?}
 */
export function inspectNativeElement(element) {
    return getDebugNode(element);
}
/**
 * @param {?} coreTokens
 * @return {?}
 */
export function _createNgProbe(coreTokens) {
    exportNgVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
    exportNgVar(CORE_TOKENS_GLOBAL_NAME, Object.assign({}, CORE_TOKENS, _ngProbeTokensToMap(coreTokens || [])));
    return (/**
     * @return {?}
     */
    () => inspectNativeElement);
}
/**
 * @param {?} tokens
 * @return {?}
 */
function _ngProbeTokensToMap(tokens) {
    return tokens.reduce((/**
     * @param {?} prev
     * @param {?} t
     * @return {?}
     */
    (prev, t) => (prev[t.name] = t.token, prev)), {});
}
/**
 * In Ivy, we don't support NgProbe because we have our own set of testing utilities
 * with more robust functionality.
 *
 * We shouldn't bring in NgProbe because it prevents DebugNode and friends from
 * tree-shaking properly.
 * @type {?}
 */
export const ELEMENT_PROBE_PROVIDERS__POST_R3__ = [];
/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 * @type {?}
 */
export const ELEMENT_PROBE_PROVIDERS__PRE_R3__ = [
    {
        provide: APP_INITIALIZER,
        useFactory: _createNgProbe,
        deps: [
            [NgProbeToken, new Optional()],
        ],
        multi: true,
    },
];
/** @type {?} */
export const ELEMENT_PROBE_PROVIDERS = ELEMENT_PROBE_PROVIDERS__PRE_R3__;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfcHJvYmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZGVidWcvbmdfcHJvYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBYSxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBWSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFakksT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7OztBQUVmLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDTCxnQkFBZ0IsRUFBRSxjQUFjO0lBQ2hDLFFBQVEsRUFBRSxNQUFNO0NBQ2pCLENBQUM7O01BSGpCLFdBQVcsR0FBRyxNQUdJLEVBQUU7O01BRXBCLG1CQUFtQixHQUFHLE9BQU87O01BQzdCLHVCQUF1QixHQUFHLFlBQVk7Ozs7Ozs7O0FBTzVDLE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxPQUFZO0lBQy9DLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxVQUEwQjtJQUN2RCxXQUFXLENBQUMsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUN2RCxXQUFXLENBQUMsdUJBQXVCLG9CQUFNLFdBQVcsRUFBSyxtQkFBbUIsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNqRzs7O0lBQU8sR0FBRyxFQUFFLENBQUMsb0JBQW9CLEVBQUM7QUFDcEMsQ0FBQzs7Ozs7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE1BQXNCO0lBQ2pELE9BQU8sTUFBTSxDQUFDLE1BQU07Ozs7O0lBQUMsQ0FBQyxJQUFTLEVBQUUsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQztBQUNsRixDQUFDOzs7Ozs7Ozs7QUFTRCxNQUFNLE9BQU8sa0NBQWtDLEdBQUcsRUFBRTs7Ozs7QUFLcEQsTUFBTSxPQUFPLGlDQUFpQyxHQUFlO0lBQzNEO1FBQ0UsT0FBTyxFQUFFLGVBQWU7UUFDeEIsVUFBVSxFQUFFLGNBQWM7UUFDMUIsSUFBSSxFQUFFO1lBQ0osQ0FBQyxZQUFZLEVBQUUsSUFBSSxRQUFRLEVBQUUsQ0FBQztTQUMvQjtRQUNELEtBQUssRUFBRSxJQUFJO0tBQ1o7Q0FDRjs7QUFFRCxNQUFNLE9BQU8sdUJBQXVCLEdBQUcsaUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FQUF9JTklUSUFMSVpFUiwgQXBwbGljYXRpb25SZWYsIERlYnVnTm9kZSwgTmdQcm9iZVRva2VuLCBOZ1pvbmUsIE9wdGlvbmFsLCBQcm92aWRlciwgZ2V0RGVidWdOb2RlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtleHBvcnROZ1Zhcn0gZnJvbSAnLi4vdXRpbCc7XG5cbmNvbnN0IENPUkVfVE9LRU5TID0gKCgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICdBcHBsaWNhdGlvblJlZic6IEFwcGxpY2F0aW9uUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAnTmdab25lJzogTmdab25lLFxuICAgICAgICAgICAgICAgICAgICAgfSkpKCk7XG5cbmNvbnN0IElOU1BFQ1RfR0xPQkFMX05BTUUgPSAncHJvYmUnO1xuY29uc3QgQ09SRV9UT0tFTlNfR0xPQkFMX05BTUUgPSAnY29yZVRva2Vucyc7XG5cbi8qKlxuICogUmV0dXJucyBhIHtAbGluayBEZWJ1Z0VsZW1lbnR9IGZvciB0aGUgZ2l2ZW4gbmF0aXZlIERPTSBlbGVtZW50LCBvclxuICogbnVsbCBpZiB0aGUgZ2l2ZW4gbmF0aXZlIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhbiBBbmd1bGFyIHZpZXcgYXNzb2NpYXRlZFxuICogd2l0aCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc3BlY3ROYXRpdmVFbGVtZW50KGVsZW1lbnQ6IGFueSk6IERlYnVnTm9kZXxudWxsIHtcbiAgcmV0dXJuIGdldERlYnVnTm9kZShlbGVtZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9jcmVhdGVOZ1Byb2JlKGNvcmVUb2tlbnM6IE5nUHJvYmVUb2tlbltdKTogYW55IHtcbiAgZXhwb3J0TmdWYXIoSU5TUEVDVF9HTE9CQUxfTkFNRSwgaW5zcGVjdE5hdGl2ZUVsZW1lbnQpO1xuICBleHBvcnROZ1ZhcihDT1JFX1RPS0VOU19HTE9CQUxfTkFNRSwgey4uLkNPUkVfVE9LRU5TLCAuLi5fbmdQcm9iZVRva2Vuc1RvTWFwKGNvcmVUb2tlbnMgfHwgW10pfSk7XG4gIHJldHVybiAoKSA9PiBpbnNwZWN0TmF0aXZlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gX25nUHJvYmVUb2tlbnNUb01hcCh0b2tlbnM6IE5nUHJvYmVUb2tlbltdKToge1tuYW1lOiBzdHJpbmddOiBhbnl9IHtcbiAgcmV0dXJuIHRva2Vucy5yZWR1Y2UoKHByZXY6IGFueSwgdDogYW55KSA9PiAocHJldlt0Lm5hbWVdID0gdC50b2tlbiwgcHJldiksIHt9KTtcbn1cblxuLyoqXG4gKiBJbiBJdnksIHdlIGRvbid0IHN1cHBvcnQgTmdQcm9iZSBiZWNhdXNlIHdlIGhhdmUgb3VyIG93biBzZXQgb2YgdGVzdGluZyB1dGlsaXRpZXNcbiAqIHdpdGggbW9yZSByb2J1c3QgZnVuY3Rpb25hbGl0eS5cbiAqXG4gKiBXZSBzaG91bGRuJ3QgYnJpbmcgaW4gTmdQcm9iZSBiZWNhdXNlIGl0IHByZXZlbnRzIERlYnVnTm9kZSBhbmQgZnJpZW5kcyBmcm9tXG4gKiB0cmVlLXNoYWtpbmcgcHJvcGVybHkuXG4gKi9cbmV4cG9ydCBjb25zdCBFTEVNRU5UX1BST0JFX1BST1ZJREVSU19fUE9TVF9SM19fID0gW107XG5cbi8qKlxuICogUHJvdmlkZXJzIHdoaWNoIHN1cHBvcnQgZGVidWdnaW5nIEFuZ3VsYXIgYXBwbGljYXRpb25zIChlLmcuIHZpYSBgbmcucHJvYmVgKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEVMRU1FTlRfUFJPQkVfUFJPVklERVJTX19QUkVfUjNfXzogUHJvdmlkZXJbXSA9IFtcbiAge1xuICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICB1c2VGYWN0b3J5OiBfY3JlYXRlTmdQcm9iZSxcbiAgICBkZXBzOiBbXG4gICAgICBbTmdQcm9iZVRva2VuLCBuZXcgT3B0aW9uYWwoKV0sXG4gICAgXSxcbiAgICBtdWx0aTogdHJ1ZSxcbiAgfSxcbl07XG5cbmV4cG9ydCBjb25zdCBFTEVNRU5UX1BST0JFX1BST1ZJREVSUyA9IEVMRU1FTlRfUFJPQkVfUFJPVklERVJTX19QUkVfUjNfXztcbiJdfQ==