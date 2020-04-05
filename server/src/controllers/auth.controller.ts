// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
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

import { PoliceOfficer } from '../models';
import { PoliceOfficerRepository } from '../repositories';

import { Sanitarian } from '../models';
import { SanitarianRepository } from '../repositories';

import { Auth } from '../models';
import { AuthService } from '../services';
import { service } from '@loopback/core';

export class AuthController {
  constructor(
    @service('AuthService') protected authService: AuthService,
    @repository(PoliceOfficerRepository) public policeOfficerRepository: PoliceOfficerRepository,
    @repository(SanitarianRepository) public sanitarianRepository: SanitarianRepository,
  ) { }

  @post('/auth/police-officers', {
    responses: {
      '200': {
        description: 'Police officer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PoliceOfficer, { includeRelations: true }),
          },
        },
      },
    },
  })
  async policeOfficerLogin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Auth, {
            title: 'PoliceOfficerLogin'
          }),
        },
      },
    })
    auth: Auth,
  ): Promise<PoliceOfficer | null> {
    let returnValue: Promise<PoliceOfficer | null> = new Promise(resolve => {
      resolve(this.authService.postPoliceOfficerLogin(auth));
    })

    return returnValue;
  }

  @post('/auth/sanitarians', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Sanitarian, { includeRelations: true }),
          },
        },
      },
    },
  })
  async sanitarianLogin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Auth, {
            title: 'SanitarianLogin'
          }),
        },
      },
    })
    auth: Auth,
  ): Promise<Sanitarian | null> {
    let returnValue: Promise<Sanitarian | null> = new Promise(resolve => {
      resolve(this.authService.postSanitarianLogin(auth));
    })

    return returnValue;
  }
}
