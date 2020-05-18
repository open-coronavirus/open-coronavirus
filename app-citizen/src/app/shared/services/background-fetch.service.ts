import {Injectable} from "@angular/core";
import {InfectedKeysProcessorService} from "./keys/infected-keys-processor.service";
import {TracingService} from "./tracing.service";
import BackgroundFetch from "cordova-plugin-background-fetch";
import {BluetoothTrackingService} from "./tracking/bluetooth-tracking.service";
import {LoggingService} from "./logging.service";

@Injectable()
export class BackgroundFetchService {

    public constructor(
        protected tracingService: TracingService,
        protected bluetoothTrackingService: BluetoothTrackingService,
        protected loggingService: LoggingService,
        protected keyMatcherService: InfectedKeysProcessorService) {
    }

    public startBackgroundFetchServices() {

        // Your background-fetch handler.
        let fetchCallback = (taskId) => {
            this.loggingService.error("[BackgroundFetchService] Background fetch task starts: " + taskId);
            this.bluetoothTrackingService.restartAdvertising();
            this.tracingService.checkNewInfectedKeys().then(() => {
                BackgroundFetch.finish(taskId);
                this.loggingService.error("[BackgroundFetchService] Background fetch task ends.");
            });
        };

        let failureCallback = (error) => {
            this.loggingService.error("[BackgroundFetchService] error trying to execute background fetch task: " + JSON.stringify(error));
        };

        BackgroundFetch.configure(fetchCallback, failureCallback, {
            minimumFetchInterval: 15 // <-- default is 15
        });

    }


}
