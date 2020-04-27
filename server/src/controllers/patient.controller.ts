import { Count, CountSchema, Filter, repository, Where, } from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';

import { Patient } from '../models';
import { PatientRepository } from '../repositories';
import { BluetoothUuidGenerator } from "../common/utils/bluetooth-uuid-generator";
import { authenticate } from "@loopback/authentication";
import { authorize } from "@loopback/authorization";
import {service} from "@loopback/core";
import {PushNotificationService} from "../services/pushnotification.service";
import {PatientStatus} from "../common/utils/enums";
import {PatientService} from "../services/patient.service";
import {UserValidatorService} from "../services/user-validator.service";

export class PatientController {
  constructor(
      @repository(PatientRepository) public patientRepository: PatientRepository,
      @service(PatientService) public patientService: PatientService,
      @service('UserValidatorService') public userValidatorService: UserValidatorService,
      @service(PushNotificationService) public pushNotificationService: PushNotificationService,
  ) { }

  @post('/patients', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Patient) } },
      },
    },
  })
  //todo securize
  async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Patient, {
              title: 'NewPatient',
              exclude: ['id'],
            }),
          },
        },
      })
          patient: Omit<Patient, 'id'>,
  ): Promise<Patient | null> {

    let returnValue: Promise<Patient | null> = new Promise(resolve => {

      //generate an unique uuid for each patient
      patient.serviceAdvertisementUUID = BluetoothUuidGenerator.generateUUID();
      patient.status = PatientStatus.UNKNOWN; //initial status
      patient.created = new Date();

      this.userValidatorService.validateUser(<Patient>patient).then(validationResult => {
        if(validationResult.isValid) {
          this.patientRepository.create(patient).then(createdPatient => {
            resolve(createdPatient);
          });
        }
        else {
          let error = new HttpErrors[401]; //unauthorized
          error.message = validationResult.message;
          throw error;
        }
      });

    });

    return returnValue;

  }

  @get('/patients/count', {
    responses: {
      '200': {
        description: 'Patient model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['read'] })
  async count(
      @param.query.object('where', getWhereSchemaFor(Patient)) where?: Where<Patient>,
  ): Promise<Count> {
    return this.patientRepository.count(where);
  }

  @get('/patients', {
    responses: {
      '200': {
        description: 'Array of Patient model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Patient, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['read'] })
  async find(
      @param.query.object('filter', getFilterSchemaFor(Patient)) filter?: Filter<Patient>,
  ): Promise<Patient[]> {
    return this.patientRepository.find(filter);
  }

  @patch('/patients', {
    responses: {
      '200': {
        description: 'Patient PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['write'] })
  async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Patient, { partial: true }),
          },
        },
      })
          patient: Patient,
      @param.query.object('where', getWhereSchemaFor(Patient)) where?: Where<Patient>,
  ): Promise<Count> {
    return this.patientRepository.updateAll(patient, where);
  }

  @get('/patients/scan/{qrcode}', {
    responses: {
      '200': {
        description: 'Get patient by qr-code scan',
      },
      '404': {
        description: 'Patient not found',
      }
    },
  })
  //todo securize
  /*@authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['read'] })*/
  async getByQrCode(
      @param.path.string('qrcode') qrcode: string,
  ): Promise<Patient> {
    return await this.patientRepository.findById(qrcode).then(patient => {
      if (patient != null) {
        return patient;
      } else {
        throw new HttpErrors[404];
      }
    });
  }

  @get('/patients/{id}', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Patient, { includeRelations: true }),
          },
        },
      },
    },
  })
  //todo securize
  async findById(
      @param.path.string('id') id: string,
      @param.query.object('filter', getFilterSchemaFor(Patient)) filter?: Filter<Patient>
  ): Promise<Patient> {

    let returnValue: Promise<Patient> = new Promise(resolve => {
      this.patientRepository.findById(id, filter).then(patient => {
        if (patient.serviceAdvertisementUUID == null) {
          patient.serviceAdvertisementUUID = BluetoothUuidGenerator.generateUUID();
        }
        resolve(patient);
      })
    });

    return returnValue;
  }

  @patch('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient PATCH success',
      },
    },
  })
  //todo securize
  async updateById(
      @param.path.string('id') id: string,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Patient, { partial: true }),
          },
        },
      })
          patient: Patient,
  ): Promise<void> {
    await this.patientRepository.updateById(id, patient);
  }

  @post('/patients/{id}/status', {
    responses: {
      '204': {
        description: 'Update patient status success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['write'] })
  async updateStatus(
      @param.path.string('id') id: string,
      @requestBody() status: number,
  ): Promise<void> {

    await this.patientRepository.findById(id).then(patient => {
      if (patient != null) {
        patient.status = status;
        this.patientRepository.replaceById(id, patient);
      }
    });

  }

  @put('/patients/status', {
    responses: {
      '200': {
        description: 'Update patient status success',
      },
      '404': {
        description: 'Patient not found',
      }
    },
  })
  async updateStatusByDocumentNumber(
      @param.header.string('apikey') apiKey: string,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                documentNumber: { type: 'string' },
                status: { type: 'number' },
                date: { type: 'string' }
              },
              required: ['documentNumber', 'status']
            }
          }
        },
      }) body: any,
  ): Promise<Patient | null> {

    if(apiKey != "test") {
      console.log("Wrong API key used: " + apiKey);
      throw new HttpErrors[401]; //unauthorized
    }

    return this.patientService.changeStatus(body.documentNumber, body.status, body.date);

  }

  @put('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient PUT success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['write'] })
  async replaceById(
      @param.path.string('id') id: string,
      @requestBody() patient: Patient,
  ): Promise<void> {
    await this.patientRepository.replaceById(id, patient);
  }

  @del('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient DELETE success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'Patient', scopes: ['write'] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.patientRepository.deleteById(id);
  }
}
