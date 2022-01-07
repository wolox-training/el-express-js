const { factory } = require('factory-girl');
const supertest = require('supertest');
const { toBeArrayOfSize, toIncludeAllPartialMembers } = require('jest-extended');
const { defaultPassword, userErrors } = require('../factory/user_factory');
const app = require('../../app');

const request = supertest(app);
expect.extend({ toBeArrayOfSize, toIncludeAllPartialMembers });

require('../factory/weet_factory');

describe('/weets GET', () => {
  test('Get weets must be successful when per_page is equal to totalWeets', async () => {
    const totalWeets = 5;
    const page = 1;
    const per_page = 5;
    const user = await factory.create('UserWithHash');
    const weets = await factory.createMany('WeetNew', totalWeets);
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .get('/weets')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalWeets);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.weets).toBeArrayOfSize(totalWeets);
    expect(JSON.parse(JSON.stringify(weets))).toIncludeAllPartialMembers(response.body.weets);
  });
  test('Get weets must succesful when per_page is greather than totalWeets', async () => {
    const page = 1;
    const per_page = 10;
    const totalWeets = 5;
    const user = await factory.create('UserWithHash');
    const weets = await factory.createMany('WeetNew', totalWeets);
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/weets')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalWeets);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.weets).toBeArrayOfSize(totalWeets);
    expect(JSON.parse(JSON.stringify(weets))).toIncludeAllPartialMembers(response.body.weets);
  });
  test('Get weets must successful when per_page is less than totalWeets', async () => {
    const page = 1;
    const per_page = 2;
    const totalWeets = 5;
    const user = await factory.create('UserWithHash');
    const weets = await factory.createMany('WeetNew', totalWeets);
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .get('/weets')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalWeets);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.weets).toBeArrayOfSize(per_page);
    expect(JSON.parse(JSON.stringify(weets))).toIncludeAllPartialMembers(response.body.weets);
  });
  test('GET weets when token is invalid must fail', async () => {
    const response = await request.get('/weets').set('Authorization', 'Bearer invalid:token');
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject(userErrors.tokenInvalid);
  });
});
