import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {InfectionExposure, InfectionExposureRelations} from '../models';
import {inject} from '@loopback/core';

export class InfectionExposureRepository extends DefaultCrudRepository<
  InfectionExposure,
  typeof InfectionExposure.prototype.id,
  InfectionExposureRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: juggler.DataSource,
  ) {
    super(InfectionExposure, dataSource);
  }
}
