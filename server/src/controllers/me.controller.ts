import {get, param, post} from '@loopback/rest';
import {TestAppointment} from '../models';
import {service} from '@loopback/core';
import {GetPatientLeaveRequests} from '../application/query/patient/GetPatientLeaveRequests';
import {PatientLeaveRequestViewModel} from '../application/query/patient/PatientLeaveRequestViewModel';
import {AppointmentService} from '../services/appointment.service';

const BAD_REQUEST = 400;

export class MeController {
  constructor(
    @service('GetPatientLeaveRequests')
    private getPatientLeaveRequestsQuery: GetPatientLeaveRequests,
    @service('AppointmentService')
    private appointmentService: AppointmentService,
  ) {}

  @get('/me/leave-requests')
  public async getPatientLeaveRequests(
    @param.header.string('X-User-Id') patientId: string,
  ): Promise<PatientLeaveRequestViewModel[]> {
    // TODO: patient ID  should be gotten from JWT token or session or whatever
    if (!patientId) {
      this.throwError('No patient id provided', BAD_REQUEST);
    }

    const leaveRequests = await this.getPatientLeaveRequestsQuery.apply(
      patientId,
    );

    return leaveRequests;
  }

  @post('/me/appointments')
  public createAppointment(
    @param.header.string('X-User-Id') patientId: string,
  ): Promise<TestAppointment> {
    // TODO: patient ID  should be gotten from JWT token or session or whatever
    return this.appointmentService.createAppointment({
      patientId: patientId || null,
    });
  }

  private throwError(message: string, code: number): void {
    const error = new Error(message);
    (<any>error).status = code;
    throw error;
  }
}
