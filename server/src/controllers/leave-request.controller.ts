import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { LeaveRequest } from '../models';
import { LeaveRequestRepository } from '../repositories';
import {authenticate} from "@loopback/authentication";
import {authorize} from "@loopback/authorization";

export class LeaveRequestController {
  constructor(
    @repository(LeaveRequestRepository)
    public leaveRequestRepository: LeaveRequestRepository,
  ) { }

  @post('/leave-requests', {
    responses: {
      '200': {
        description: 'LeaveRequest model instance',
        content: { 'application/json': { schema: getModelSchemaRef(LeaveRequest) } },
      },
    },
  })
  //todo securize
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LeaveRequest, {
            title: 'NewLeaveRequest',
            exclude: ['id'],
          }),
        },
      },
    })
    leaveRequest: Omit<LeaveRequest, 'id'>,
  ): Promise<LeaveRequest> {

    leaveRequest.outOfHomeTimestamp = new Date();
    leaveRequest.status = 2; //out of home
    return this.leaveRequestRepository.create(leaveRequest);
  }

  @get('/leave-requests/count', {
    responses: {
      '200': {
        description: 'LeaveRequest model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['read']})
  async count(
    @param.query.object('where', getWhereSchemaFor(LeaveRequest)) where?: Where<LeaveRequest>,
  ): Promise<Count> {
    return this.leaveRequestRepository.count(where);
  }

  @get('/leave-requests', {
    responses: {
      '200': {
        description: 'Array of LeaveRequest model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(LeaveRequest, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['read']})
  async find(
    @param.query.object('filter', getFilterSchemaFor(LeaveRequest)) filter?: Filter<LeaveRequest>,
  ): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find(filter);
  }

  @patch('/leave-requests', {
    responses: {
      '200': {
        description: 'LeaveRequest PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['write']})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LeaveRequest, { partial: true }),
        },
      },
    })
    leaveRequest: LeaveRequest,
    @param.query.object('where', getWhereSchemaFor(LeaveRequest)) where?: Where<LeaveRequest>,
  ): Promise<Count> {
    return this.leaveRequestRepository.updateAll(leaveRequest, where);
  }

  @get('/leave-requests/{id}', {
    responses: {
      '200': {
        description: 'LeaveRequest model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(LeaveRequest, { includeRelations: true }),
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['read']})
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(LeaveRequest)) filter?: Filter<LeaveRequest>
  ): Promise<LeaveRequest> {
    return this.leaveRequestRepository.findById(id, filter);
  }

  @get('/leave-requests/token/{token}', {
    responses: {
      '200': {
        description: 'LeaveRequest model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(LeaveRequest, { includeRelations: true }),
          },
        },
      },
    },
  })
  //todo securize
  async findByToken(
    @param.path.string('token') token: string,
  ): Promise<LeaveRequest | null> {
    let filter: Filter<LeaveRequest> = { "where": { "patientId": token }, order: ['outOfHomeTimestamp DESC'] };
    return this.leaveRequestRepository.findOne(filter, { strictObjectIDCoercion: true });
  }

  @get('/leave-requests/patient/{patientId}', {
    responses: {
      '200': {
        description: 'LeaveRequest model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(LeaveRequest, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['read']})
  async findAllByPatientId(
      @param.path.string('patientId') patientId: string,
  ): Promise<(LeaveRequest)[]> {
    let filter: Filter<LeaveRequest> = {"where": {"patientId":patientId}, order: ['outOfHomeTimestamp DESC']};
    return this.leaveRequestRepository.find(filter, {strictObjectIDCoercion: true});
  }

  @put('/leave-requests/token/{token}/set-at-home', {
    responses: {
      '204': {
        description: 'Set in home',
      },
    },
  })
  //todo securize
  async setAtHome(
    @param.path.string('token') token: string
  ): Promise<void> {

    let filter: Filter<LeaveRequest> = { "where": { "patientId": token }, order: ['outOfHomeTimestamp DESC'] };
    await this.leaveRequestRepository.findOne(filter, { strictObjectIDCoercion: true })
      .then(leaveRequest => {
        if (leaveRequest) {
          leaveRequest.backToHomeTimestamp = new Date();
          leaveRequest.status = 1;
          this.leaveRequestRepository.save(leaveRequest);
        }
      });

  }

  @put('/leave-requests/token/{token}/set-out-home', {
    responses: {
      '204': {
        description: 'Set out of home',
      },
    },
  })
  //todo securize
  async setOutOfHome(
    @param.path.string('token') token: string
  ): Promise<void> {

    let filter: Filter<LeaveRequest> = { "where": { "patientId": token }, order: ['outOfHomeTimestamp DESC'] };
    await this.leaveRequestRepository.findOne(filter, { strictObjectIDCoercion: true })
      .then(leaveRequest => {
        if (leaveRequest) {
          leaveRequest.backToHomeTimestamp = new Date();
          leaveRequest.status = 2;
          this.leaveRequestRepository.save(leaveRequest);
        }
      });

  }

  @patch('/leave-requests/{id}', {
    responses: {
      '204': {
        description: 'LeaveRequest PATCH success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['write']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LeaveRequest, { partial: true }),
        },
      },
    })
    leaveRequest: LeaveRequest,
  ): Promise<void> {
    await this.leaveRequestRepository.updateById(id, leaveRequest);
  }

  @put('/leave-requests/{id}', {
    responses: {
      '204': {
        description: 'LeaveRequest PUT success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['write']})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() leaveRequest: LeaveRequest,
  ): Promise<void> {
    await this.leaveRequestRepository.replaceById(id, leaveRequest);
  }

  @del('/leave-requests/{id}', {
    responses: {
      '204': {
        description: 'LeaveRequest DELETE success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['write']})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.leaveRequestRepository.deleteById(id);
  }

  @get('/patients/{id}/leaveRequests', {
    responses: {
      '200': {
        description: 'Get leave requests by patient',
        content: {
          'application/json': {
            schema: getModelSchemaRef(LeaveRequest, { includeRelations: true }),
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'LeaveRequest', scopes: ['read']})
  async getLeaveRequestsByPatientId(
    @param.path.string('id') id: string,
  ): Promise<LeaveRequest[]> {

    let filter = {
      where: {
        "patientId": id
      },
      order: ['outOfHomeTimestamp DESC']
    };

    return this.leaveRequestRepository.find(filter, { strictObjectIDCoercion: true });
  }
}
