import {DefaultCrudRepository} from '@loopback/repository';
import {TestQuestion, TestQuestionRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TestQuestionRepository extends DefaultCrudRepository<
  TestQuestion,
  typeof TestQuestion.prototype.id,
  TestQuestionRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(TestQuestion, dataSource);
  }
}
