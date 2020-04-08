import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
let DomController = class DomController {
    /**
     * Schedules a task to run during the READ phase of the next frame.
     * This task should only read the DOM, but never modify it.
     */
    read(cb) {
        getQueue().read(cb);
    }
    /**
     * Schedules a task to run during the WRITE phase of the next frame.
     * This task should write the DOM, but never READ it.
     */
    write(cb) {
        getQueue().write(cb);
    }
};
DomController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function DomController_Factory() { return new DomController(); }, token: DomController, providedIn: "root" });
DomController = tslib_1.__decorate([
    Injectable({
        providedIn: 'root',
    })
], DomController);
export { DomController };
const getQueue = () => {
    const win = typeof window !== 'undefined' ? window : null;
    if (win != null) {
        const Ionic = win.Ionic;
        if (Ionic && Ionic.queue) {
            return Ionic.queue;
        }
        return {
            read: (cb) => win.requestAnimationFrame(cb),
            write: (cb) => win.requestAnimationFrame(cb)
        };
    }
    return {
        read: (cb) => cb(),
        write: (cb) => cb()
    };
};
const ɵ0 = getQueue;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9kb20tY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLM0MsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUV4Qjs7O09BR0c7SUFDSCxJQUFJLENBQUMsRUFBZTtRQUNsQixRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxFQUFlO1FBQ25CLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0YsQ0FBQTs7QUFqQlksYUFBYTtJQUh6QixVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDO0dBQ1csYUFBYSxDQWlCekI7U0FqQlksYUFBYTtBQW1CMUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO0lBQ3BCLE1BQU0sR0FBRyxHQUFHLE9BQVEsTUFBYyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFXLENBQUM7SUFFMUUsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ2YsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ3hCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQztTQUNwQjtRQUVELE9BQU87WUFDTCxJQUFJLEVBQUUsQ0FBQyxFQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUM7WUFDaEQsS0FBSyxFQUFFLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDO1NBQ2xELENBQUM7S0FDSDtJQUVELE9BQU87UUFDTCxJQUFJLEVBQUUsQ0FBQyxFQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QixLQUFLLEVBQUUsQ0FBQyxFQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUN6QixDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgRG9tQ29udHJvbGxlciB7XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlcyBhIHRhc2sgdG8gcnVuIGR1cmluZyB0aGUgUkVBRCBwaGFzZSBvZiB0aGUgbmV4dCBmcmFtZS5cbiAgICogVGhpcyB0YXNrIHNob3VsZCBvbmx5IHJlYWQgdGhlIERPTSwgYnV0IG5ldmVyIG1vZGlmeSBpdC5cbiAgICovXG4gIHJlYWQoY2I6IFJhZkNhbGxiYWNrKSB7XG4gICAgZ2V0UXVldWUoKS5yZWFkKGNiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYSB0YXNrIHRvIHJ1biBkdXJpbmcgdGhlIFdSSVRFIHBoYXNlIG9mIHRoZSBuZXh0IGZyYW1lLlxuICAgKiBUaGlzIHRhc2sgc2hvdWxkIHdyaXRlIHRoZSBET00sIGJ1dCBuZXZlciBSRUFEIGl0LlxuICAgKi9cbiAgd3JpdGUoY2I6IFJhZkNhbGxiYWNrKSB7XG4gICAgZ2V0UXVldWUoKS53cml0ZShjYik7XG4gIH1cbn1cblxuY29uc3QgZ2V0UXVldWUgPSAoKSA9PiB7XG4gIGNvbnN0IHdpbiA9IHR5cGVvZiAod2luZG93IGFzIGFueSkgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogbnVsbCBhcyBhbnk7XG5cbiAgaWYgKHdpbiAhPSBudWxsKSB7XG4gICAgY29uc3QgSW9uaWMgPSB3aW4uSW9uaWM7XG4gICAgaWYgKElvbmljICYmIElvbmljLnF1ZXVlKSB7XG4gICAgICByZXR1cm4gSW9uaWMucXVldWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlYWQ6IChjYjogYW55KSA9PiB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSxcbiAgICAgIHdyaXRlOiAoY2I6IGFueSkgPT4gd2luLnJlcXVlc3RBbmltYXRpb25GcmFtZShjYilcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZWFkOiAoY2I6IGFueSkgPT4gY2IoKSxcbiAgICB3cml0ZTogKGNiOiBhbnkpID0+IGNiKClcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFJhZkNhbGxiYWNrID0gKHRpbWVTdGFtcD86IG51bWJlcikgPT4gdm9pZDtcbiJdfQ==