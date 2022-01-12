module.exports = {
  '/weets': {
    post: {
      tags: ['CRUD operations'],
      description: 'Create weet',
      operationId: 'createUser',
      responses: {
        201: {
          description: 'New weet was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Weet'
              }
            }
          }
        },
        401: {
          description: 'invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Invalid token',
                internal_code: 'authentication_error'
              }
            }
          }
        },
        500: {
          description: 'invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Server error',
                internal_code: 'server_error'
              }
            }
          }
        }
      }
    },
    get: {
      tags: ['CRUD operations'],
      description: 'Get weets',
      operationId: 'getWeets',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1
          }
        },
        {
          name: 'per_page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 10
          },
          required: false
        }
      ],
      responses: {
        200: {
          description: 'Weets were obtained',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Weets'
              }
            }
          }
        }
      }
    }
  }
};
