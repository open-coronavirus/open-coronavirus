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
import {TestAppointment, TestResult} from '../models';
import {TestResultRepository} from '../repositories';
import {TestActionEnum, TestResultEnum} from "../common/utils/enums";

export class TestResultController {
  constructor(
    @repository(TestResultRepository)
    public testResultRepository : TestResultRepository,
  ) {}

  protected DEFAULT_TEST_ACTION = TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HEALTH_CENTER;

  /**
   * This is the service in charge of determine what to do with each patient
   * meaning, if set an appointment for a coronavirus test, just show numbers to call to, ...
   *
   * @param testResult
   */
  @post('/test-results', {
    responses: {
      '200': {
        description: 'TestResult model instance',
        content: {'application/json': {schema: getModelSchemaRef(TestResult)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestResult, {
            title: 'NewTestResult',
            exclude: ['id'],
          }),
        },
      },
    })
    testResult: Omit<TestResult, 'id'>,
  ): Promise<TestResult> {

    testResult.result = 1;
    testResult.created = new Date();

    let score = 0;
    testResult.answers?.forEach((answer: any) => {
      if(answer.answer.hasOwnProperty('value')) {
        score += answer.answer.value;
      }
    });

    if(score > 0) {
      testResult.result = TestResultEnum.CORONAVIRUS_SUSPICIOUS;
    }
    else {
      testResult.result = TestResultEnum.OK;
    }
    testResult.action = this.DEFAULT_TEST_ACTION;

    return this.testResultRepository.create(testResult);

  }

  @get('/test-results/count', {
    responses: {
      '200': {
        description: 'TestResult model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TestResult)) where?: Where<TestResult>,
  ): Promise<Count> {
    return this.testResultRepository.count(where);
  }

  @get('/test-results', {
    responses: {
      '200': {
        description: 'Array of TestResult model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TestResult, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TestResult)) filter?: Filter<TestResult>,
  ): Promise<TestResult[]> {
    return this.testResultRepository.find(filter);
  }

  @patch('/test-results', {
    responses: {
      '200': {
        description: 'TestResult PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestResult, {partial: true}),
        },
      },
    })
    testResult: TestResult,
    @param.query.object('where', getWhereSchemaFor(TestResult)) where?: Where<TestResult>,
  ): Promise<Count> {
    return this.testResultRepository.updateAll(testResult, where);
  }

  @get('/test-results/{id}', {
    responses: {
      '200': {
        description: 'TestResult model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestResult, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TestResult)) filter?: Filter<TestResult>
  ): Promise<TestResult> {
    return this.testResultRepository.findById(id, filter);
  }

  @get('/test-results/patient-id/{patientId}', {
    responses: {
      '200': {
        description: 'TestResult model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestResult, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findLatestByPatientId(
      @param.path.string('patientId') patientId: string
  ): Promise<TestResult | null> {

    return this.testResultRepository.findOne({where: {patientId: {like: patientId}}, order: ['created DESC']});

  }

  @patch('/test-results/{id}', {
    responses: {
      '204': {
        description: 'TestResult PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestResult, {partial: true}),
        },
      },
    })
    testResult: TestResult,
  ): Promise<void> {
    await this.testResultRepository.updateById(id, testResult);
  }

  @put('/test-results/{id}', {
    responses: {
      '204': {
        description: 'TestResult PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() testResult: TestResult,
  ): Promise<void> {
    await this.testResultRepository.replaceById(id, testResult);
  }

  @del('/test-results/{id}', {
    responses: {
      '204': {
        description: 'TestResult DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.testResultRepository.deleteById(id);
  }
}
