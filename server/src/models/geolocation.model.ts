import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Geolocation extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true
  })
  id: string;

  @property({
    type: 'number',
    required: false,
  })
  latitude: number;

  @property({
    type: 'number',
    required: false,
  })
  longitude: number;

  @property({
    type: 'number',
    required: false,
  })
  accuracy: number;

  @property({
    type: 'number',
    required: false,
  })
  altitude: number;

  @property({
    type: 'number',
    required: false,
  })
  bearing: number;

  @property({
    type: 'number',
    required: false,
  })
  speed: number;

  @property({
    type: 'date',
    required: false,
  })
  created: Date;

  @property({
    type: 'string',
    required: true,
  })
  patientId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Geolocation>) {
    super(data);
  }
}

export interface GeolocationRelations {
  // describe navigational properties here
}

export type GeolocationWithRelations = Geolocation & GeolocationRelations;
