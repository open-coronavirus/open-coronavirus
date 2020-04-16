import {Entity, model, property} from '@loopback/repository';

@model()
export class MinVersion extends Entity {
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
  minVersion: string;


  constructor(data?: Partial<MinVersion>) {
    super(data);
  }
}

export interface MinVersionRelations {
  // describe navigational properties here
}

export type MinVersionWithRelations = MinVersion & MinVersionRelations;
