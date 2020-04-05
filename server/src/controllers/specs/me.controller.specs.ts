import {OperationObject} from '@loopback/rest';

export const getPatientLeaveRequestsSpec: OperationObject = {
  responses: {
    '200': {
      description: 'Array of PatientLeaveRequestViewModel instances',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  title: 'Leave request ID',
                  examples: ['5e88a6caae35be2a1faca212'],
                },
                leaveReason: {
                  type: 'integer',
                  title: 'Leave reason',
                  examples: [0],
                },
                additionalInfo: {
                  type: 'string',
                  title: 'Additional info',
                  examples: ['Salida para comprar el pan'],
                },
                outOfHomeTimestamp: {
                  type: 'string',
                  title: 'Out of home timestamp',
                  examples: ['2020-04-04T15:24:58.994Z'],
                },
                backToHomeTimestamp: {
                  type: 'string',
                  title: 'Back of home timestamp',
                  examples: ['2020-04-04T15:24:58.994Z'],
                },
                status: {
                  type: 'integer',
                  title: 'Status',
                  examples: [2],
                },
              },
            },
          },
        },
      },
    },
    '400': {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            title: 'Error',
            properties: {
              error: {
                type: 'object',
                default: {},
                examples: [
                  {
                    name: 'Error',
                    statusCode: 400,
                    message: 'No patient id provided',
                  },
                ],
                properties: {
                  statusCode: {
                    type: 'integer',
                    title: 'HTTP status code',
                    examples: [400],
                  },
                  name: {
                    type: 'string',
                    examples: ['Error'],
                  },
                  message: {
                    type: 'string',
                    title: 'Descriptive message',
                    examples: ['No patient id provided'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
