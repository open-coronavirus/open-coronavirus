import {DefaultCrudRepository} from '@loopback/repository';
import {InfectionExposure, InfectionExposureRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InfectionExposureRepository extends DefaultCrudRepository<
  InfectionExposure,
  typeof InfectionExposure.prototype.id,
  InfectionExposureRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(InfectionExposure, dataSource);
  }
}
