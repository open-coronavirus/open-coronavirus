import {DefaultCrudRepository} from '@loopback/repository';
import {LeaveRequest, LeaveRequestRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LeaveRequestRepository extends DefaultCrudRepository<
  LeaveRequest,
  typeof LeaveRequest.prototype.id,
  LeaveRequestRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(LeaveRequest, dataSource);
  }
}
