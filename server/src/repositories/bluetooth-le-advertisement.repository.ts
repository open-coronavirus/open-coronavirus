import {DefaultCrudRepository} from '@loopback/repository';
import {BluetoothLeAdvertisement, BluetoothLeAdvertisementRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BluetoothLeAdvertisementRepository extends DefaultCrudRepository<
  BluetoothLeAdvertisement,
  typeof BluetoothLeAdvertisement.prototype.id,
  BluetoothLeAdvertisementRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(BluetoothLeAdvertisement, dataSource);
  }
}
