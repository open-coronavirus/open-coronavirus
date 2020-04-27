import {DefaultCrudRepository} from '@loopback/repository';
import {InfectedKey, InfectedKeyRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InfectedKeyRepository extends DefaultCrudRepository<
  InfectedKey,
  typeof InfectedKey.prototype.id,
  InfectedKeyRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(InfectedKey, dataSource);
  }
}
