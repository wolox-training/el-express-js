const supertest = require('supertest');
const { factory } = require('factory-girl');
const { toBeArrayOfSize, toIncludeAllPartialMembers } = require('jest-extended');
const app = require('../../app');
const { defaultPassword, userErrors } = require('../factory/user_factory');

const request = supertest(app);
expect.extend({ toBeArrayOfSize, toIncludeAllPartialMembers });

describe('/users GET', () => {
  test('Get users must be successful when per_page is equal to totalUsers', async () => {
    const page = 1;
    const per_page = 5;
    const totalUsers = 5;
    const users = await factory.createMany('UserWithHash', totalUsers);
    const loginBody = {
      email: users[0].email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalUsers);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.users).toBeArrayOfSize(totalUsers);
    expect(JSON.parse(JSON.stringify(users))).toIncludeAllPartialMembers(response.body.users);
  });
  test('Get users must be successful when per_page is greather than totalUsers', async () => {
    const page = 1;
    const per_page = 10;
    const totalUsers = 5;
    const users = await factory.createMany('UserWithHash', totalUsers);
    const loginBody = {
      email: users[0].email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalUsers);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.users).toBeArrayOfSize(totalUsers);
    expect(JSON.parse(JSON.stringify(users))).toIncludeAllPartialMembers(response.body.users);
  });
  test('Get users must be successful when per_page is less than totalUsers', async () => {
    const page = 1;
    const per_page = 2;
    const totalUsers = 5;
    const users = await factory.createMany('UserWithHash', totalUsers);
    const loginBody = {
      email: users[0].email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalUsers);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.users).toBeArrayOfSize(per_page);
    expect(JSON.parse(JSON.stringify(users))).toIncludeAllPartialMembers(response.body.users);
  });

  test('Get users when token is missing must fail', async () => {
    const response = await request.get('/users');
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject(userErrors.tokenRequired);
  });
  test('Get users when token is invalid must fail', async () => {
    const response = await request.get('/users').set('Authorization', 'Bearer invalid:token');
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject(userErrors.tokenInvalid);
  });

  test('Get users without page in query must use 1 by default', async () => {
    const per_page = 10;
    const user = await factory.create('UserWithHash');
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ per_page });
    expect(response.statusCode).toBe(200);
    expect(response.body.per_page).toBe(per_page);
    expect(response.body.page).toBe(1);
  });
  test('Get users without per_page in query must use 10 by default', async () => {
    const page = 10;
    const user = await factory.create('UserWithHash');
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ page });
    expect(response.statusCode).toBe(200);
    expect(response.body.page).toBe(page);
    expect(response.body.per_page).toBe(10);
  });

  test('Get user when page is string must fail', async () => {
    const page = 'string:page';
    const per_page = 10;
    const user = await factory.create('UserWithHash');
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.pageNumeric);
  });
  test('Get user when per_page is string must fail', async () => {
    const page = 10;
    const per_page = 'string:per_page';
    const user = await factory.create('UserWithHash');
    const loginBody = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginBody);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .query({ page, per_page });
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.perPageNumeric);
  });
});
