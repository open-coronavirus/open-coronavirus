import {Entity, Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TestResult extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  answers?: object[];

  @property({
    type: 'string',
    required: true,
  })
  patientId: string;

  /**
   * See TestResultEnum
   *
   */
  @property({
    type: 'number',
  })
  result?: number;

  /**
   * See TestActionEnum
   *
   */
  @property({
    type: 'number',
  })
  action?: number;

  @property({
    type: 'date',
    required: false,
  })
  created?: Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TestResult>) {
    super(data);
  }

  public getScore() {
    let returnValue = 0;
    this.answers?.forEach((answer: any) => {
      if(answer.answer.hasOwnProperty('value')) {
        returnValue += answer.answer.value;
      }
    });
    return returnValue;
  }

}

export interface TestResultRelations {
  // describe navigational properties here
}

export type TestResultWithRelations = TestResult & TestResultRelations;
