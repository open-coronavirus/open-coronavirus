import {Patient} from "../models";


export class ValidationResult {

    public isValid: boolean;

    public message: string;

    public patient: Patient;

}
