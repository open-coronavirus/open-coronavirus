import * as tslib_1 from "tslib";
import { ComponentFactoryResolver, Directive, ElementRef, Injector, ViewContainerRef } from '@angular/core';
import { AngularDelegate } from '../../providers/angular-delegate';
import { ProxyCmp, proxyOutputs } from '../proxies-utils';
let NavDelegate = class NavDelegate {
    constructor(ref, resolver, injector, angularDelegate, location) {
        this.el = ref.nativeElement;
        ref.nativeElement.delegate = angularDelegate.create(resolver, injector, location);
        proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
    }
};
NavDelegate.ctorParameters = () => [
    { type: ElementRef },
    { type: ComponentFactoryResolver },
    { type: Injector },
    { type: AngularDelegate },
    { type: ViewContainerRef }
];
NavDelegate = tslib_1.__decorate([
    ProxyCmp({
        inputs: ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'],
        methods: ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']
    }),
    Directive({
        selector: 'ion-nav'
    })
], NavDelegate);
export { NavDelegate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWRlbGVnYXRlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL25hdmlnYXRpb24vbmF2LWRlbGVnYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUcsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFTMUQsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztJQUV0QixZQUNFLEdBQWUsRUFDZixRQUFrQyxFQUNsQyxRQUFrQixFQUNsQixlQUFnQyxFQUNoQyxRQUEwQjtRQUUxQixJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7UUFDNUIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xGLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixFQUFHLGtCQUFrQixDQUFFLENBQUMsQ0FBQztJQUN6RSxDQUFDO0NBQ0YsQ0FBQTs7WUFWUSxVQUFVO1lBQ0wsd0JBQXdCO1lBQ3hCLFFBQVE7WUFDRCxlQUFlO1lBQ3RCLGdCQUFnQjs7QUFQakIsV0FBVztJQVB2QixRQUFRLENBQUM7UUFDUixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDO1FBQ3ZFLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztLQUNySyxDQUFDO0lBQ0QsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFNBQVM7S0FDcEIsQ0FBQztHQUNXLFdBQVcsQ0FhdkI7U0FiWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEFuZ3VsYXJEZWxlZ2F0ZSB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9hbmd1bGFyLWRlbGVnYXRlJztcbmltcG9ydCB7IFByb3h5Q21wLCBwcm94eU91dHB1dHMgfSBmcm9tICcuLi9wcm94aWVzLXV0aWxzJztcblxuQFByb3h5Q21wKHtcbiAgaW5wdXRzOiBbJ2FuaW1hdGVkJywgJ2FuaW1hdGlvbicsICdyb290JywgJ3Jvb3RQYXJhbXMnLCAnc3dpcGVHZXN0dXJlJ10sXG4gIG1ldGhvZHM6IFsncHVzaCcsICdpbnNlcnQnLCAnaW5zZXJ0UGFnZXMnLCAncG9wJywgJ3BvcFRvJywgJ3BvcFRvUm9vdCcsICdyZW1vdmVJbmRleCcsICdzZXRSb290JywgJ3NldFBhZ2VzJywgJ2dldEFjdGl2ZScsICdnZXRCeUluZGV4JywgJ2NhbkdvQmFjaycsICdnZXRQcmV2aW91cyddXG59KVxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW9uLW5hdidcbn0pXG5leHBvcnQgY2xhc3MgTmF2RGVsZWdhdGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWY6IEVsZW1lbnRSZWYsXG4gICAgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgYW5ndWxhckRlbGVnYXRlOiBBbmd1bGFyRGVsZWdhdGUsXG4gICAgbG9jYXRpb246IFZpZXdDb250YWluZXJSZWZcbiAgKSB7XG4gICAgdGhpcy5lbCA9IHJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHJlZi5uYXRpdmVFbGVtZW50LmRlbGVnYXRlID0gYW5ndWxhckRlbGVnYXRlLmNyZWF0ZShyZXNvbHZlciwgaW5qZWN0b3IsIGxvY2F0aW9uKTtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgWydpb25OYXZEaWRDaGFuZ2UnICwgJ2lvbk5hdldpbGxDaGFuZ2UnIF0pO1xuICB9XG59XG4iXX0=