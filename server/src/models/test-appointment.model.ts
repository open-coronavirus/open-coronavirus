import {belongsTo, Entity, model, property} from '@loopback/repository';
import {HealthCenter, HealthCenterWithRelations} from "./health-center.model";

@model({settings: {strict: false}})
export class TestAppointment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: false,
  })
  date?: Date;

  /**
   * 1. At HOME
   * 2. At HEALTH CENTER
   *
   */
  @property({
    type: 'number',
    required: false,
  })
  type?: number;

  @property({
    type: 'string',
    required: true,
  })
  patientId: string;

  @belongsTo(() => HealthCenter, {keyFrom: 'healthCenterId', name: 'healthCenter'})
  healthCenterId?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TestAppointment>) {
    super(data);
  }
}

export interface TestAppointmentRelations {
  healthCenter?: HealthCenterWithRelations;
}

export type TestAppointmentWithRelations = TestAppointment & TestAppointmentRelations;
