import {DefaultCrudRepository} from '@loopback/repository';
import {Geolocation, GeolocationRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GeolocationRepository extends DefaultCrudRepository<
  Geolocation,
  typeof Geolocation.prototype.id,
  GeolocationRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Geolocation, dataSource);
  }
}
