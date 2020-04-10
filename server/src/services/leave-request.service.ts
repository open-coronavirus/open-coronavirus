import {Filter, repository} from "@loopback/repository";
import {LeaveRequestRepository} from "../repositories";
import {LeaveRequest} from "../models";


export class LeaveRequestService {

    constructor(
        @repository(LeaveRequestRepository)
        public leaveRequestRepository : LeaveRequestRepository,
    ) {}
    public getPatientLeaveRequests(patientId: string): Promise<LeaveRequest[]> {
        let filter: Filter<LeaveRequest> = {"where": {"patientId":patientId}, order: ['outOfHomeTimestamp DESC']};
        return this.leaveRequestRepository.find(filter, {strictObjectIDCoercion: true});
    }

}
