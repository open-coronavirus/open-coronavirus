import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
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
import {PoliceOfficer} from '../models';
import {PoliceOfficerRepository} from '../repositories';

export class PoliceOfficerController {
  constructor(
    @repository(PoliceOfficerRepository)
    public policeOfficerRepository : PoliceOfficerRepository,
  ) {}

  @post('/police-officers', {
    responses: {
      '200': {
        description: 'PoliceOfficer model instance',
        content: {'application/json': {schema: getModelSchemaRef(PoliceOfficer)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PoliceOfficer, {
            title: 'NewPoliceOfficer',
            exclude: ['id'],
          }),
        },
      },
    })
    policeOfficer: Omit<PoliceOfficer, 'id'>,
  ): Promise<PoliceOfficer> {
    return this.policeOfficerRepository.create(policeOfficer);
  }

  @get('/police-officers/count', {
    responses: {
      '200': {
        description: 'PoliceOfficer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(PoliceOfficer) where?: Where<PoliceOfficer>,
  ): Promise<Count> {
    return this.policeOfficerRepository.count(where);
  }

  @get('/police-officers', {
    responses: {
      '200': {
        description: 'Array of PoliceOfficer model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PoliceOfficer, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PoliceOfficer) filter?: Filter<PoliceOfficer>,
  ): Promise<PoliceOfficer[]> {
    return this.policeOfficerRepository.find(filter);
  }

  @patch('/police-officers', {
    responses: {
      '200': {
        description: 'PoliceOfficer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PoliceOfficer, {partial: true}),
        },
      },
    })
    policeOfficer: PoliceOfficer,
    @param.where(PoliceOfficer) where?: Where<PoliceOfficer>,
  ): Promise<Count> {
    return this.policeOfficerRepository.updateAll(policeOfficer, where);
  }

  @get('/police-officers/{id}', {
    responses: {
      '200': {
        description: 'PoliceOfficer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PoliceOfficer, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PoliceOfficer, {exclude: 'where'}) filter?: FilterExcludingWhere<PoliceOfficer>
  ): Promise<PoliceOfficer> {
    return this.policeOfficerRepository.findById(id, filter);
  }

  @patch('/police-officers/{id}', {
    responses: {
      '204': {
        description: 'PoliceOfficer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PoliceOfficer, {partial: true}),
        },
      },
    })
    policeOfficer: PoliceOfficer,
  ): Promise<void> {
    await this.policeOfficerRepository.updateById(id, policeOfficer);
  }

  @put('/police-officers/{id}', {
    responses: {
      '204': {
        description: 'PoliceOfficer PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() policeOfficer: PoliceOfficer,
  ): Promise<void> {
    await this.policeOfficerRepository.replaceById(id, policeOfficer);
  }

  @del('/police-officers/{id}', {
    responses: {
      '204': {
        description: 'PoliceOfficer DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.policeOfficerRepository.deleteById(id);
  }
}
