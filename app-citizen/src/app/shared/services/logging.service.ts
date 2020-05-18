import {Inject, Injectable} from "@angular/core";
import {Logger} from "./logger/logger";
import {ConsoleLogger} from "./logger/impl/console-logger";
import {BugFenderLogger} from "./logger/impl/bug-fender-logger";
import {PatientService} from "./patient.service";

@Injectable()
export class LoggingService {

    protected logger: Logger = null;

    constructor(@Inject('settings') protected settings,
                protected patientService: PatientService) {
        switch(this.settings.logger) {
            case 'bugfender':
                this.logger = new BugFenderLogger(this.settings, patientService);
                break;
            case 'console':
            default:
                this.logger = new ConsoleLogger();
                break;
        }
    }

    public trace(message) {
        this.logger.trace(message);
    }

    public info(message) {
        this.logger.info(message);
    }

    public log(message) {
        this.logger.log(message);
    }

    public debug(message) {
        this.logger.debug(message);
    }

    public error(message) {
        this.logger.error(message);
    }

    public warn(message) {
        this.logger.warn(message);
    }

}
