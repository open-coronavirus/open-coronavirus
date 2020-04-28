import {Injectable} from "@angular/core";
import {InfectedKeysProcessorService} from "./keys/infected-keys-processor.service";
import {TracingService} from "./tracing.service";
import BackgroundFetch from "cordova-plugin-background-fetch";
import {BluetoothTrackingService} from "./tracking/bluetooth-tracking.service";

@Injectable()
export class BackgroundFetchService {

    public constructor(
        protected tracingService: TracingService,
        protected bluetoothTrackingService: BluetoothTrackingService,
        protected keyMatcherService: InfectedKeysProcessorService) {

    }

    public startBackgroundFetchServices() {

        // Your background-fetch handler.
        let fetchCallback = (taskId) => {
            console.error("[BackgroundFetchService] Background fetch task starts: " + taskId);
            this.bluetoothTrackingService.restartAdvertising();
            this.tracingService.checkNewInfectedKeys().then(() => {
                BackgroundFetch.finish(taskId);
                console.error("[BackgroundFetchService] Background fetch task ends.");
            });
        };

        let failureCallback = (error) => {
            console.error("[BackgroundFetchService] error trying to execute background fetch task: " + JSON.stringify(error));
        };

        BackgroundFetch.configure(fetchCallback, failureCallback, {
            minimumFetchInterval: 15 // <-- default is 15
        });

    }


}
