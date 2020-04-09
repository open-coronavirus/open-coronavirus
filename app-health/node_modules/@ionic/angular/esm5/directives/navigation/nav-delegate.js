import * as tslib_1 from "tslib";
import { ComponentFactoryResolver, Directive, ElementRef, Injector, ViewContainerRef } from '@angular/core';
import { AngularDelegate } from '../../providers/angular-delegate';
import { ProxyCmp, proxyOutputs } from '../proxies-utils';
var NavDelegate = /** @class */ (function () {
    function NavDelegate(ref, resolver, injector, angularDelegate, location) {
        this.el = ref.nativeElement;
        ref.nativeElement.delegate = angularDelegate.create(resolver, injector, location);
        proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
    }
    NavDelegate.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ComponentFactoryResolver },
        { type: Injector },
        { type: AngularDelegate },
        { type: ViewContainerRef }
    ]; };
    NavDelegate = tslib_1.__decorate([
        ProxyCmp({
            inputs: ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'],
            methods: ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']
        }),
        Directive({
            selector: 'ion-nav'
        })
    ], NavDelegate);
    return NavDelegate;
}());
export { NavDelegate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWRlbGVnYXRlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL25hdmlnYXRpb24vbmF2LWRlbGVnYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUcsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFTMUQ7SUFFRSxxQkFDRSxHQUFlLEVBQ2YsUUFBa0MsRUFDbEMsUUFBa0IsRUFDbEIsZUFBZ0MsRUFDaEMsUUFBMEI7UUFFMUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRixZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRyxrQkFBa0IsQ0FBRSxDQUFDLENBQUM7SUFDekUsQ0FBQzs7Z0JBVE0sVUFBVTtnQkFDTCx3QkFBd0I7Z0JBQ3hCLFFBQVE7Z0JBQ0QsZUFBZTtnQkFDdEIsZ0JBQWdCOztJQVBqQixXQUFXO1FBUHZCLFFBQVEsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUM7WUFDdkUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxDQUFDO1NBQ3JLLENBQUM7UUFDRCxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsU0FBUztTQUNwQixDQUFDO09BQ1csV0FBVyxDQWF2QjtJQUFELGtCQUFDO0NBQUEsQUFiRCxJQWFDO1NBYlksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RvciwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBbmd1bGFyRGVsZWdhdGUgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvYW5ndWxhci1kZWxlZ2F0ZSc7XG5pbXBvcnQgeyBQcm94eUNtcCwgcHJveHlPdXRwdXRzIH0gZnJvbSAnLi4vcHJveGllcy11dGlscyc7XG5cbkBQcm94eUNtcCh7XG4gIGlucHV0czogWydhbmltYXRlZCcsICdhbmltYXRpb24nLCAncm9vdCcsICdyb290UGFyYW1zJywgJ3N3aXBlR2VzdHVyZSddLFxuICBtZXRob2RzOiBbJ3B1c2gnLCAnaW5zZXJ0JywgJ2luc2VydFBhZ2VzJywgJ3BvcCcsICdwb3BUbycsICdwb3BUb1Jvb3QnLCAncmVtb3ZlSW5kZXgnLCAnc2V0Um9vdCcsICdzZXRQYWdlcycsICdnZXRBY3RpdmUnLCAnZ2V0QnlJbmRleCcsICdjYW5Hb0JhY2snLCAnZ2V0UHJldmlvdXMnXVxufSlcbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lvbi1uYXYnXG59KVxuZXhwb3J0IGNsYXNzIE5hdkRlbGVnYXRlIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoXG4gICAgcmVmOiBFbGVtZW50UmVmLFxuICAgIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGFuZ3VsYXJEZWxlZ2F0ZTogQW5ndWxhckRlbGVnYXRlLFxuICAgIGxvY2F0aW9uOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge1xuICAgIHRoaXMuZWwgPSByZWYubmF0aXZlRWxlbWVudDtcbiAgICByZWYubmF0aXZlRWxlbWVudC5kZWxlZ2F0ZSA9IGFuZ3VsYXJEZWxlZ2F0ZS5jcmVhdGUocmVzb2x2ZXIsIGluamVjdG9yLCBsb2NhdGlvbik7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFsnaW9uTmF2RGlkQ2hhbmdlJyAsICdpb25OYXZXaWxsQ2hhbmdlJyBdKTtcbiAgfVxufVxuIl19