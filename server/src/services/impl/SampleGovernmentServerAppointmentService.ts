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
    const patient = await this.patientRepository.findById(patientId, {});

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

  getAppointmentType(answers: object[], patientId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  getAppointmentDateAtHealthCenter(
    healthCenterId: string,
    patientId: string,
  ): Promise<Date> {
    throw new Error('Method not implemented.');
  }
  getAppointmentDateAtHome(patientId: string): Promise<Date> {
    throw new Error('Method not implemented.');
  }
}
