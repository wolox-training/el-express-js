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
    }
  }
};
