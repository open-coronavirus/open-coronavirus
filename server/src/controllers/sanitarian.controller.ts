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
import {Sanitarian} from '../models';
import {SanitarianRepository} from '../repositories';

export class SanitarianController {
  constructor(
    @repository(SanitarianRepository)
    public sanitarianRepository : SanitarianRepository,
  ) {}

  @post('/sanitarians', {
    responses: {
      '200': {
        description: 'Sanitarian model instance',
        content: {'application/json': {schema: getModelSchemaRef(Sanitarian)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sanitarian, {
            title: 'NewSanitarian',
            exclude: ['id'],
          }),
        },
      },
    })
    sanitarian: Omit<Sanitarian, 'id'>,
  ): Promise<Sanitarian> {
    return this.sanitarianRepository.create(sanitarian);
  }

  @get('/sanitarians/count', {
    responses: {
      '200': {
        description: 'Sanitarian model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Sanitarian) where?: Where<Sanitarian>,
  ): Promise<Count> {
    return this.sanitarianRepository.count(where);
  }

  @get('/sanitarians', {
    responses: {
      '200': {
        description: 'Array of Sanitarian model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Sanitarian, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Sanitarian) filter?: Filter<Sanitarian>,
  ): Promise<Sanitarian[]> {
    return this.sanitarianRepository.find(filter);
  }

  @patch('/sanitarians', {
    responses: {
      '200': {
        description: 'Sanitarian PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sanitarian, {partial: true}),
        },
      },
    })
    sanitarian: Sanitarian,
    @param.where(Sanitarian) where?: Where<Sanitarian>,
  ): Promise<Count> {
    return this.sanitarianRepository.updateAll(sanitarian, where);
  }

  @get('/sanitarians/{id}', {
    responses: {
      '200': {
        description: 'Sanitarian model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Sanitarian, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Sanitarian, {exclude: 'where'}) filter?: FilterExcludingWhere<Sanitarian>
  ): Promise<Sanitarian> {
    return this.sanitarianRepository.findById(id, filter);
  }

  @patch('/sanitarians/{id}', {
    responses: {
      '204': {
        description: 'Sanitarian PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sanitarian, {partial: true}),
        },
      },
    })
    sanitarian: Sanitarian,
  ): Promise<void> {
    await this.sanitarianRepository.updateById(id, sanitarian);
  }

  @put('/sanitarians/{id}', {
    responses: {
      '204': {
        description: 'Sanitarian PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() sanitarian: Sanitarian,
  ): Promise<void> {
    await this.sanitarianRepository.replaceById(id, sanitarian);
  }

  @del('/sanitarians/{id}', {
    responses: {
      '204': {
        description: 'Sanitarian DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sanitarianRepository.deleteById(id);
  }
}
