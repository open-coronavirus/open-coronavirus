import {TestResult} from "../models";


export interface AppointmentService {

    /**
     * Determine the kind of appointment based on the answers and the patient.
     * Possible results: AppointmentType.AT_HEALTH_CENTER or AppointmentType.AT_HOME
     *
     * @param answers
     * @param patientId
     */
    getAppointmentType(answers: object[], patientId: string): Promise<number>;

    /**
     * Determine the date for the appointment at health center
     *
     * @param healthCenterId
     * @param patientId
     */
    getAppointmentDateAtHealthCenter(healthCenterId: string, patientId: string): Promise<Date>;

    /**
     * Determine the date for the appointment at home
     *
     * @param healthCenterId
     * @param patientId
     */
    getAppointmentDateAtHome(patientId: string): Promise<Date>;

}
