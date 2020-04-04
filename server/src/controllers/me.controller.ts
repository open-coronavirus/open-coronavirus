import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {get, getModelSchemaRef} from '@loopback/rest';
import {LeaveRequest} from '../models';
import {PatientRepository} from '../repositories';

export class MeController {
  constructor(
    @repository(PatientRepository)
    private patientRepository: PatientRepository,
  ) {}

  @get('/me/leave-requests', {
    responses: {
      '200': {
        description: 'Returns patient',
        content: {
          'application/json': {
            schema: getModelSchemaRef(LeaveRequest, {includeRelations: false}),
          },
        },
      },
    },
  })
  async getPatientLeaveRequests(): Promise<LeaveRequest[]> {
    // TODO: this should be get from JWT token or session
    const patientId = '5e88a64aae35be2a1faca20f';

    const patient = await this.patientRepository.ofId(patientId);
    return patient?.leaveRequests || [];
  }
}
