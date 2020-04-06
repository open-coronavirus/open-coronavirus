import {DefaultCrudRepository} from '@loopback/repository';
import {Sanitarian, SanitarianRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SanitarianRepository extends DefaultCrudRepository<
  Sanitarian,
  typeof Sanitarian.prototype.id,
  SanitarianRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Sanitarian, dataSource);
  }
}
