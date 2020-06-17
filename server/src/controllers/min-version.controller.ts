import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  put,
  requestBody,
  param,
} from '@loopback/rest';
import { MinVersion } from '../models';
import { MinVersionRepository } from '../repositories';
import { MinVersionService } from "../services/min-version.service";
import { service } from '@loopback/core';
import {authenticate} from "@loopback/authentication";
import {authorize} from "@loopback/authorization";

export class MinVersionController {
  constructor(
    @repository(MinVersionRepository) public minVersionRepository: MinVersionRepository,
    @service(MinVersionService) public minVersionService: MinVersionService
  ) { }

  @get('/min-version/{frontVersion}/update_needed', {
    responses: {
      '200': {
        description: 'CheckUpdateNeeded',
        content: {
          'application/json': {
            schema: {
              type: 'boolean'
            }
          },
        },
      },
    },
  })
  async updateNeeded(
    @param.path.string('frontVersion') frontVersion: string,
  ): Promise<boolean> {
    return this.minVersionService.checkNeededUpdate(frontVersion);
  }

  @get('/min-version', {
    responses: {
      '200': {
        description: 'Get MinVersion',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MinVersion, {
              title: 'GetMinVersion'
            }),
          },
        },
      },
    },
  })
  async find(): Promise<MinVersion> {
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
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'MinVersion', scopes: ['write']})
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
