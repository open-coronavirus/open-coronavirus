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
import {Geolocation} from '../models';
import {GeolocationRepository} from '../repositories';

export class GeolocationController {
  constructor(
    @repository(GeolocationRepository)
    public geolocationRepository : GeolocationRepository,
  ) {}

  @post('/geolocations', {
    responses: {
      '200': {
        description: 'Geolocation model instance',
        content: {'application/json': {schema: getModelSchemaRef(Geolocation)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Geolocation, {
            title: 'NewGeolocation',
            
          }),
        },
      },
    })
    geolocation: Geolocation,
  ): Promise<Geolocation> {

    geolocation.created = new Date();
    return this.geolocationRepository.create(geolocation);

  }

  @get('/geolocations/count', {
    responses: {
      '200': {
        description: 'Geolocation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Geolocation)) where?: Where<Geolocation>,
  ): Promise<Count> {
    return this.geolocationRepository.count(where);
  }

  @get('/geolocations', {
    responses: {
      '200': {
        description: 'Array of Geolocation model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Geolocation, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Geolocation)) filter?: Filter<Geolocation>,
  ): Promise<Geolocation[]> {
    return this.geolocationRepository.find(filter);
  }

  @patch('/geolocations', {
    responses: {
      '200': {
        description: 'Geolocation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Geolocation, {partial: true}),
        },
      },
    })
    geolocation: Geolocation,
    @param.query.object('where', getWhereSchemaFor(Geolocation)) where?: Where<Geolocation>,
  ): Promise<Count> {
    return this.geolocationRepository.updateAll(geolocation, where);
  }

  @get('/geolocations/{id}', {
    responses: {
      '200': {
        description: 'Geolocation model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Geolocation, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Geolocation)) filter?: Filter<Geolocation>
  ): Promise<Geolocation> {
    return this.geolocationRepository.findById(id, filter);
  }

  @patch('/geolocations/{id}', {
    responses: {
      '204': {
        description: 'Geolocation PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Geolocation, {partial: true}),
        },
      },
    })
    geolocation: Geolocation,
  ): Promise<void> {
    await this.geolocationRepository.updateById(id, geolocation);
  }

  @put('/geolocations/{id}', {
    responses: {
      '204': {
        description: 'Geolocation PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() geolocation: Geolocation,
  ): Promise<void> {
    await this.geolocationRepository.replaceById(id, geolocation);
  }

  @del('/geolocations/{id}', {
    responses: {
      '204': {
        description: 'Geolocation DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.geolocationRepository.deleteById(id);
  }
}
