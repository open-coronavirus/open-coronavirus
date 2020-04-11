import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Installation extends Entity {
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
  deviceId: string;

  @property({
    type: 'date',
    required: true,
  })
  created: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Installation>) {
    super(data);
  }
}

export interface InstallationRelations {
  // describe navigational properties here
}

export type InstallationWithRelations = Installation & InstallationRelations;
