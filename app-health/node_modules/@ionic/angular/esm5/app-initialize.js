import * as tslib_1 from "tslib";
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';
import { raf } from './util/util';
var didInitialize = false;
export var appInitialize = function (config, doc, zone) {
    return function () {
        var win = doc.defaultView;
        if (win && typeof window !== 'undefined') {
            if (didInitialize) {
                console.warn('Ionic Angular was already initialized. Make sure IonicModule.forRoot() is just called once.');
            }
            didInitialize = true;
            var Ionic = win.Ionic = win.Ionic || {};
            Ionic.config = tslib_1.__assign({}, config, { _zoneGate: function (h) { return zone.run(h); } });
            var aelFn_1 = '__zone_symbol__addEventListener' in doc.body
                ? '__zone_symbol__addEventListener'
                : 'addEventListener';
            return applyPolyfills().then(function () {
                return defineCustomElements(win, {
                    exclude: ['ion-tabs', 'ion-tab'],
                    syncQueue: true,
                    raf: raf,
                    jmp: function (h) { return zone.runOutsideAngular(h); },
                    ael: function (elm, eventName, cb, opts) {
                        elm[aelFn_1](eventName, cb, opts);
                    },
                    rel: function (elm, eventName, cb, opts) {
                        elm.removeEventListener(eventName, cb, opts);
                    }
                });
            });
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWluaXRpYWxpemUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImFwcC1pbml0aWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFJMUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVsQyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFFMUIsTUFBTSxDQUFDLElBQU0sYUFBYSxHQUFHLFVBQUMsTUFBYyxFQUFFLEdBQWEsRUFBRSxJQUFZO0lBQ3ZFLE9BQU87UUFDTCxJQUFNLEdBQUcsR0FBNEIsR0FBRyxDQUFDLFdBQWtCLENBQUM7UUFDNUQsSUFBSSxHQUFHLElBQUksT0FBUSxNQUFjLEtBQUssV0FBVyxFQUFFO1lBQ2pELElBQUksYUFBYSxFQUFFO2dCQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLDZGQUE2RixDQUFDLENBQUM7YUFDN0c7WUFDRCxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFFMUMsS0FBSyxDQUFDLE1BQU0sd0JBQ1AsTUFBTSxJQUNULFNBQVMsRUFBRSxVQUFDLENBQU0sSUFBSyxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxHQUNuQyxDQUFDO1lBRUYsSUFBTSxPQUFLLEdBQUcsaUNBQWlDLElBQUssR0FBRyxDQUFDLElBQVk7Z0JBQ2xFLENBQUMsQ0FBQyxpQ0FBaUM7Z0JBQ25DLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztZQUV2QixPQUFPLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDM0IsT0FBTyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUU7b0JBQy9CLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUM7b0JBQ2hDLFNBQVMsRUFBRSxJQUFJO29CQUNmLEdBQUcsS0FBQTtvQkFDSCxHQUFHLEVBQUUsVUFBQyxDQUFNLElBQUssT0FBQSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQXpCLENBQXlCO29CQUMxQyxHQUFHLEVBQUgsVUFBSSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxJQUFJO3dCQUN6QixHQUFXLENBQUMsT0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0MsQ0FBQztvQkFDRCxHQUFHLFlBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSTt3QkFDMUIsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQy9DLENBQUM7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgYXBwbHlQb2x5ZmlsbHMsIGRlZmluZUN1c3RvbUVsZW1lbnRzIH0gZnJvbSAnQGlvbmljL2NvcmUvbG9hZGVyJztcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi9wcm92aWRlcnMvY29uZmlnJztcbmltcG9ydCB7IElvbmljV2luZG93IH0gZnJvbSAnLi90eXBlcy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHJhZiB9IGZyb20gJy4vdXRpbC91dGlsJztcblxubGV0IGRpZEluaXRpYWxpemUgPSBmYWxzZTtcblxuZXhwb3J0IGNvbnN0IGFwcEluaXRpYWxpemUgPSAoY29uZmlnOiBDb25maWcsIGRvYzogRG9jdW1lbnQsIHpvbmU6IE5nWm9uZSkgPT4ge1xuICByZXR1cm4gKCk6IGFueSA9PiB7XG4gICAgY29uc3Qgd2luOiBJb25pY1dpbmRvdyB8IHVuZGVmaW5lZCA9IGRvYy5kZWZhdWx0VmlldyBhcyBhbnk7XG4gICAgaWYgKHdpbiAmJiB0eXBlb2YgKHdpbmRvdyBhcyBhbnkpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGRpZEluaXRpYWxpemUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdJb25pYyBBbmd1bGFyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLiBNYWtlIHN1cmUgSW9uaWNNb2R1bGUuZm9yUm9vdCgpIGlzIGp1c3QgY2FsbGVkIG9uY2UuJyk7XG4gICAgICB9XG4gICAgICBkaWRJbml0aWFsaXplID0gdHJ1ZTtcbiAgICAgIGNvbnN0IElvbmljID0gd2luLklvbmljID0gd2luLklvbmljIHx8IHt9O1xuXG4gICAgICBJb25pYy5jb25maWcgPSB7XG4gICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgX3pvbmVHYXRlOiAoaDogYW55KSA9PiB6b25lLnJ1bihoKVxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWVsRm4gPSAnX196b25lX3N5bWJvbF9fYWRkRXZlbnRMaXN0ZW5lcicgaW4gKGRvYy5ib2R5IGFzIGFueSlcbiAgICAgICAgPyAnX196b25lX3N5bWJvbF9fYWRkRXZlbnRMaXN0ZW5lcidcbiAgICAgICAgOiAnYWRkRXZlbnRMaXN0ZW5lcic7XG5cbiAgICAgIHJldHVybiBhcHBseVBvbHlmaWxscygpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZGVmaW5lQ3VzdG9tRWxlbWVudHMod2luLCB7XG4gICAgICAgICAgZXhjbHVkZTogWydpb24tdGFicycsICdpb24tdGFiJ10sXG4gICAgICAgICAgc3luY1F1ZXVlOiB0cnVlLFxuICAgICAgICAgIHJhZixcbiAgICAgICAgICBqbXA6IChoOiBhbnkpID0+IHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoaCksXG4gICAgICAgICAgYWVsKGVsbSwgZXZlbnROYW1lLCBjYiwgb3B0cykge1xuICAgICAgICAgICAgKGVsbSBhcyBhbnkpW2FlbEZuXShldmVudE5hbWUsIGNiLCBvcHRzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbChlbG0sIGV2ZW50TmFtZSwgY2IsIG9wdHMpIHtcbiAgICAgICAgICAgIGVsbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IsIG9wdHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuIl19