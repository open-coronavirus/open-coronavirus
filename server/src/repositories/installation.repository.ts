import {DefaultCrudRepository} from '@loopback/repository';
import {Installation, InstallationRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InstallationRepository extends DefaultCrudRepository<
    Installation,
    typeof Installation.prototype.id,
    InstallationRelations
    > {
    constructor(
        @inject('datasources.mongo') dataSource: MongoDataSource,
    ) {
        super(Installation, dataSource);
    }
}
