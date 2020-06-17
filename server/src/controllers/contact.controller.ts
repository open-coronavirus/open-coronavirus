import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where,} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody,} from '@loopback/rest';
import {Contact, Patient} from '../models';
import {ContactRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {authorize} from "@loopback/authorization";
import {PatientService} from "../services/patient.service";
import {service} from "@loopback/core";

const schemaWithArrayOfContact = {
  type: 'array',
  items: {
    'x-ts-type': Contact,
  },
};

export class ContactController {
  constructor(
    @repository(ContactRepository) public contactRepository : ContactRepository,
    @service(PatientService) public patientService: PatientService
  ) {}

  @post('/contacts', {
    responses: {
      '200': {
        description: 'Contact model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contact)}},
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['write']})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contact, {
            title: 'NewContact',

          }),
        },
      },
    })
    contact: Contact,
  ): Promise<Contact> {
    return this.contactRepository.create(contact);
  }

  @get('/contacts/count', {
    responses: {
      '200': {
        description: 'Contact model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['read']})
  async count(
    @param.where(Contact) where?: Where<Contact>,
  ): Promise<Count> {
    return this.contactRepository.count(where);
  }

  @get('/contacts', {
    responses: {
      '200': {
        description: 'Array of Contact model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Contact, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['read']})
  async find(
    @param.filter(Contact) filter?: Filter<Contact>,
  ): Promise<Contact[]> {
    return this.contactRepository.find(filter);
  }

  @post('/contacts/bulk', {
    responses: {
      '200': {
        description: 'Contact PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  //unsecure!!!
  async createAll(
      @requestBody({
        content: {
          'application/json': {
            schema: schemaWithArrayOfContact
          },
        },
      })
      contacts: Contact[],
  ): Promise<void> {
    return new Promise(resolve => {
      console.log("Received " + contacts.length + " contacts to save to ...");
      this.contactRepository.createAll(contacts);
      console.log("Added " + contacts.length + " contacts ...");
      //also put in quarantine all of them
      this.patientService.putInQuarantine(contacts);
      console.log("Put " + contacts.length + " contacts in quarantine ...");
      resolve();
    });

  }

  @patch('/contacts', {
    responses: {
      '200': {
        description: 'Contact PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['write']})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contact, {partial: true}),
        },
      },
    })
    contact: Contact,
    @param.where(Contact) where?: Where<Contact>,
  ): Promise<Count> {
    return this.contactRepository.updateAll(contact, where);
  }

  @get('/contacts/{id}', {
    responses: {
      '200': {
        description: 'Contact model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Contact, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['read']})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Contact, {exclude: 'where'}) filter?: FilterExcludingWhere<Contact>
  ): Promise<Contact> {
    return this.contactRepository.findById(id, filter);
  }

  @patch('/contacts/{id}', {
    responses: {
      '204': {
        description: 'Contact PATCH success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['write']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contact, {partial: true}),
        },
      },
    })
    contact: Contact,
  ): Promise<void> {
    await this.contactRepository.updateById(id, contact);
  }

  @put('/contacts/{id}', {
    responses: {
      '204': {
        description: 'Contact PUT success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['write']})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() contact: Contact,
  ): Promise<void> {
    await this.contactRepository.replaceById(id, contact);
  }

  @del('/contacts/{id}', {
    responses: {
      '204': {
        description: 'Contact DELETE success',
      },
    },
  })
  @authenticate(process.env.AUTH_STRATEGY!)
  @authorize({resource: 'Contact', scopes: ['write']})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.contactRepository.deleteById(id);
  }
}
