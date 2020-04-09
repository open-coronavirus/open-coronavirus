import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';
import { raf } from './util/util';
let didInitialize = false;
export const appInitialize = (config, doc, zone) => {
    return () => {
        const win = doc.defaultView;
        if (win && typeof window !== 'undefined') {
            if (didInitialize) {
                console.warn('Ionic Angular was already initialized. Make sure IonicModule.forRoot() is just called once.');
            }
            didInitialize = true;
            const Ionic = win.Ionic = win.Ionic || {};
            Ionic.config = Object.assign({}, config, { _zoneGate: (h) => zone.run(h) });
            const aelFn = '__zone_symbol__addEventListener' in doc.body
                ? '__zone_symbol__addEventListener'
                : 'addEventListener';
            return applyPolyfills().then(() => {
                return defineCustomElements(win, {
                    exclude: ['ion-tabs', 'ion-tab'],
                    syncQueue: true,
                    raf,
                    jmp: (h) => zone.runOutsideAngular(h),
                    ael(elm, eventName, cb, opts) {
                        elm[aelFn](eventName, cb, opts);
                    },
                    rel(elm, eventName, cb, opts) {
                        elm.removeEventListener(eventName, cb, opts);
                    }
                });
            });
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWluaXRpYWxpemUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImFwcC1pbml0aWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUkxRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWxDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztBQUUxQixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFjLEVBQUUsR0FBYSxFQUFFLElBQVksRUFBRSxFQUFFO0lBQzNFLE9BQU8sR0FBUSxFQUFFO1FBQ2YsTUFBTSxHQUFHLEdBQTRCLEdBQUcsQ0FBQyxXQUFrQixDQUFDO1FBQzVELElBQUksR0FBRyxJQUFJLE9BQVEsTUFBYyxLQUFLLFdBQVcsRUFBRTtZQUNqRCxJQUFJLGFBQWEsRUFBRTtnQkFDakIsT0FBTyxDQUFDLElBQUksQ0FBQyw2RkFBNkYsQ0FBQyxDQUFDO2FBQzdHO1lBQ0QsYUFBYSxHQUFHLElBQUksQ0FBQztZQUNyQixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBRTFDLEtBQUssQ0FBQyxNQUFNLHFCQUNQLE1BQU0sSUFDVCxTQUFTLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQ25DLENBQUM7WUFFRixNQUFNLEtBQUssR0FBRyxpQ0FBaUMsSUFBSyxHQUFHLENBQUMsSUFBWTtnQkFDbEUsQ0FBQyxDQUFDLGlDQUFpQztnQkFDbkMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO1lBRXZCLE9BQU8sY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDaEMsT0FBTyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUU7b0JBQy9CLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUM7b0JBQ2hDLFNBQVMsRUFBRSxJQUFJO29CQUNmLEdBQUc7b0JBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSTt3QkFDekIsR0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzNDLENBQUM7b0JBQ0QsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUk7d0JBQzFCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUMvQyxDQUFDO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFwcGx5UG9seWZpbGxzLCBkZWZpbmVDdXN0b21FbGVtZW50cyB9IGZyb20gJ0Bpb25pYy9jb3JlL2xvYWRlcic7XG5cbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbmZpZyc7XG5pbXBvcnQgeyBJb25pY1dpbmRvdyB9IGZyb20gJy4vdHlwZXMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyByYWYgfSBmcm9tICcuL3V0aWwvdXRpbCc7XG5cbmxldCBkaWRJbml0aWFsaXplID0gZmFsc2U7XG5cbmV4cG9ydCBjb25zdCBhcHBJbml0aWFsaXplID0gKGNvbmZpZzogQ29uZmlnLCBkb2M6IERvY3VtZW50LCB6b25lOiBOZ1pvbmUpID0+IHtcbiAgcmV0dXJuICgpOiBhbnkgPT4ge1xuICAgIGNvbnN0IHdpbjogSW9uaWNXaW5kb3cgfCB1bmRlZmluZWQgPSBkb2MuZGVmYXVsdFZpZXcgYXMgYW55O1xuICAgIGlmICh3aW4gJiYgdHlwZW9mICh3aW5kb3cgYXMgYW55KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChkaWRJbml0aWFsaXplKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignSW9uaWMgQW5ndWxhciB3YXMgYWxyZWFkeSBpbml0aWFsaXplZC4gTWFrZSBzdXJlIElvbmljTW9kdWxlLmZvclJvb3QoKSBpcyBqdXN0IGNhbGxlZCBvbmNlLicpO1xuICAgICAgfVxuICAgICAgZGlkSW5pdGlhbGl6ZSA9IHRydWU7XG4gICAgICBjb25zdCBJb25pYyA9IHdpbi5Jb25pYyA9IHdpbi5Jb25pYyB8fCB7fTtcblxuICAgICAgSW9uaWMuY29uZmlnID0ge1xuICAgICAgICAuLi5jb25maWcsXG4gICAgICAgIF96b25lR2F0ZTogKGg6IGFueSkgPT4gem9uZS5ydW4oaClcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFlbEZuID0gJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInIGluIChkb2MuYm9keSBhcyBhbnkpXG4gICAgICAgID8gJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInXG4gICAgICAgIDogJ2FkZEV2ZW50TGlzdGVuZXInO1xuXG4gICAgICByZXR1cm4gYXBwbHlQb2x5ZmlsbHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRlZmluZUN1c3RvbUVsZW1lbnRzKHdpbiwge1xuICAgICAgICAgIGV4Y2x1ZGU6IFsnaW9uLXRhYnMnLCAnaW9uLXRhYiddLFxuICAgICAgICAgIHN5bmNRdWV1ZTogdHJ1ZSxcbiAgICAgICAgICByYWYsXG4gICAgICAgICAgam1wOiAoaDogYW55KSA9PiB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKGgpLFxuICAgICAgICAgIGFlbChlbG0sIGV2ZW50TmFtZSwgY2IsIG9wdHMpIHtcbiAgICAgICAgICAgIChlbG0gYXMgYW55KVthZWxGbl0oZXZlbnROYW1lLCBjYiwgb3B0cyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWwoZWxtLCBldmVudE5hbWUsIGNiLCBvcHRzKSB7XG4gICAgICAgICAgICBlbG0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiLCBvcHRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcbiJdfQ==