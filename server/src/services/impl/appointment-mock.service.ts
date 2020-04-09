import {
  AppointmentService,
  CreateAppointmentRequest,
} from '../appointment.service';
import {repository} from '@loopback/repository';
import {TestResultRepository} from '../../repositories';
import {AppointmentType} from '../../common/utils/enums';
import {TestAppointment} from '../../models';

export class AppointmentMockService implements AppointmentService {
  constructor(
    @repository(TestResultRepository)
    public testResultRepository: TestResultRepository,
  ) {}

  /**
   * Demo, determine the appointment type based on a given score (100)
   *
   * @param healthCenterId
   * @param patientId
   */
  public getAppointmentType(
    answers: object[],
    patientId: string,
  ): Promise<number> {
    return new Promise((result) => {
      let score = 0;
      answers.forEach((answer: any) => {
        if (answer.answer.hasOwnProperty('value')) {
          score += answer.answer.value;
        }
      });

      if (score > 100) {
        result(AppointmentType.AT_HEALTH_CENTER);
      } else {
        result(AppointmentType.AT_HOME);
      }
    });
  }

  /**
   * Demo, returns a ramdon date between tomorrow and 6 days
   *
   * @param healthCenterId
   * @param patientId
   */
  public getAppointmentDateAtHealthCenter(
    healthCenterId: string,
    patientId: string,
  ): Promise<Date> {
    return new Promise((result) => {
      let returnValue = new Date();
      returnValue.setDate(
        returnValue.getDate() + Math.floor(Math.random() * 6) + 1,
      );
      result(returnValue);
    });
  }

  /**
   *
   * Demo, returns a ramdon date between tomorrow and 6 days
   *
   * @param patientId
   */
  public getAppointmentDateAtHome(patientId: string): Promise<Date> {
    return new Promise((result) => {
      let returnValue = new Date();
      returnValue.setDate(
        returnValue.getDate() + Math.floor(Math.random() * 6) + 1,
      );
      result(returnValue);
    });
  }

  createAppointment(
    request: CreateAppointmentRequest,
  ): Promise<TestAppointment> {
    throw new Error('Method not implemented.');
  }
}
