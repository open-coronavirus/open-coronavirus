import {Patient} from "../models";
import {ValidationResult} from "./validation-result";


export interface UserValidatorService {

    /**
     * Determine the kind of appointment based on the answers and the patient.
     * Possible results: AppointmentType.AT_HEALTH_CENTER or AppointmentType.AT_HOME
     *
     * @param answers
     * @param patientId
     */
    validateUser(patient: Patient): Promise<ValidationResult>;


}
