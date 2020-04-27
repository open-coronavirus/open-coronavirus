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
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Contact, InfectionExposure} from '../models';
import {ContactRepository, InfectionExposureRepository} from '../repositories';
import {service} from "@loopback/core";
import {PatientService} from "../services/patient.service";

const schemaWithArrayOfInfectionExposures = {
  type: 'array',
  items: {
    'x-ts-type': InfectionExposure,
  },
};

export class InfectionExposureController {
  constructor(
    @service(PatientService) public patientService: PatientService,
    @repository(InfectionExposureRepository) public infectionExposureRepository : InfectionExposureRepository,
  ) {}

  @post('/infection-exposures', {
    responses: {
      '200': {
        description: 'InfectionExposure model instance',
        content: {'application/json': {schema: getModelSchemaRef(InfectionExposure)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InfectionExposure, {
            title: 'NewInfectionExposure',
            exclude: ['id'],
          }),
        },
      },
    })
    infectionExposure: Omit<InfectionExposure, 'id'>,
  ): Promise<InfectionExposure> {
    return this.infectionExposureRepository.create(infectionExposure);
  }

  @post('/infection-exposures/bulk', {
    responses: {
      '200': {
        description: 'Infection exposure PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  //unsecure!!!
  async createAll(
      @requestBody({
        content: {
          'application/json': {
            schema: schemaWithArrayOfInfectionExposures
          },
        },
      })
      infectionExposures: InfectionExposure[],
  ): Promise<void> {
    return new Promise(resolve => {
      console.log("Received " + infectionExposures.length + " infection exposures to save to ...");
      this.infectionExposureRepository.createAll(infectionExposures);
      console.log("Added " + infectionExposures.length + " infection exposures ...");
      //also put in quarantine all of them
      this.patientService.decideToPutInQuarantine(infectionExposures);
      console.log("Put " + infectionExposures.length + " infection exposures in quarantine ...");
      resolve();
    });

  }

  @get('/infection-exposures/count', {
    responses: {
      '200': {
        description: 'InfectionExposure model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(InfectionExposure) where?: Where<InfectionExposure>,
  ): Promise<Count> {
    return this.infectionExposureRepository.count(where);
  }

  @get('/infection-exposures', {
    responses: {
      '200': {
        description: 'Array of InfectionExposure model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InfectionExposure, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(InfectionExposure) filter?: Filter<InfectionExposure>,
  ): Promise<InfectionExposure[]> {
    return this.infectionExposureRepository.find(filter);
  }

  @patch('/infection-exposures', {
    responses: {
      '200': {
        description: 'InfectionExposure PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InfectionExposure, {partial: true}),
        },
      },
    })
    infectionExposure: InfectionExposure,
    @param.where(InfectionExposure) where?: Where<InfectionExposure>,
  ): Promise<Count> {
    return this.infectionExposureRepository.updateAll(infectionExposure, where);
  }

  @get('/infection-exposures/{id}', {
    responses: {
      '200': {
        description: 'InfectionExposure model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InfectionExposure, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(InfectionExposure, {exclude: 'where'}) filter?: FilterExcludingWhere<InfectionExposure>
  ): Promise<InfectionExposure> {
    return this.infectionExposureRepository.findById(id, filter);
  }

  @patch('/infection-exposures/{id}', {
    responses: {
      '204': {
        description: 'InfectionExposure PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InfectionExposure, {partial: true}),
        },
      },
    })
    infectionExposure: InfectionExposure,
  ): Promise<void> {
    await this.infectionExposureRepository.updateById(id, infectionExposure);
  }

  @put('/infection-exposures/{id}', {
    responses: {
      '204': {
        description: 'InfectionExposure PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() infectionExposure: InfectionExposure,
  ): Promise<void> {
    await this.infectionExposureRepository.replaceById(id, infectionExposure);
  }

  @del('/infection-exposures/{id}', {
    responses: {
      '204': {
        description: 'InfectionExposure DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.infectionExposureRepository.deleteById(id);
  }
}
