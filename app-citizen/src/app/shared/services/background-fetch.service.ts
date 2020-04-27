import {Injectable} from "@angular/core";
import BackgroundFetch from "cordova-plugin-background-fetch";
import {InfectedKeysProcessorService} from "./keys/infected-keys-processor.service";
import {InfectedKeyControllerService} from "../sdk";
import {TracingService} from "./tracing.service";

@Injectable()
export class BackgroundFetchService {

    public constructor(
        protected tracingService: TracingService,
        protected keyMatcherService: InfectedKeysProcessorService) {

        try {
            BackgroundFetch.configure(this.fetchCallback, this.failureCallback, {
                minimumFetchInterval: 15, // <-- default is 15
                forceAlarmManager: true
            });
        } catch (error) {
            console.log("err: ", error);
        }


    }

    public async fetchCallback(taskId) {
        console.error("Background fetch task " + taskId + " starts ...");
        this.tracingService.checkNewInfectedKeys().then(() => {
            BackgroundFetch.finish(taskId);
            console.error("Background fetch task " + taskId + " ends.");
        });
    }

    failureCallback(error) {
        console.log('- BackgroundFetch failed', error);
    };


}
