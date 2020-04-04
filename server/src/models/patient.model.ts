import {Entity, model, property, hasMany} from '@loopback/repository';
import {LeaveRequest} from './leave-request.model';

@model({settings: {strict: false}})
export class Patient extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  documentNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  healthInsuranceCardNumber: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'number',
    required: true,
  })
  gender: number;

  @property({
    type: 'string',
    required: true,
  })
  street: string;

  @property({
    type: 'string',
    required: false,
  })
  apartment: string;

  @property({
    type: 'string',
    required: true,
  })
  postalCode: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  /**
   * 1: UNINFECTED
   * 2: RESTRICTED
   * 3: INFECTED
   */
  @property({
    type: 'number',
    required: false,
  })
  status?: number;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @hasMany(() => LeaveRequest)
  leaveRequests: LeaveRequest[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Patient>) {
    super(data);
  }
}

export interface PatientRelations {
  // describe navigational properties here
}

export type PatientWithRelations = Patient & PatientRelations;
