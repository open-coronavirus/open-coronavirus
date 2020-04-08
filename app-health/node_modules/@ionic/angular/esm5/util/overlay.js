var OverlayBaseController = /** @class */ (function () {
    function OverlayBaseController(ctrl) {
        this.ctrl = ctrl;
    }
    /**
     * Creates a new overlay
     */
    OverlayBaseController.prototype.create = function (opts) {
        // TODO: next major release opts is not optional
        return this.ctrl.create((opts || {}));
    };
    /**
     * When `id` is not provided, it dismisses the top overlay.
     */
    OverlayBaseController.prototype.dismiss = function (data, role, id) {
        return this.ctrl.dismiss(data, role, id);
    };
    /**
     * Returns the top overlay.
     */
    OverlayBaseController.prototype.getTop = function () {
        return this.ctrl.getTop();
    };
    return OverlayBaseController;
}());
export { OverlayBaseController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsidXRpbC9vdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BO0lBQ0UsK0JBQW9CLElBQW9DO1FBQXBDLFNBQUksR0FBSixJQUFJLENBQWdDO0lBQUcsQ0FBQztJQUU1RDs7T0FFRztJQUNILHNDQUFNLEdBQU4sVUFBTyxJQUFXO1FBQ2hCLGdEQUFnRDtRQUNoRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdUNBQU8sR0FBUCxVQUFRLElBQVUsRUFBRSxJQUFhLEVBQUUsRUFBVztRQUM1QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsc0NBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbnRlcmZhY2UgQ29udHJvbGxlclNoYXBlPE9wdHMsIEhUTUxFbG0+IHtcbiAgY3JlYXRlKG9wdGlvbnM6IE9wdHMpOiBQcm9taXNlPEhUTUxFbG0+O1xuICBkaXNtaXNzKGRhdGE/OiBhbnksIHJvbGU/OiBzdHJpbmcsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPjtcbiAgZ2V0VG9wKCk6IFByb21pc2U8SFRNTEVsbSB8IHVuZGVmaW5lZD47XG59XG5cbmV4cG9ydCBjbGFzcyBPdmVybGF5QmFzZUNvbnRyb2xsZXI8T3B0cywgT3ZlcmxheT4gaW1wbGVtZW50cyBDb250cm9sbGVyU2hhcGU8T3B0cywgT3ZlcmxheT4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGN0cmw6IENvbnRyb2xsZXJTaGFwZTxPcHRzLCBPdmVybGF5Pikge31cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBvdmVybGF5XG4gICAqL1xuICBjcmVhdGUob3B0cz86IE9wdHMpIHtcbiAgICAvLyBUT0RPOiBuZXh0IG1ham9yIHJlbGVhc2Ugb3B0cyBpcyBub3Qgb3B0aW9uYWxcbiAgICByZXR1cm4gdGhpcy5jdHJsLmNyZWF0ZSgob3B0cyB8fCB7fSkgYXMgYW55KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGBpZGAgaXMgbm90IHByb3ZpZGVkLCBpdCBkaXNtaXNzZXMgdGhlIHRvcCBvdmVybGF5LlxuICAgKi9cbiAgZGlzbWlzcyhkYXRhPzogYW55LCByb2xlPzogc3RyaW5nLCBpZD86IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmN0cmwuZGlzbWlzcyhkYXRhLCByb2xlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdG9wIG92ZXJsYXkuXG4gICAqL1xuICBnZXRUb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3RybC5nZXRUb3AoKTtcbiAgfVxufVxuIl19