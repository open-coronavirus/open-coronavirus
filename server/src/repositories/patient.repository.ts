import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Patient, PatientRelations, LeaveRequest} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {LeaveRequestRepository} from './leave-request.repository';
import {DataSource} from "loopback-datasource-juggler";

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
    @inject('datasources.mongo') dataSource: DataSource
  ) {
    super(Patient, dataSource);
  }

}
