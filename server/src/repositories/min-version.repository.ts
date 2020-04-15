import {DefaultCrudRepository} from '@loopback/repository';
import {MinVersion, MinVersionRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MinVersionRepository extends DefaultCrudRepository<
  MinVersion,
  typeof MinVersion.prototype.id,
  MinVersionRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(MinVersion, dataSource);
  }
}
