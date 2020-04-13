import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where,} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody,} from '@loopback/rest';
import {Installation, LeaveRequest} from '../models';
import {InstallationRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {authorize} from "@loopback/authorization";

export class InstallationController {
    constructor(
        @repository(InstallationRepository)
        public installationRepository : InstallationRepository,
    ) {}

    @post('/installations', {
        responses: {
            '200': {
                description: 'Installation model instance',
                content: {'application/json': {schema: getModelSchemaRef(Installation)}},
            },
        },
    })
    async create(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Installation, {
                        title: 'NewInstallation',
                        exclude: ['id'],
                    }),
                },
            },
        })
            installation: Omit<Installation, 'id'>,
    ): Promise<Installation> {

        console.log('register new installation: ' + JSON.stringify(installation));

        let returnValue: Promise<Installation> = new Promise(resolve => {
            this.installationRepository.findOne({where: {deviceId: installation.deviceId}}).then(result => {
                if (result != null) {
                    result.patientId = installation.patientId;
                    result.created = new Date();
                    this.installationRepository.update(result).then(updatedInstance => {
                        resolve(result);
                    })
                } else {
                    installation.created = new Date();
                    this.installationRepository.create(installation).then(createdInstance => {
                        resolve(createdInstance);
                    }).catch(error => {
                        console.error('error trying to create installation: ' + JSON.stringify(error));
                    })
                }
            })
        });

        return returnValue;

    }

    @get('/installations/count', {
        responses: {
            '200': {
                description: 'Installation model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['read']})
    async count(
        @param.where(Installation) where?: Where<Installation>,
    ): Promise<Count> {
        return this.installationRepository.count(where);
    }

    @get('/installations', {
        responses: {
            '200': {
                description: 'Array of Installation model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Installation, {includeRelations: true}),
                        },
                    },
                },
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['read']})
    async find(
        @param.filter(Installation) filter?: Filter<Installation>,
    ): Promise<Installation[]> {
        return this.installationRepository.find(filter);
    }

    @patch('/installations', {
        responses: {
            '200': {
                description: 'Installation PATCH success count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['write']})
    async updateAll(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Installation, {partial: true}),
                },
            },
        })
            installation: Installation,
        @param.where(Installation) where?: Where<Installation>,
    ): Promise<Count> {
        return this.installationRepository.updateAll(installation, where);
    }

    @get('/installations/{id}', {
        responses: {
            '200': {
                description: 'Installation model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(Installation, {includeRelations: true}),
                    },
                },
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['read']})
    async findById(
        @param.path.string('id') id: string,
        @param.filter(Installation, {exclude: 'where'}) filter?: FilterExcludingWhere<Installation>
    ): Promise<Installation> {
        return this.installationRepository.findById(id, filter);
    }

    @patch('/installations/{id}', {
        responses: {
            '204': {
                description: 'Installation PATCH success',
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['write']})
    async updateById(
        @param.path.string('id') id: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Installation, {partial: true}),
                },
            },
        })
            installation: Installation,
    ): Promise<void> {
        await this.installationRepository.updateById(id, installation);
    }

    @patch('/installations/push-registration-id/{deviceId}', {
        responses: {
            '204': {
                description: 'Installation PATCH success'
            },
        },
    })
    async updatePushRegistrationIdByDeviceId(
        @param.path.string('deviceId') deviceId: string,
        @requestBody() pushRegistrationId: string
    ): Promise<void> {

        let returnValue: Promise<void> = new Promise(resolve => {
            this.installationRepository.findOne({where: {deviceId: deviceId}}).then(result => {
                if (result != null) {
                    result.pushRegistrationId = pushRegistrationId;
                    this.installationRepository.updateById(result.id, result).then(result => {
                        resolve();
                    });
                }
            });
        });

        return returnValue;

    }

    @put('/installations/{id}', {
        responses: {
            '204': {
                description: 'Installation PUT success',
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['write']})
    async replaceById(
        @param.path.string('id') id: string,
        @requestBody() installation: Installation,
    ): Promise<void> {
        await this.installationRepository.replaceById(id, installation);
    }

    @del('/installations/{id}', {
        responses: {
            '204': {
                description: 'Installation DELETE success',
            },
        },
    })
    @authenticate(process.env.AUTH_STRATEGY!)
    @authorize({resource: 'Installation', scopes: ['write']})
    async deleteById(@param.path.string('id') id: string): Promise<void> {
        await this.installationRepository.deleteById(id);
    }
}
