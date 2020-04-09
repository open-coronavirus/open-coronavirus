import {DefaultCrudRepository} from '@loopback/repository';
import {PoliceOfficer, PoliceOfficerRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PoliceOfficerRepository extends DefaultCrudRepository<
  PoliceOfficer,
  typeof PoliceOfficer.prototype.id,
  PoliceOfficerRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(PoliceOfficer, dataSource);
  }
}
