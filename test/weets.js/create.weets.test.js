const supertest = require('supertest');
const { factory } = require('factory-girl');
const { toContainKeys } = require('jest-extended');
const { getSentence } = require('../../app/services/numbers');
const app = require('../../app');
const { defaultPassword, userErrors } = require('../factory/user_factory');
const { weetData } = require('../factory/weet_factory');
const errors = require('../../app/errors');
const { defaultErrorResponse } = require('../helpers/errors');
const { DEFAULT_ERROR } = require('../../app/constants/errors');

expect.extend({ toContainKeys });

const request = supertest(app);
jest.mock('../../app/services/numbers');

beforeEach(() => {
  getSentence.mockClear();
  // eslint-disable-next-line global-require
  require('../mocks/numbers.mock');
});

describe('/weets POST', () => {
  test('Create weet must be success', async () => {
    const user = await factory.create('UserWithHash');
    const userId = user.id;
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(loginBody);
    const { token } = responseLogin.body;
    const response = await request.post('/weets').set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toContainKeys(['user_id', 'id', 'content']);
    expect(response.body.user_id).toBe(userId);
  });
  test('Create weet with content 140 in length must fail', async () => {
    const user = await factory.create('UserWithHash');
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    getSentence.mockReturnValueOnce(Promise.resolve(weetData.weetContentError));
    const responseLogin = await request.post('/users/sessions').send(loginBody);
    const { token } = responseLogin.body;
    const response = await request.post('/weets').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(defaultErrorResponse());
  });

  test('Create weet when sevice does not work must fail', async () => {
    const user = await factory.create('UserWithHash');
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(loginBody);
    const { token } = responseLogin.body;
    getSentence.mockRejectedValueOnce(errors.defaultError(DEFAULT_ERROR));
    const response = await request.post('/weets').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(defaultErrorResponse());
  });
  test('Create with token invalid must fail', async () => {
    const response = await request.post('/weets').set('Authorization', 'Bearer invalid:token');
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject(userErrors.tokenInvalid);
  });
});
