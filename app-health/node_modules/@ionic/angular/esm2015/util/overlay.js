export class OverlayBaseController {
    constructor(ctrl) {
        this.ctrl = ctrl;
    }
    /**
     * Creates a new overlay
     */
    create(opts) {
        // TODO: next major release opts is not optional
        return this.ctrl.create((opts || {}));
    }
    /**
     * When `id` is not provided, it dismisses the top overlay.
     */
    dismiss(data, role, id) {
        return this.ctrl.dismiss(data, role, id);
    }
    /**
     * Returns the top overlay.
     */
    getTop() {
        return this.ctrl.getTop();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsidXRpbC9vdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE1BQU0sT0FBTyxxQkFBcUI7SUFDaEMsWUFBb0IsSUFBb0M7UUFBcEMsU0FBSSxHQUFKLElBQUksQ0FBZ0M7SUFBRyxDQUFDO0lBRTVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLElBQVc7UUFDaEIsZ0RBQWdEO1FBQ2hELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxPQUFPLENBQUMsSUFBVSxFQUFFLElBQWEsRUFBRSxFQUFXO1FBQzVDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW50ZXJmYWNlIENvbnRyb2xsZXJTaGFwZTxPcHRzLCBIVE1MRWxtPiB7XG4gIGNyZWF0ZShvcHRpb25zOiBPcHRzKTogUHJvbWlzZTxIVE1MRWxtPjtcbiAgZGlzbWlzcyhkYXRhPzogYW55LCByb2xlPzogc3RyaW5nLCBpZD86IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj47XG4gIGdldFRvcCgpOiBQcm9taXNlPEhUTUxFbG0gfCB1bmRlZmluZWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgT3ZlcmxheUJhc2VDb250cm9sbGVyPE9wdHMsIE92ZXJsYXk+IGltcGxlbWVudHMgQ29udHJvbGxlclNoYXBlPE9wdHMsIE92ZXJsYXk+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjdHJsOiBDb250cm9sbGVyU2hhcGU8T3B0cywgT3ZlcmxheT4pIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheVxuICAgKi9cbiAgY3JlYXRlKG9wdHM/OiBPcHRzKSB7XG4gICAgLy8gVE9ETzogbmV4dCBtYWpvciByZWxlYXNlIG9wdHMgaXMgbm90IG9wdGlvbmFsXG4gICAgcmV0dXJuIHRoaXMuY3RybC5jcmVhdGUoKG9wdHMgfHwge30pIGFzIGFueSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBgaWRgIGlzIG5vdCBwcm92aWRlZCwgaXQgZGlzbWlzc2VzIHRoZSB0b3Agb3ZlcmxheS5cbiAgICovXG4gIGRpc21pc3MoZGF0YT86IGFueSwgcm9sZT86IHN0cmluZywgaWQ/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5jdHJsLmRpc21pc3MoZGF0YSwgcm9sZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRvcCBvdmVybGF5LlxuICAgKi9cbiAgZ2V0VG9wKCkge1xuICAgIHJldHVybiB0aGlzLmN0cmwuZ2V0VG9wKCk7XG4gIH1cbn1cbiJdfQ==