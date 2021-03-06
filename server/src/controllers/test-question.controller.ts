import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { LeaveRequest, TestQuestion, TestQuestionWithRelations } from '../models';
import { TestQuestionRepository } from '../repositories';
import { authenticate } from "@loopback/authentication";
import { authorize } from "@loopback/authorization";

export class TestQuestionController {
  constructor(
    @repository(TestQuestionRepository)
    public testQuestionRepository: TestQuestionRepository,
  ) { }

  @post('/test-questions', {
    responses: {
      '200': {
        description: 'TestQuestion model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TestQuestion) } },
      },
    },
  })
  //todo securize
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestQuestion, {
            title: 'NewTestQuestion',

          }),
        },
      },
    })
    testQuestion: TestQuestion,
  ): Promise<TestQuestion> {
    return this.testQuestionRepository.create(testQuestion);
  }

  @get('/test-questions/count', {
    responses: {
      '200': {
        description: 'TestQuestion model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['read'] })
  async count(
    @param.query.object('where', getWhereSchemaFor(TestQuestion)) where?: Where<TestQuestion>,
  ): Promise<Count> {
    return this.testQuestionRepository.count(where);
  }

  @get('/test-questions', {
    responses: {
      '200': {
        description: 'Array of TestQuestion model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TestQuestion, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  //todo securize
  /*@authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['read'] })*/
  async find(
    @param.query.object('filter', getFilterSchemaFor(TestQuestion)) filter?: Filter<TestQuestion>,
  ): Promise<TestQuestion[]> {
    return this.testQuestionRepository.find(filter);
  }

  @patch('/test-questions', {
    responses: {
      '200': {
        description: 'TestQuestion PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['write'] })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestQuestion, { partial: true }),
        },
      },
    })
    testQuestion: TestQuestion,
    @param.query.object('where', getWhereSchemaFor(TestQuestion)) where?: Where<TestQuestion>,
  ): Promise<Count> {
    return this.testQuestionRepository.updateAll(testQuestion, where);
  }

  @get('/test-questions/{id}', {
    responses: {
      '200': {
        description: 'TestQuestion model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestQuestion, { includeRelations: true }),
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['read'] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TestQuestion)) filter?: Filter<TestQuestion>
  ): Promise<TestQuestion> {
    return this.testQuestionRepository.findById(id, filter);
  }

  @get('/test-questions/question-id/{questionId}', {
    responses: {
      '200': {
        description: 'TestQuestion model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestQuestion, { includeRelations: true }),
          },
        },
      },
    },
  })
  //todo securize
  async findByQuestionId(
    @param.path.string('questionId') questionId: string
  ): Promise<TestQuestion | null> {

    let filter: Filter<TestQuestion> = { where: { questionId: questionId } };
    return this.testQuestionRepository.findOne(filter);

  }

  @patch('/test-questions/{id}', {
    responses: {
      '204': {
        description: 'TestQuestion PATCH success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['write'] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestQuestion, { partial: true }),
        },
      },
    })
    testQuestion: TestQuestion,
  ): Promise<void> {
    await this.testQuestionRepository.updateById(id, testQuestion);
  }

  @put('/test-questions/{id}', {
    responses: {
      '204': {
        description: 'TestQuestion PUT success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['write'] })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() testQuestion: TestQuestion,
  ): Promise<void> {
    await this.testQuestionRepository.replaceById(id, testQuestion);
  }

  @del('/test-questions/{id}', {
    responses: {
      '204': {
        description: 'TestQuestion DELETE success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({ resource: 'TestQuestion', scopes: ['write'] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.testQuestionRepository.deleteById(id);
  }
}
