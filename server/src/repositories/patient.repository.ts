import {DefaultCrudRepository, HasManyRepositoryFactory, juggler,} from '@loopback/repository';
import {LeaveRequest, Patient, PatientRelations} from '../models';
import {inject} from '@loopback/core';

export class PatientRepository extends DefaultCrudRepository<
  Patient,
  typeof Patient.prototype.id,
  PatientRelations
> {
  public readonly leaveRequests: HasManyRepositoryFactory<
    LeaveRequest,
    typeof Patient.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: juggler.DataSource
  ) {
    super(Patient, dataSource);
  }

}
