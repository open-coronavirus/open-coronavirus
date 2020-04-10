import {get, getModelSchemaRef, param} from '@loopback/rest';
import {LeaveRequest} from '../models';
import {service} from '@loopback/core';
import {LeaveRequestService} from "../services/leave-request.service";

const BAD_REQUEST = 400;

/**
 * This controller contains all services the users call regarding information that belongs to them, like
 * get[MY]LeaveRequests, get[MY]TestResults, and so on...
 *
 *
 */
export class MeController {
  constructor(
    @service( 'LeaveRequestService') protected leaveRequestService: LeaveRequestService
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

  private throwError(message: string, code: number): void {
    const error = new Error(message);
    (<any>error).status = code;
    throw error;
  }
}
