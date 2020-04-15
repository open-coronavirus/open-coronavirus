import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  put,
  requestBody,
} from '@loopback/rest';
import { MinVersion } from '../models';
import { MinVersionRepository } from '../repositories';

export class MinVersionController {
  constructor(
    @repository(MinVersionRepository)
    public minVersionRepository: MinVersionRepository,
  ) { }

  @get('/min-version', {
    responses: {
      '200': {
        description: 'Get MinVersion',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MinVersion, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(): Promise<MinVersion | void> {
    return this.minVersionRepository.findOne().then(minVersion => {
      if (minVersion !== null) {
        return minVersion;
      } else {
        let newMinVersion: MinVersion = new MinVersion();
        newMinVersion.minVersion = '1.0.0';

        this.minVersionRepository.create(newMinVersion);

        return newMinVersion;
      }
    });
  }

  @put('/min-version/', {
    responses: {
      '204': {
        description: 'MinVersion PUT success',
      },
    },
  })
  async replaceById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MinVersion, {
            title: 'UpdateMinVersion',
            exclude: ['id'],
          }),
        },
      },
    })
    newMinVersion: Omit<MinVersion, 'id'>,
  ): Promise<void> {
    this.minVersionRepository.findOne().then(oldMinVersion => {
      console.log('hola');
      if (oldMinVersion !== null) {
        console.log('ewq');
        oldMinVersion.minVersion = newMinVersion.minVersion;
        this.minVersionRepository.update(oldMinVersion);
      } else {
        console.log('asdf');
        this.minVersionRepository.create(newMinVersion);
      }
    });
  }
}
