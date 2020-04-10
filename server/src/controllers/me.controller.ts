import {service} from '@loopback/core';
import {get, param, post, getModelSchemaRef} from '@loopback/rest';

import {TestAppointment} from '../models';
import {LeaveRequest} from '../models';
import {AppointmentService} from '../services/appointment.service';
import {LeaveRequestService} from '../services/leave-request.service';

const BAD_REQUEST = 400;

/**
 * This controller contains all services the users call regarding information that belongs to them, like
 * get[MY]LeaveRequests, get[MY]TestResults, and so on...
 */
export class MeController {
  constructor(
    @service('AppointmentService')
    private appointmentService: AppointmentService,
    @service(LeaveRequestService)
    protected leaveRequestService: LeaveRequestService,
  ) {}

  @get('/me/leave-requests', {
    responses: {
      '200': {
        description: 'Array of LeaveRequest model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(LeaveRequest, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async getPatientLeaveRequests(
    @param.header.string('X-User-Id') patientId: string,
  ): Promise<LeaveRequest[]> {
    // TODO: patient ID  should be gotten from JWT token or session or whatever
    if (!patientId) {
      this.throwError('No patient id provided', BAD_REQUEST);
    }

    return this.leaveRequestService.getPatientLeaveRequests(patientId);
  }

  @post('/me/appointments', {
    responses: {
      '200': {
        description: 'TestAppointment model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestAppointment, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  public createAppointment(
    @param.header.string('X-User-Id') patientId: string,
  ): Promise<TestAppointment> {
    // TODO: patient ID  should be gotten from JWT token or session or whatever
    // TODO: catch error by type and send proper response headers
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
