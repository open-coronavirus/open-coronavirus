
import { Entity, model, property, hasMany } from '@loopback/repository';
import { LeaveRequest } from './leave-request.model';

@model({ settings: { strict: false } })
export class Patient extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: false,
  })
  firstName?: string;

  @property({
    type: 'string',
    required: false,
  })
  lastName?: string;

  @property({
    type: 'string',
    required: false,
  })
  documentNumber?: string;

  @property({
    type: 'string',
    required: false,
  })
  healthInsuranceCardNumber?: string;

  @property({
    type: 'date',
    required: false,
  })
  birthday?: Date;

  @property({
    type: 'number',
    required: false,
  })
  age?: number;

  @property({
    type: 'number',
    required: false,
  })
  gender?: number;

  @property({
    type: 'string',
    required: false,
  })
  street?: string;

  @property({
    type: 'string',
    required: false,
  })
  apartment?: string;

  @property({
    type: 'string',
    required: false,
  })
  postalCode?: string;

  @property({
    type: 'string',
    required: false,
  })
  email?: string;

  /**
   * 1: INITIAL
   * 2: UNINFECTED
   * 3: RESTRICTED
   * 4: INFECTED
   */
  @property({
    type: 'number',
    required: false,
    default: 0
  })
  status?: number;

  @property({
    type: 'date',
    required: false,
  })
  statusDate?: Date;

  @property({
    type: 'string',
    required: false,
  })
  phone?: string;

  @property({
    type: 'string',
    required: false,
  })
  serviceAdvertisementUUID?: string;

  @property({
    type: 'string',
    required: false,
  })
  appId?: string;

  @property({
    type: 'date',
    required: false,
  })
  created?: Date;

  @property({
    type: 'date',
    required: false,
  })
  updated?: Date;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  autoshare?: boolean

  @hasMany(() => LeaveRequest)
  leaveRequests: LeaveRequest[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Patient>) {
    super(data);
  }

  public copy(patient: Patient) {
    this.firstName = patient.firstName;
    this.lastName = patient.lastName;
    this.documentNumber = patient.documentNumber;
    this.healthInsuranceCardNumber = patient.healthInsuranceCardNumber;
    this.street = patient.street;
    this.postalCode = patient.postalCode;
    this.email = patient.email;
    this.phone = patient.phone;
  }

}

export interface PatientRelations {
  // describe navigational properties here
}

export type PatientWithRelations = Patient & PatientRelations;
