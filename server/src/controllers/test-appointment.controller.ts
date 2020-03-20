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
import {TestAppointment} from '../models';
import {TestAppointmentRepository} from '../repositories';

export class TestAppointmentController {
  constructor(
    @repository(TestAppointmentRepository)
    public testAppointmentRepository : TestAppointmentRepository,
  ) {}

  @post('/test-appointments', {
    responses: {
      '200': {
        description: 'TestAppointment model instance',
        content: {'application/json': {schema: getModelSchemaRef(TestAppointment)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestAppointment, {
            title: 'NewTestAppointment',
            exclude: ['id'],
          }),
        },
      },
    })
    testAppointment: Omit<TestAppointment, 'id'>,
  ): Promise<TestAppointment> {
    return this.testAppointmentRepository.create(testAppointment);
  }

  @get('/test-appointments/count', {
    responses: {
      '200': {
        description: 'TestAppointment model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TestAppointment)) where?: Where<TestAppointment>,
  ): Promise<Count> {
    return this.testAppointmentRepository.count(where);
  }

  @get('/test-appointments', {
    responses: {
      '200': {
        description: 'Array of TestAppointment model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TestAppointment, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TestAppointment)) filter?: Filter<TestAppointment>,
  ): Promise<TestAppointment[]> {
    return this.testAppointmentRepository.find(filter);
  }

  @patch('/test-appointments', {
    responses: {
      '200': {
        description: 'TestAppointment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestAppointment, {partial: true}),
        },
      },
    })
    testAppointment: TestAppointment,
    @param.query.object('where', getWhereSchemaFor(TestAppointment)) where?: Where<TestAppointment>,
  ): Promise<Count> {
    return this.testAppointmentRepository.updateAll(testAppointment, where);
  }

  @get('/test-appointments/{id}', {
    responses: {
      '200': {
        description: 'TestAppointment model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestAppointment, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TestAppointment)) filter?: Filter<TestAppointment>
  ): Promise<TestAppointment> {
    return this.testAppointmentRepository.findById(id, filter);
  }

  @patch('/test-appointments/{id}', {
    responses: {
      '204': {
        description: 'TestAppointment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestAppointment, {partial: true}),
        },
      },
    })
    testAppointment: TestAppointment,
  ): Promise<void> {
    await this.testAppointmentRepository.updateById(id, testAppointment);
  }

  @put('/test-appointments/{id}', {
    responses: {
      '204': {
        description: 'TestAppointment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() testAppointment: TestAppointment,
  ): Promise<void> {
    await this.testAppointmentRepository.replaceById(id, testAppointment);
  }

  @del('/test-appointments/{id}', {
    responses: {
      '204': {
        description: 'TestAppointment DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.testAppointmentRepository.deleteById(id);
  }
}
