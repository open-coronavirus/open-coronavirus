import {Entity, model, property} from '@loopback/repository';

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
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    required: true,
  })
  type: number;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TestAppointment>) {
    super(data);
  }
}

export interface TestAppointmentRelations {
  // describe navigational properties here
}

export type TestAppointmentWithRelations = TestAppointment & TestAppointmentRelations;
