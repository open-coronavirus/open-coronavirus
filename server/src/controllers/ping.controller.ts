import {get, param, Request, ResponseObject, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/context';
import {service} from "@loopback/core";
import {PushNotificationService} from "../services/pushnotification.service";

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

const HEARTBEAT_RESPONSE: ResponseObject = {
  description: 'Heartbeat Response',
  content: {
    'application/json': {
      schema: {
        type: 'string'
      },
    },
  },
};

const PUSH_RESPONSE: ResponseObject = {
  description: 'Push Response',
  content: {
    'application/json': {
      schema: {
        type: 'string'
      },
    },
  },
};

export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {

  constructor(@inject(RestBindings.Http.REQUEST) private req: Request,
              @service( 'PushNotificationService') protected pushNotificationService: PushNotificationService
              ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  // Map to `GET /ping`
  @get('/heartbeat', {
    responses: {
      '200': HEARTBEAT_RESPONSE,
    },
  })
  heartbeat(): string {
    // Reply with a greeting, the current time, the url, and request headers
    return "OK";
  }

  // Map to `GET /ping`
  @get('/push', {
    responses: {
      '200': PUSH_RESPONSE,
    },
  })
  push(
      @param.query.string('deviceId') deviceId: string,
  ): string {
    this.pushNotificationService.sendNotification([deviceId], 'hello', 'hello neng');
    // Reply with a greeting, the current time, the url, and request headers
    return "OK";
  }

}
