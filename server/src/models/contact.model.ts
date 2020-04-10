import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Contact extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  sourceUuid: string;

  @property({
    type: 'string',
    required: true,
  })
  targetUuid: string;

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
    type: 'number',
  })
  rssi?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Contact>) {
    super(data);
  }
}

export interface ContactRelations {
  // describe navigational properties here
}

export type ContactWithRelations = Contact & ContactRelations;
