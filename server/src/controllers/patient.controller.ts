import {Count, CountSchema, Filter, repository, Where,} from '@loopback/repository';
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

import {Patient} from '../models';
import {PatientRepository} from '../repositories';
import {BluetoothUuidGenerator} from "../common/utils/bluetooth-uuid-generator";

export class PatientController {
  constructor(
    @repository(PatientRepository)
    public patientRepository: PatientRepository,
  ) { }

  @post('/patients', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Patient) } },
      },
    },
  })
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

      this.patientRepository.count({documentNumber: {eq: patient.documentNumber}}).then(result => {
        //create the new patient just in case there is no other with same NIF within database
        if (result.count == 0) {
          //generate an unique uuid for each patient
          patient.serviceAdvertisementUUID = BluetoothUuidGenerator.generateUUID();
          patient.created = new Date();

          this.patientRepository.create(patient).then(createdPatient => {
            resolve(createdPatient);
          })
        }
        else {
          resolve(null);
        }

      })
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
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Patient)) filter?: Filter<Patient>
  ): Promise<Patient> {

    let returnValue: Promise<Patient> = new Promise(resolve => {
      this.patientRepository.findById(id, filter).then(patient => {
        if(patient.serviceAdvertisementUUID == null) {
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
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              documentNumber: { type: 'string' },
              status: { type: 'number' }
            },
            required: ['documentNumber', 'status']
          }
        }
      },
    })
    body: any,
  ): Promise<Patient | null> {
    let filter = {
      "where": {
        "documentNumber": body.documentNumber
      }
    };

    return await this.patientRepository.findOne(filter).then(patient => {
      if (patient != null) {
        patient.status = body.status;
        this.patientRepository.update(patient);
        return patient;
      } else {
        throw new HttpErrors[404];
      }
    });

  }

  @put('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient PUT success',
      },
    },
  })
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
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.patientRepository.deleteById(id);
  }
}
