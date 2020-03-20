import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongo: {
      table: 'TestQuestion',
    },
    strict: false}})
export class TestQuestion extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    })
    id: string;

    @property({
        type: 'string',
        required: true
    })
    questionId: string;

    @property({
        type: 'string',
    })
    title?: string;

    @property({
        type: 'string',
    })
    subtitle?: string;

    @property({
        type: 'boolean',
        default: false,
    })
    multicheck?: boolean;

    @property({
        type: 'string',
    })
    question?: string;

    @property({
        type: 'string',
    })
    target?: string;

    @property({
        type: 'array',
        itemType: 'object',
    })
    children?: object[];

    // Define well-known properties here

    // Indexer property to allow additional data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;

    constructor(data?: Partial<TestQuestion>) {
        super(data);
    }
}

export interface TestQuestionRelations {
    // describe navigational properties here
}

export type TestQuestionWithRelations = TestQuestion & TestQuestionRelations;
