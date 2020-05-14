import {DefaultCrudRepository} from '@loopback/repository';
import {InfectionExposure, InfectionExposureRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {DataSource} from "loopback-datasource-juggler";

export class InfectionExposureRepository extends DefaultCrudRepository<
  InfectionExposure,
  typeof InfectionExposure.prototype.id,
  InfectionExposureRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: DataSource,
  ) {
    super(InfectionExposure, dataSource);
  }
}
