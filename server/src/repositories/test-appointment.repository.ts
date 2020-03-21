import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {HealthCenter, TestAppointment, TestAppointmentRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {Getter} from "@loopback/context";
import {HealthCenterRepository} from "./health-center.repository";

export class TestAppointmentRepository extends DefaultCrudRepository<
  TestAppointment,
  typeof TestAppointment.prototype.id,
  TestAppointmentRelations
> {

  public readonly healthCenter: BelongsToAccessor<HealthCenter, typeof TestAppointment.prototype.id>;

  constructor(
    @repository.getter('HealthCenterRepository') healthCenterRepositoryGetter: Getter<HealthCenterRepository>,
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(TestAppointment, dataSource);

    this.healthCenter = this.createBelongsToAccessorFor(
        'healthCenter',
        healthCenterRepositoryGetter,
    );
    // add this line to register inclusion resolver.
    this.registerInclusionResolver('healthCenter', this.healthCenter.inclusionResolver);

  }
}
