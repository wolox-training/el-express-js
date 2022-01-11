module.exports = {
  id: {
    type: 'integer',
    example: 1
  },
  content: {
    type: 'string',
    example: 'the weight in pounds of the biggest pumpkin in the world'
  },
  user_id: {
    type: 'integer',
    example: 3
  },
  Weet: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/id'
      },
      content: {
        $ref: '#/components/schemas/content'
      },
      user_id: {
        $ref: '#/components/schemas/user_id'
      }
    }
  }
};
