import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Patient, PatientRelations, LeaveRequest} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {LeaveRequestRepository} from './leave-request.repository';

export class PatientRepository extends DefaultCrudRepository<
  Patient,
  typeof Patient.prototype.id,
  PatientRelations
> {
  public readonly leaveRequests: HasManyRepositoryFactory<
    LeaveRequest,
    typeof Patient.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('LeaveRequestRepository')
    protected leaveRequestRepositoryGetter: Getter<LeaveRequestRepository>,
  ) {
    super(Patient, dataSource);
    this.leaveRequests = this.createHasManyRepositoryFactoryFor(
      'leaveRequests',
      leaveRequestRepositoryGetter,
    );
    this.registerInclusionResolver(
      'leaveRequests',
      this.leaveRequests.inclusionResolver,
    );
  }

  public ofId(id: string): Promise<(Patient & PatientRelations) | null> {
    return this.findOne(
      {
        where: {id},
        include: [
          {
            relation: 'leaveRequests',
            scope: {
              fields: {
                additionalProp1: false,
              },
              order: ['outOfHomeTimestamp DESC'],
            },
          },
        ],
      },
      {
        strictObjectIDCoercion: true,
      },
    );
  }
}
