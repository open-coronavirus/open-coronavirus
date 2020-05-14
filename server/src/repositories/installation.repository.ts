import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Installation, InstallationRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {DataSource} from "loopback-datasource-juggler";

export class InstallationRepository extends DefaultCrudRepository<
    Installation,
    typeof Installation.prototype.id,
    InstallationRelations
    > {
    constructor(
        @inject('datasources.mongo') dataSource: juggler.DataSource
    ) {
        super(Installation, dataSource);
    }
}
