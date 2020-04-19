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
import {HealthCenter} from '../models';
import {HealthCenterRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {authorize} from "@loopback/authorization";

export class HealthCenterController {
  constructor(
    @repository(HealthCenterRepository) public healthCenterRepository : HealthCenterRepository,
  ) {}

  @post('/health-centers', {
    responses: {
      '200': {
        description: 'HealthCenter model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthCenter)}},
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['write']})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthCenter, {
            title: 'NewHealthCenter',
            exclude: ['id'],
          }),
        },
      },
    })
    healthCenter: Omit<HealthCenter, 'id'>,
  ): Promise<HealthCenter> {
    return this.healthCenterRepository.create(healthCenter);
  }

  @get('/health-centers/count', {
    responses: {
      '200': {
        description: 'HealthCenter model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['read']})
  async count(
    @param.query.object('where', getWhereSchemaFor(HealthCenter)) where?: Where<HealthCenter>,
  ): Promise<Count> {
    return this.healthCenterRepository.count(where);
  }

  @get('/health-centers', {
    responses: {
      '200': {
        description: 'Array of HealthCenter model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(HealthCenter, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['read']})
  async find(
    @param.query.object('filter', getFilterSchemaFor(HealthCenter)) filter?: Filter<HealthCenter>,
  ): Promise<HealthCenter[]> {
    return this.healthCenterRepository.find(filter);
  }

  @patch('/health-centers', {
    responses: {
      '200': {
        description: 'HealthCenter PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['write']})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthCenter, {partial: true}),
        },
      },
    })
    healthCenter: HealthCenter,
    @param.query.object('where', getWhereSchemaFor(HealthCenter)) where?: Where<HealthCenter>,
  ): Promise<Count> {
    return this.healthCenterRepository.updateAll(healthCenter, where);
  }

  @get('/health-centers/{id}', {
    responses: {
      '200': {
        description: 'HealthCenter model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthCenter, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['read']})
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(HealthCenter)) filter?: Filter<HealthCenter>
  ): Promise<HealthCenter> {
    return this.healthCenterRepository.findById(id, filter);
  }

  @patch('/health-centers/{id}', {
    responses: {
      '204': {
        description: 'HealthCenter PATCH success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['write']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthCenter, {partial: true}),
        },
      },
    })
    healthCenter: HealthCenter,
  ): Promise<void> {
    await this.healthCenterRepository.updateById(id, healthCenter);
  }

  @put('/health-centers/{id}', {
    responses: {
      '204': {
        description: 'HealthCenter PUT success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['write']})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() healthCenter: HealthCenter,
  ): Promise<void> {
    await this.healthCenterRepository.replaceById(id, healthCenter);
  }

  @del('/health-centers/{id}', {
    responses: {
      '204': {
        description: 'HealthCenter DELETE success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'HealthCenter', scopes: ['write']})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.healthCenterRepository.deleteById(id);
  }
}
