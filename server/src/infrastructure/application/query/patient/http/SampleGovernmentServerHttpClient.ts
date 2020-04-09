import {AxiosInstance, AxiosResponse} from 'axios';
import moment from 'moment';
import {Patient, TestAppointment, HealthCenter} from '../../../../../models';

export class SampleGovernmentServerHttpClient {
  constructor(private axios: AxiosInstance) {}

  public async getPatientHealthCenters(
    patient: Patient,
  ): Promise<SampleGovernmentHealthCenter[]> {
    const {data} = <AxiosResponse<SampleGovernmentHealthCenter[]>>(
      await this.axios.get(
        `/pacientes/${patient.healthInsuranceCardNumber}/centros`,
      )
    );

    return data;
  }

  public async createAppointment(
    patient: Patient,
    healthCenter: HealthCenter,
  ): Promise<TestAppointment> {
    const {data} = await this.axios.post(
      `/centros/${healthCenter.refCode}/cita-previa`,
      {
        sip: patient.healthInsuranceCardNumber,
      },
    );

    return new TestAppointment({
      healthCenterId: healthCenter.id,
      patientId: patient.id,
      type: 1,
      appointmentDate: moment(
        `${data.fecha} ${data.hora}`,
        'DD/MM/YYYY HH:mm',
      ).toDate(),
    });
  }
}

export type SampleGovernmentCoords = {
  latitud: number;
  longitud: number;
};

export type SampleGovernmentHealthCenter = {
  codigo: string;
  nombre: string;
  direccion: string;
  coordenadas: SampleGovernmentCoords;
};
