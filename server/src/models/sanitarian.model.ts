import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Sanitarian extends Entity {
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
  sanitarian_id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  position: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Sanitarian>) {
    super(data);
  }
}

export interface SanitarianRelations {
  // describe navigational properties here
}

export type SanitarianWithRelations = Sanitarian & SanitarianRelations;
