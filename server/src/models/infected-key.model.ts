import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class InfectedKey extends Entity {
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
  key: string;

  @property({
    type: 'date',
    required: true,
  })
  keyDate: string;

  @property({
    type: 'date',
  })
  infectionDate?: string;

  @property({
    type: 'date',
  })
  created: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<InfectedKey>) {
    super(data);
  }
}

export interface InfectedKeyRelations {
  // describe navigational properties here
}

export type InfectedKeyWithRelations = InfectedKey & InfectedKeyRelations;
