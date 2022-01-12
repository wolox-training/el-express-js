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
  userRole: {
    type: 'string',
    example: 'REGULAR'
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
  UserList: {
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
      role: {
        $ref: '#/components/schemas/userRole'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      page: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/UserList'
        }
      }
    }
  },
  SignIn: {
    type: 'object',
    properties: {
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/userPassword'
      }
    }
  }
};
