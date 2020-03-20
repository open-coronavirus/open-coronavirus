import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TestAnswers extends Model {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'object',
    required: true,
  })
  answers: object;

  @property({
    type: 'number',
  })
  result?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TestAnswers>) {
    super(data);
  }
}

export interface TestAnswersRelations {
  // describe navigational properties here
}

export type TestAnswersWithRelations = TestAnswers & TestAnswersRelations;
