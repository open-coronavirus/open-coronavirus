import {
  AppointmentService,
  CreateAppointmentRequest,
} from '../appointment.service';
import {
  SampleGovernmentServerHttpClient,
  SampleGovernmentHealthCenter,
} from '../../infrastructure/application/query/patient/http/SampleGovernmentServerHttpClient';
import {TestAppointment, HealthCenter} from '../../models';
import {
  PatientRepository,
  TestAppointmentRepository,
  HealthCenterRepository,
  TestResultRepository,
} from '../../repositories';
import {repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {AppointmentType} from '../../common/utils/enums';

export class SampleGovernmentServerAppointmentService
  implements AppointmentService {
  constructor(
    @repository(PatientRepository)
    private patientRepository: PatientRepository,

    @repository(TestResultRepository)
    private testResultRepository: TestResultRepository,

    @repository(TestAppointmentRepository)
    private appointmentRepository: TestAppointmentRepository,

    @repository(HealthCenterRepository)
    private healthCenterRepository: HealthCenterRepository,

    @inject('SampleGovernmentServerHttpClient')
    private client: SampleGovernmentServerHttpClient,
  ) {}

  async createAppointment(
    request: CreateAppointmentRequest,
  ): Promise<TestAppointment> {
    const {patientId} = request;
    const patient = await this.patientRepository.findById(
      <string>patientId,
      {},
    );

    if (null === patient) {
      throw new Error('Patient not found'); // TODO: convert to PatientNotFoundError. Capture in controller and send a 404
    }

    const testResult = await this.testResultRepository.findOne(
      {
        where: {patientId: patient.id || null},
        order: ['created DESC'],
      },
      {strictObjectIDCoercion: true},
    );

    if (null === testResult) {
      // TODO: throw error
      // throw new Error('No test results found');
    }

    const patientHealthCenters: SampleGovernmentHealthCenter[] = await this.client.getPatientHealthCenters(
      patient,
    );

    const healthCenters = await this.toHealthCenters(patientHealthCenters);

    for (let healthCenter of healthCenters) {
      try {
        let appointment: TestAppointment = await this.client.createAppointment(
          patient,
          healthCenter,
        );

        appointment = await this.appointmentRepository.save(appointment);
        return appointment;
      } catch (err) {
        console.error("Couldn't create appointment", err); // TODO: add a logger
      }
    }

    throw new Error('Appointment could not be created'); // TODO: custom error type?
  }

  private async toHealthCenters(
    patientHealthCenters: SampleGovernmentHealthCenter[],
  ): Promise<HealthCenter[]> {
    let healthCenters: HealthCenter[] = [];
    for (let patientHealthCenter of patientHealthCenters) {
      let healthCenter = await this.healthCenterRepository.findOne(
        {where: {refCode: patientHealthCenter.codigo}},
        {strictObjectIDCoercion: true},
      );

      if (null === healthCenter) {
        healthCenter = await this.healthCenterRepository.create(
          new HealthCenter({
            name: patientHealthCenter.nombre,
            address: patientHealthCenter.direccion,
            latitude: patientHealthCenter.coordenadas.latitud,
            longitude: patientHealthCenter.coordenadas.longitud,
            refCode: patientHealthCenter.codigo,
            postalCode: 'n/a',
          }),
        );

        healthCenters.push(healthCenter);
      } else {
        healthCenters.push(healthCenter);
      }
    }

    return healthCenters;
  }

  // COPIED FROM appointment-mock.service.ts to allow compatibility with existing code

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
}
