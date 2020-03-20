import {DefaultCrudRepository} from '@loopback/repository';
import {TestResult, TestResultRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TestResultRepository extends DefaultCrudRepository<
  TestResult,
  typeof TestResult.prototype.id,
  TestResultRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(TestResult, dataSource);
  }
}
