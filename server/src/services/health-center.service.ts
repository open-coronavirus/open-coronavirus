import {HealthCenter} from "../models";


export interface HealthCenterService {

    getPatientHealthCenter(patientId: string): Promise<HealthCenter | null>;

}
