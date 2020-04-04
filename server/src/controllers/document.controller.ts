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
import {Document} from '../models';
import {DocumentRepository} from '../repositories';

export class DocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository : DocumentRepository,
  ) {}

  @post('/documents', {
    responses: {
      '200': {
        description: 'Document model instance',
        content: {'application/json': {schema: getModelSchemaRef(Document)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {
            title: 'NewDocument',
            exclude: ['id'],
          }),
        },
      },
    })
    document: Omit<Document, 'id'>,
  ): Promise<Document> {
    return this.documentRepository.create(document);
  }

  @get('/documents/count', {
    responses: {
      '200': {
        description: 'Document model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Document) where?: Where<Document>,
  ): Promise<Count> {
    return this.documentRepository.count(where);
  }

  @get('/documents', {
    responses: {
      '200': {
        description: 'Array of Document model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Document, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Document) filter?: Filter<Document>,
  ): Promise<Document[]> {
    return this.documentRepository.find(filter);
  }

  @patch('/documents', {
    responses: {
      '200': {
        description: 'Document PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
    document: Document,
    @param.where(Document) where?: Where<Document>,
  ): Promise<Count> {
    return this.documentRepository.updateAll(document, where);
  }

  @get('/documents/{id}', {
    responses: {
      '200': {
        description: 'Document model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Document, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Document, {exclude: 'where'}) filter?: FilterExcludingWhere<Document>
  ): Promise<Document> {
    return this.documentRepository.findById(id, filter);
  }

  @patch('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
    document: Document,
  ): Promise<void> {
    await this.documentRepository.updateById(id, document);
  }

  @put('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() document: Document,
  ): Promise<void> {
    await this.documentRepository.replaceById(id, document);
  }

  @del('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.documentRepository.deleteById(id);
  }
}
