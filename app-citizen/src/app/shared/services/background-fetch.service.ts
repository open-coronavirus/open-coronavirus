import {Injectable} from "@angular/core";
import { BackgroundFetch, BackgroundFetchConfig } from '@ionic-native/background-fetch/ngx';
import {InfectedKeysProcessorService} from "./keys/infected-keys-processor.service";
import {TracingService} from "./tracing.service";

@Injectable()
export class BackgroundFetchService {

    public constructor(
        protected backgroundFetch: BackgroundFetch,
        protected tracingService: TracingService,
        protected keyMatcherService: InfectedKeysProcessorService) {

    }

    public startBackgroundFetchServices() {
        try {

            const config: BackgroundFetchConfig = {
                stopOnTerminate: true, // Set true to cease background-fetch from operating after user "closes" the app. Defaults to true.
            };
            this.backgroundFetch.configure(config).then((taskId) => {
                console.error("[BackgroundFetchService] Background fetch task starts: " + taskId);
                this.tracingService.checkNewInfectedKeys().then(() => {
                    this.backgroundFetch.finish();
                    console.error("[BackgroundFetchService] Background fetch task ends.");
                });
            })
            .catch(error => {
                console.error("[BackgroundFetchService] error trying to execute background fetch task: " + JSON.stringify(error));
            });

            this.backgroundFetch.start();

        } catch (error) {
            console.error("[BackgroundFetchService] err: ", error);
        }
    }


}
