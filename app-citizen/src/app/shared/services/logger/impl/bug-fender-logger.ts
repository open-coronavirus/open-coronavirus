import {Logger} from "../logger";
import {Bugfender} from "@bugfender/sdk";
import {PatientService} from "../../patient.service";

export class BugFenderLogger implements Logger {

    constructor(protected settings,
                protected patientService: PatientService) {

        Bugfender.init({
            appKey: settings.bugFenderAPPKey,
            version: settings.appVersion
        }).then(() => {
            this.patientService.patientLoaded$.subscribe(loaded => {
                if(loaded) {
                    Bugfender.setDeviceKey('patient_dni', this.patientService.patient.documentNumber);
                }
            });
        });

    }

    public trace(message) {
        Bugfender.trace(message);
    }

    public info(message) {
        Bugfender.info(message);
    }

    public log(message) {
        Bugfender.log(message);
    }

    public debug(message) {
        Bugfender.log(message);
    }

    public error(message) {
        Bugfender.error(message);
    }

    public warn(message) {
        Bugfender.warn(message);
    }

}
