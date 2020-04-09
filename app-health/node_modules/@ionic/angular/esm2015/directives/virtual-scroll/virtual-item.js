import * as tslib_1 from "tslib";
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * @hidden
 */
let VirtualItem = class VirtualItem {
    constructor(templateRef, viewContainer) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
};
VirtualItem.ctorParameters = () => [
    { type: TemplateRef },
    { type: ViewContainerRef }
];
VirtualItem = tslib_1.__decorate([
    Directive({ selector: '[virtualItem]' })
], VirtualItem);
export { VirtualItem };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1pdGVtLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL3ZpcnR1YWwtc2Nyb2xsL3ZpcnR1YWwtaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJekU7O0dBRUc7QUFFSCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBQ3RCLFlBQW1CLFdBQXdDLEVBQVMsYUFBK0I7UUFBaEYsZ0JBQVcsR0FBWCxXQUFXLENBQTZCO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQWtCO0lBQUcsQ0FBQztDQUN4RyxDQUFBOztZQURpQyxXQUFXO1lBQXdDLGdCQUFnQjs7QUFEeEYsV0FBVztJQUR2QixTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLENBQUM7R0FDNUIsV0FBVyxDQUV2QjtTQUZZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpcnR1YWxDb250ZXh0IH0gZnJvbSAnLi92aXJ0dWFsLXV0aWxzJztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1t2aXJ0dWFsSXRlbV0nIH0pXG5leHBvcnQgY2xhc3MgVmlydHVhbEl0ZW0ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPFZpcnR1YWxDb250ZXh0PiwgcHVibGljIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYpIHt9XG59XG4iXX0=