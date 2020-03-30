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
import {AppointmentType, TestActionEnum, TestResultEnum} from "../common/utils/enums";
import {service} from "@loopback/core";
import {AppointmentService} from "../services/appointment.service";

export class TestResultController {
    constructor(
        @service('AppointmentService') protected appointmentService: AppointmentService,
        @repository(TestResultRepository) public testResultRepository: TestResultRepository,
    ) {
    }

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

        let returnValue: Promise<TestResult> = new Promise(resolve => {

            testResult.created = new Date();

            let score = 0;
            testResult.answers?.forEach((answer: any) => {
                if (answer.answer.hasOwnProperty('value')) {
                    score += answer.answer.value;
                }
            });

            if (score > 0) {
                testResult.result = TestResultEnum.CORONAVIRUS_SUSPICIOUS;
            } else {
                testResult.result = TestResultEnum.OK;
            }

            this.appointmentService.getAppointmentType(testResult.answers, testResult.patientId).then(appointmentType => {
                switch(appointmentType) {
                    case AppointmentType.AT_HOME:
                        testResult.action = TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HOME;
                        break;
                    case AppointmentType.AT_HEALTH_CENTER:
                        testResult.action = TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HEALTH_CENTER;
                        break;
                    default:
                        testResult.action = TestActionEnum.SHOW_PHONE_INFORMATION;
                        break;
                }
                this.testResultRepository.create(testResult).then(testResultCreated => {
                  resolve(testResultCreated);
                })
            });

        });

        return returnValue;

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

        return this.testResultRepository.findOne(
          {where: {patientId: patientId}, order: ['created DESC']},
          {strictObjectIDCoercion: true});

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
