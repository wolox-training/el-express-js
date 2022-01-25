const supertest = require('supertest');
const { factory } = require('factory-girl');
const { toBeDateString } = require('jest-extended');
const { userErrors } = require('../factory/user_factory');
const app = require('../../app');

const request = supertest(app);
const { jwtEncode } = require('../../app/helpers/auth');
const { userSerializer } = require('../../app/serializer/users');
const { userFindByPk } = require('../../app/services/users');

expect.extend({ toBeDateString });
let user = null;
let jwtToken = null;

beforeEach(async () => {
  user = await factory.create('UserWithHash');
  jwtToken = jwtEncode(userSerializer(user));
});

describe('/users/sessions/invalidate_all POST', () => {
  test('Invalidate sessions must be success', async () => {
    const response = await request
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${jwtToken}`);
    const { id: userId } = user;
    const { tokens_expired: tokensExpired } = await userFindByPk(userId);
    expect(response.statusCode).toBe(200);
    expect(tokensExpired).toBeDateString();
  });
  test('Invalidate sessions should expire tokens', async () => {
    const responseFirstTry = await request
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${jwtToken}`);
    const responseSecondTry = await request
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(responseFirstTry.statusCode).toBe(200);
    expect(responseSecondTry.statusCode).toBe(401);
    expect(responseSecondTry.body).toMatchObject(userErrors.tokenExpired);
  });

  test('Invalidate token with different token must be success', async () => {
    const responseFirstTry = await request
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${jwtToken}`);
    const newToken = jwtEncode(userSerializer(user));
    const responseSecondTry = await request
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${newToken}`);
    expect(responseFirstTry.statusCode).toBe(200);
    expect(responseSecondTry.statusCode).toBe(200);
  });
});
