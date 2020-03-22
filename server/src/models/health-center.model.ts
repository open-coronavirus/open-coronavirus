import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class HealthCenter extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  postalCode: string;

  @property({
    type: 'number'
  })
  latitude?: number;

  @property({
    type: 'number',
  })
  longitude?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<HealthCenter>) {
    super(data);
  }
}

export interface HealthCenterRelations {
  // describe navigational properties here
}

export type HealthCenterWithRelations = HealthCenter & HealthCenterRelations;
