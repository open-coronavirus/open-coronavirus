import {Logger} from "../logger";

export class ConsoleLogger implements Logger {

    public trace(message) {
        console.trace(message);
    }

    public info(message) {
        console.info(message);
    }

    public log(message) {
        console.log(message);
    }

    public debug(message) {
        console.log(message);
    }

    public error(message) {
        console.error(message);
    }

    public warn(message) {
        console.warn(message);
    }

}
