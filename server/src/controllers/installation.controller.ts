import {
    Count,
    CountSchema,
    Filter,
    FilterExcludingWhere,
    repository,
    Where,
} from '@loopback/repository';
import {
    post,
    param,
    get,
    getFilterSchemaFor,
    getModelSchemaRef,
    getWhereSchemaFor,
    patch,
    put,
    del,
    requestBody,
} from '@loopback/rest';
import {Installation} from '../models';
import {InstallationRepository} from '../repositories';

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

        installation.created = new Date();

        return this.installationRepository.create(installation);
    }

    @get('/installations/count', {
        responses: {
            '200': {
                description: 'Installation model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
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

    @put('/installations/{id}', {
        responses: {
            '204': {
                description: 'Installation PUT success',
            },
        },
    })
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
    async deleteById(@param.path.string('id') id: string): Promise<void> {
        await this.installationRepository.deleteById(id);
    }
}
