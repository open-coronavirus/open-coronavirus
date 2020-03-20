import {DefaultCrudRepository} from '@loopback/repository';
import {HealthCenter, HealthCenterRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class HealthCenterRepository extends DefaultCrudRepository<
  HealthCenter,
  typeof HealthCenter.prototype.id,
  HealthCenterRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(HealthCenter, dataSource);
  }
}
