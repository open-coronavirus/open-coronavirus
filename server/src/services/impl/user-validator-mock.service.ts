import {UserValidatorService} from "../user-validator.service";
import {Patient} from "../../models";
import {ValidationResult} from "../validation-result";


export class UserValidatorMockService implements UserValidatorService {

    validateUser(patient: Patient): Promise<ValidationResult> {

        let returnValue: Promise<ValidationResult> = new Promise(resolve => {

            let validationResult = new ValidationResult();
            validationResult.isValid = true;
            validationResult.patient = patient;

            resolve(validationResult);

        });

        return returnValue;
    }



}
