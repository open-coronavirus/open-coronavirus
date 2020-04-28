import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class InfectionExposure extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  patientId: string;

  @property({
    type: 'number',
    required: false,
  })
  rssi?: number;

  @property({
    type: 'number',
    required: true,
  })
  timestampFrom: number;

  @property({
    type: 'number',
    required: true,
  })
  timestampTo: number;

  @property({
    type: 'string',
    required: true,
  })
  anonymizedInfectedUuid: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<InfectionExposure>) {
    super(data);
  }
}

export interface InfectionExposureRelations {
  // describe navigational properties here
}

export type InfectionExposureWithRelations = InfectionExposure & InfectionExposureRelations;
