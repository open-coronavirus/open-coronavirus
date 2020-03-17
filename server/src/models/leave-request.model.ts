import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class LeaveRequest extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  leaveReason: number;

  @property({
    type: 'string',
    required: false
  })
  additionalInfo?: string;

  @property({
    type: 'date',
    required: false
  })
  outOfHomeTimestamp: Date;

  @property({
    type: 'date',
    required: false
  })
  backToHomeTimestamp: Date;

  @property({
    type: 'string',
    required: true
  })
  patientId: string;

  @property({
    type: 'number',
    required: false,
    default: 1,
  })
  status: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LeaveRequest>) {
    super(data);
  }
}

export interface LeaveRequestRelations {
  // describe navigational properties here
}

export type LeaveRequestWithRelations = LeaveRequest & LeaveRequestRelations;
