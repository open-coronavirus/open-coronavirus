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
import {BluetoothLeAdvertisement, Geolocation} from '../models';
import {BluetoothLeAdvertisementRepository} from '../repositories';

export class BluetoothLeAdvertisementController {
  constructor(
    @repository(BluetoothLeAdvertisementRepository)
    public bluetoothLeAdvertisementRepository : BluetoothLeAdvertisementRepository,
  ) {}

  @post('/bluetooth-le-advertisements', {
    responses: {
      '200': {
        description: 'BluetoothLeAdvertisement model instance',
        content: {'application/json': {schema: getModelSchemaRef(BluetoothLeAdvertisement)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluetoothLeAdvertisement, {
            title: 'NewBluetoothLeAdvertisement',
            exclude: ['id'],
          }),
        },
      },
    })
    bluetoothLeAdvertisement: Omit<BluetoothLeAdvertisement, 'id'>,
  ): Promise<BluetoothLeAdvertisement> {

    bluetoothLeAdvertisement.created = new Date();

    return this.bluetoothLeAdvertisementRepository.create(bluetoothLeAdvertisement);
  }

  @get('/bluetooth-le-advertisements/count', {
    responses: {
      '200': {
        description: 'BluetoothLeAdvertisement model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
      @param.query.object('where', getWhereSchemaFor(BluetoothLeAdvertisement)) where?: Where<BluetoothLeAdvertisement>,
  ): Promise<Count> {
    return this.bluetoothLeAdvertisementRepository.count(where);
  }

  @get('/bluetooth-le-advertisements', {
    responses: {
      '200': {
        description: 'Array of BluetoothLeAdvertisement model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(BluetoothLeAdvertisement, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(BluetoothLeAdvertisement)) filter?: Filter<BluetoothLeAdvertisement>,
  ): Promise<BluetoothLeAdvertisement[]> {
    return this.bluetoothLeAdvertisementRepository.find(filter);
  }

  @patch('/bluetooth-le-advertisements', {
    responses: {
      '200': {
        description: 'BluetoothLeAdvertisement PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluetoothLeAdvertisement, {partial: true}),
        },
      },
    })
    bluetoothLeAdvertisement: BluetoothLeAdvertisement,
    @param.query.object('where', getWhereSchemaFor(BluetoothLeAdvertisement)) where?: Where<BluetoothLeAdvertisement>,
  ): Promise<Count> {
    return this.bluetoothLeAdvertisementRepository.updateAll(bluetoothLeAdvertisement, where);
  }

  @get('/bluetooth-le-advertisements/{id}', {
    responses: {
      '200': {
        description: 'BluetoothLeAdvertisement model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BluetoothLeAdvertisement, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(BluetoothLeAdvertisement)) filter?: Filter<BluetoothLeAdvertisement>
  ): Promise<BluetoothLeAdvertisement> {
    return this.bluetoothLeAdvertisementRepository.findById(id, filter);
  }

  @patch('/bluetooth-le-advertisements/{id}', {
    responses: {
      '204': {
        description: 'BluetoothLeAdvertisement PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluetoothLeAdvertisement, {partial: true}),
        },
      },
    })
    bluetoothLeAdvertisement: BluetoothLeAdvertisement,
  ): Promise<void> {
    await this.bluetoothLeAdvertisementRepository.updateById(id, bluetoothLeAdvertisement);
  }

  @put('/bluetooth-le-advertisements/{id}', {
    responses: {
      '204': {
        description: 'BluetoothLeAdvertisement PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bluetoothLeAdvertisement: BluetoothLeAdvertisement,
  ): Promise<void> {
    await this.bluetoothLeAdvertisementRepository.replaceById(id, bluetoothLeAdvertisement);
  }

  @del('/bluetooth-le-advertisements/{id}', {
    responses: {
      '204': {
        description: 'BluetoothLeAdvertisement DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.bluetoothLeAdvertisementRepository.deleteById(id);
  }
}
