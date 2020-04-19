import {UserValidatorService} from "../user-validator.service";
import {Patient} from "../../models";
import {ValidationResult} from "../validation-result";


export class UserValidationMockService implements UserValidatorService {

    validateUser(patient: Patient): Promise<ValidationResult> {

        let returnValue: Promise<ValidationResult> = new Promise(resolve => {

            let validationResult = new ValidationResult();
            validationResult.isValid = true;

            resolve(validationResult);

        });

        return returnValue;
    }



}
