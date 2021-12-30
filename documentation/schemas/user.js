module.exports = {
  username: {
    type: 'string',
    example: 'Edilson'
  },
  userSurname: {
    type: 'string',
    example: 'Londoño'
  },
  userEmail: {
    type: 'string',
    example: 'edilson.londono@wolox.com.co'
  },
  userPassword: {
    type: 'string',
    example: 'abCdE1234556'
  },
  User: {
    type: 'object',
    properties: {
      name: {
        $ref: '#/components/schemas/username'
      },
      surname: {
        $ref: '#/components/schemas/userSurname'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/userPassword'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  }
};
