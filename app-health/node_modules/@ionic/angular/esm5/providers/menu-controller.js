import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { menuController } from '@ionic/core';
import * as i0 from "@angular/core";
var MenuController = /** @class */ (function () {
    function MenuController() {
    }
    /**
     * Programmatically open the Menu.
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return returns a promise when the menu is fully opened
     */
    MenuController.prototype.open = function (menuId) {
        return menuController.open(menuId);
    };
    /**
     * Programmatically close the Menu. If no `menuId` is given as the first
     * argument then it'll close any menu which is open. If a `menuId`
     * is given then it'll close that exact menu.
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return returns a promise when the menu is fully closed
     */
    MenuController.prototype.close = function (menuId) {
        return menuController.close(menuId);
    };
    /**
     * Toggle the menu. If it's closed, it will open, and if opened, it
     * will close.
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return returns a promise when the menu has been toggled
     */
    MenuController.prototype.toggle = function (menuId) {
        return menuController.toggle(menuId);
    };
    /**
     * Used to enable or disable a menu. For example, there could be multiple
     * left menus, but only one of them should be able to be opened at the same
     * time. If there are multiple menus on the same side, then enabling one menu
     * will also automatically disable all the others that are on the same side.
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return Returns the instance of the menu, which is useful for chaining.
     */
    MenuController.prototype.enable = function (shouldEnable, menuId) {
        return menuController.enable(shouldEnable, menuId);
    };
    /**
     * Used to enable or disable the ability to swipe open the menu.
     * @param shouldEnable  True if it should be swipe-able, false if not.
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return Returns the instance of the menu, which is useful for chaining.
     */
    MenuController.prototype.swipeGesture = function (shouldEnable, menuId) {
        return menuController.swipeGesture(shouldEnable, menuId);
    };
    /**
     * @param [menuId] Optionally get the menu by its id, or side.
     * @return Returns true if the specified menu is currently open, otherwise false.
     * If the menuId is not specified, it returns true if ANY menu is currenly open.
     */
    MenuController.prototype.isOpen = function (menuId) {
        return menuController.isOpen(menuId);
    };
    /**
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return Returns true if the menu is currently enabled, otherwise false.
     */
    MenuController.prototype.isEnabled = function (menuId) {
        return menuController.isEnabled(menuId);
    };
    /**
     * Used to get a menu instance. If a `menuId` is not provided then it'll
     * return the first menu found. If a `menuId` is `left` or `right`, then
     * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
     * provided, then it'll try to find the menu using the menu's `id`
     * property. If a menu is not found then it'll return `null`.
     * @param [menuId]  Optionally get the menu by its id, or side.
     * @return Returns the instance of the menu if found, otherwise `null`.
     */
    MenuController.prototype.get = function (menuId) {
        return menuController.get(menuId);
    };
    /**
     * @return Returns the instance of the menu already opened, otherwise `null`.
     */
    MenuController.prototype.getOpen = function () {
        return menuController.getOpen();
    };
    /**
     * @return Returns an array of all menu instances.
     */
    MenuController.prototype.getMenus = function () {
        return menuController.getMenus();
    };
    MenuController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function MenuController_Factory() { return new MenuController(); }, token: MenuController, providedIn: "root" });
    MenuController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], MenuController);
    return MenuController;
}());
export { MenuController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJwcm92aWRlcnMvbWVudS1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBSzdDO0lBQUE7S0FpR0M7SUEvRkM7Ozs7T0FJRztJQUNILDZCQUFJLEdBQUosVUFBSyxNQUFlO1FBQ2xCLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsOEJBQUssR0FBTCxVQUFNLE1BQWU7UUFDbkIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILCtCQUFNLEdBQU4sVUFBTyxNQUFlO1FBQ3BCLE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILCtCQUFNLEdBQU4sVUFBTyxZQUFxQixFQUFFLE1BQWU7UUFDM0MsT0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxxQ0FBWSxHQUFaLFVBQWEsWUFBcUIsRUFBRSxNQUFlO1FBQ2pELE9BQU8sY0FBYyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCwrQkFBTSxHQUFOLFVBQU8sTUFBZTtRQUNwQixPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtDQUFTLEdBQVQsVUFBVSxNQUFlO1FBQ3ZCLE9BQU8sY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCw0QkFBRyxHQUFILFVBQUksTUFBZTtRQUNqQixPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZ0NBQU8sR0FBUDtRQUNFLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILGlDQUFRLEdBQVI7UUFDRSxPQUFPLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQyxDQUFDOztJQWhHVSxjQUFjO1FBSDFCLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7T0FDVyxjQUFjLENBaUcxQjt5QkF2R0Q7Q0F1R0MsQUFqR0QsSUFpR0M7U0FqR1ksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG1lbnVDb250cm9sbGVyIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTWVudUNvbnRyb2xsZXIge1xuXG4gIC8qKlxuICAgKiBQcm9ncmFtbWF0aWNhbGx5IG9wZW4gdGhlIE1lbnUuXG4gICAqIEBwYXJhbSBbbWVudUlkXSAgT3B0aW9uYWxseSBnZXQgdGhlIG1lbnUgYnkgaXRzIGlkLCBvciBzaWRlLlxuICAgKiBAcmV0dXJuIHJldHVybnMgYSBwcm9taXNlIHdoZW4gdGhlIG1lbnUgaXMgZnVsbHkgb3BlbmVkXG4gICAqL1xuICBvcGVuKG1lbnVJZD86IHN0cmluZykge1xuICAgIHJldHVybiBtZW51Q29udHJvbGxlci5vcGVuKG1lbnVJZCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvZ3JhbW1hdGljYWxseSBjbG9zZSB0aGUgTWVudS4gSWYgbm8gYG1lbnVJZGAgaXMgZ2l2ZW4gYXMgdGhlIGZpcnN0XG4gICAqIGFyZ3VtZW50IHRoZW4gaXQnbGwgY2xvc2UgYW55IG1lbnUgd2hpY2ggaXMgb3Blbi4gSWYgYSBgbWVudUlkYFxuICAgKiBpcyBnaXZlbiB0aGVuIGl0J2xsIGNsb3NlIHRoYXQgZXhhY3QgbWVudS5cbiAgICogQHBhcmFtIFttZW51SWRdICBPcHRpb25hbGx5IGdldCB0aGUgbWVudSBieSBpdHMgaWQsIG9yIHNpZGUuXG4gICAqIEByZXR1cm4gcmV0dXJucyBhIHByb21pc2Ugd2hlbiB0aGUgbWVudSBpcyBmdWxseSBjbG9zZWRcbiAgICovXG4gIGNsb3NlKG1lbnVJZD86IHN0cmluZykge1xuICAgIHJldHVybiBtZW51Q29udHJvbGxlci5jbG9zZShtZW51SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgbWVudS4gSWYgaXQncyBjbG9zZWQsIGl0IHdpbGwgb3BlbiwgYW5kIGlmIG9wZW5lZCwgaXRcbiAgICogd2lsbCBjbG9zZS5cbiAgICogQHBhcmFtIFttZW51SWRdICBPcHRpb25hbGx5IGdldCB0aGUgbWVudSBieSBpdHMgaWQsIG9yIHNpZGUuXG4gICAqIEByZXR1cm4gcmV0dXJucyBhIHByb21pc2Ugd2hlbiB0aGUgbWVudSBoYXMgYmVlbiB0b2dnbGVkXG4gICAqL1xuICB0b2dnbGUobWVudUlkPzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1lbnVDb250cm9sbGVyLnRvZ2dsZShtZW51SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgYSBtZW51LiBGb3IgZXhhbXBsZSwgdGhlcmUgY291bGQgYmUgbXVsdGlwbGVcbiAgICogbGVmdCBtZW51cywgYnV0IG9ubHkgb25lIG9mIHRoZW0gc2hvdWxkIGJlIGFibGUgdG8gYmUgb3BlbmVkIGF0IHRoZSBzYW1lXG4gICAqIHRpbWUuIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBtZW51cyBvbiB0aGUgc2FtZSBzaWRlLCB0aGVuIGVuYWJsaW5nIG9uZSBtZW51XG4gICAqIHdpbGwgYWxzbyBhdXRvbWF0aWNhbGx5IGRpc2FibGUgYWxsIHRoZSBvdGhlcnMgdGhhdCBhcmUgb24gdGhlIHNhbWUgc2lkZS5cbiAgICogQHBhcmFtIFttZW51SWRdICBPcHRpb25hbGx5IGdldCB0aGUgbWVudSBieSBpdHMgaWQsIG9yIHNpZGUuXG4gICAqIEByZXR1cm4gUmV0dXJucyB0aGUgaW5zdGFuY2Ugb2YgdGhlIG1lbnUsIHdoaWNoIGlzIHVzZWZ1bCBmb3IgY2hhaW5pbmcuXG4gICAqL1xuICBlbmFibGUoc2hvdWxkRW5hYmxlOiBib29sZWFuLCBtZW51SWQ/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWVudUNvbnRyb2xsZXIuZW5hYmxlKHNob3VsZEVuYWJsZSwgbWVudUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBhYmlsaXR5IHRvIHN3aXBlIG9wZW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBzaG91bGRFbmFibGUgIFRydWUgaWYgaXQgc2hvdWxkIGJlIHN3aXBlLWFibGUsIGZhbHNlIGlmIG5vdC5cbiAgICogQHBhcmFtIFttZW51SWRdICBPcHRpb25hbGx5IGdldCB0aGUgbWVudSBieSBpdHMgaWQsIG9yIHNpZGUuXG4gICAqIEByZXR1cm4gUmV0dXJucyB0aGUgaW5zdGFuY2Ugb2YgdGhlIG1lbnUsIHdoaWNoIGlzIHVzZWZ1bCBmb3IgY2hhaW5pbmcuXG4gICAqL1xuICBzd2lwZUdlc3R1cmUoc2hvdWxkRW5hYmxlOiBib29sZWFuLCBtZW51SWQ/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWVudUNvbnRyb2xsZXIuc3dpcGVHZXN0dXJlKHNob3VsZEVuYWJsZSwgbWVudUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gW21lbnVJZF0gT3B0aW9uYWxseSBnZXQgdGhlIG1lbnUgYnkgaXRzIGlkLCBvciBzaWRlLlxuICAgKiBAcmV0dXJuIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIG1lbnUgaXMgY3VycmVudGx5IG9wZW4sIG90aGVyd2lzZSBmYWxzZS5cbiAgICogSWYgdGhlIG1lbnVJZCBpcyBub3Qgc3BlY2lmaWVkLCBpdCByZXR1cm5zIHRydWUgaWYgQU5ZIG1lbnUgaXMgY3VycmVubHkgb3Blbi5cbiAgICovXG4gIGlzT3BlbihtZW51SWQ/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWVudUNvbnRyb2xsZXIuaXNPcGVuKG1lbnVJZCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIFttZW51SWRdICBPcHRpb25hbGx5IGdldCB0aGUgbWVudSBieSBpdHMgaWQsIG9yIHNpZGUuXG4gICAqIEByZXR1cm4gUmV0dXJucyB0cnVlIGlmIHRoZSBtZW51IGlzIGN1cnJlbnRseSBlbmFibGVkLCBvdGhlcndpc2UgZmFsc2UuXG4gICAqL1xuICBpc0VuYWJsZWQobWVudUlkPzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1lbnVDb250cm9sbGVyLmlzRW5hYmxlZChtZW51SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gZ2V0IGEgbWVudSBpbnN0YW5jZS4gSWYgYSBgbWVudUlkYCBpcyBub3QgcHJvdmlkZWQgdGhlbiBpdCdsbFxuICAgKiByZXR1cm4gdGhlIGZpcnN0IG1lbnUgZm91bmQuIElmIGEgYG1lbnVJZGAgaXMgYGxlZnRgIG9yIGByaWdodGAsIHRoZW5cbiAgICogaXQnbGwgcmV0dXJuIHRoZSBlbmFibGVkIG1lbnUgb24gdGhhdCBzaWRlLiBPdGhlcndpc2UsIGlmIGEgYG1lbnVJZGAgaXNcbiAgICogcHJvdmlkZWQsIHRoZW4gaXQnbGwgdHJ5IHRvIGZpbmQgdGhlIG1lbnUgdXNpbmcgdGhlIG1lbnUncyBgaWRgXG4gICAqIHByb3BlcnR5LiBJZiBhIG1lbnUgaXMgbm90IGZvdW5kIHRoZW4gaXQnbGwgcmV0dXJuIGBudWxsYC5cbiAgICogQHBhcmFtIFttZW51SWRdICBPcHRpb25hbGx5IGdldCB0aGUgbWVudSBieSBpdHMgaWQsIG9yIHNpZGUuXG4gICAqIEByZXR1cm4gUmV0dXJucyB0aGUgaW5zdGFuY2Ugb2YgdGhlIG1lbnUgaWYgZm91bmQsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqL1xuICBnZXQobWVudUlkPzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1lbnVDb250cm9sbGVyLmdldChtZW51SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gUmV0dXJucyB0aGUgaW5zdGFuY2Ugb2YgdGhlIG1lbnUgYWxyZWFkeSBvcGVuZWQsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqL1xuICBnZXRPcGVuKCkge1xuICAgIHJldHVybiBtZW51Q29udHJvbGxlci5nZXRPcGVuKCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBtZW51IGluc3RhbmNlcy5cbiAgICovXG4gIGdldE1lbnVzKCkge1xuICAgIHJldHVybiBtZW51Q29udHJvbGxlci5nZXRNZW51cygpO1xuICB9XG59XG4iXX0=