import {DefaultCrudRepository} from '@loopback/repository';
import {TestAppointment, TestAppointmentRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TestAppointmentRepository extends DefaultCrudRepository<
  TestAppointment,
  typeof TestAppointment.prototype.id,
  TestAppointmentRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(TestAppointment, dataSource);
  }
}
