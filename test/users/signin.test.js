const supertest = require('supertest');
const { factory } = require('factory-girl');
const { toContainKey, toBeString } = require('jest-extended');
const app = require('../../app');
const { defaultPassword, userErrors, userData } = require('../factory/user_factory');

const request = supertest(app);

expect.extend({ toContainKey, toBeString });

describe('/users/session POST', () => {
  test('SignIn must be sucess', async () => {
    const user = await factory.create('UserWithHash');
    const body = {
      email: user.email,
      password: defaultPassword
    };
    const response = await request.post('/users/sessions').send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toContainKey('token');
    expect(response.body.token).toBeString();
  });

  test('SignIn without Email must fail', async () => {
    const { userWithoutEmail } = userData;
    const response = await request.post('/users/sessions').send(userWithoutEmail);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.emailRequired);
  });
  test('SignIn without password must fail', async () => {
    const { userWithoutPassword } = userData;
    const response = await request.post('/users/sessions').send(userWithoutPassword);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.passwordRequired);
  });
  test('SignIn when email does not exists must fail', async () => {
    const { newUser: user } = userData;
    const response = await request.post('/users/sessions').send(user);
    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject(userErrors.emailOrPassworDontMatch);
  });
  test('SignIn when password does not match must fail', async () => {
    const user = await factory.create('UserWithHash');
    const body = {
      email: user.email,
      password: 'wrongPassword1234567'
    };
    const response = await request.post('/users/sessions').send(body);
    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject(userErrors.emailOrPassworDontMatch);
  });
});
