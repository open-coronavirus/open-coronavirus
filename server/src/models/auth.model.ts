import { Model, model, property } from '@loopback/repository';

@model()
export class Auth extends Model {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  uniqueId: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  constructor(data?: Partial<Auth>) {
    super(data);
  }
}

export interface AuthRelations {
  // describe navigational properties here
}

export type AuthWithRelations = Auth & AuthRelations;
