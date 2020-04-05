import {GetPatientLeaveRequests} from '../../../../application/query/patient/GetPatientLeaveRequests';
import {LeaveRequestRepository} from '../../../../repositories';
import {repository, Filter} from '@loopback/repository';
import {LeaveRequest} from '../../../../models';
import {PatientLeaveRequestViewModel} from '../../../../application/query/patient/PatientLeaveRequestViewModel';

export class GetPatientLeaveRequestsLoobpack
  implements GetPatientLeaveRequests {
  constructor(
    @repository(LeaveRequestRepository)
    private leaveRequestRepository: LeaveRequestRepository,
  ) {}

  async apply(patientId: string): Promise<PatientLeaveRequestViewModel[]> {
    let filter: Filter<LeaveRequest> = {
      where: {patientId: patientId || null},
      order: ['outOfHomeTimestamp DESC'],
    };

    const leaveRequests = await this.leaveRequestRepository.find(filter, {
      strictObjectIDCoercion: true,
    });

    return leaveRequests.map(
      ({
        id,
        leaveReason,
        additionalInfo,
        outOfHomeTimestamp,
        backToHomeTimestamp,
        status,
      }) => ({
        id: <string>id,
        leaveReason,
        additionalInfo,
        outOfHomeTimestamp,
        backToHomeTimestamp,
        status,
      }),
    );
  }
}
