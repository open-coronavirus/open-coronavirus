import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class BluetoothLeAdvertisement extends Entity {
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
  sourceServiceUUID: string;

  @property({
    type: 'string',
    required: true,
  })
  targetServiceUUID: string;

  @property({
    type: 'date',
    required: false,
  })
  created?: string;

  @property({
    type: 'number',
    required: false,
  })
  rssi?: number;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BluetoothLeAdvertisement>) {
    super(data);
  }
}

export interface BluetoothLeAdvertisementRelations {
  // describe navigational properties here
}

export type BluetoothLeAdvertisementWithRelations = BluetoothLeAdvertisement & BluetoothLeAdvertisementRelations;
