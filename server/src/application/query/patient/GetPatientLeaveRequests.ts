import {PatientLeaveRequestViewModel} from './PatientLeaveRequestViewModel';

export interface GetPatientLeaveRequests {
  apply(patientId: string): Promise<PatientLeaveRequestViewModel[]>;
}
