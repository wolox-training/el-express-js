const supertest = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../app');
const { userData, defaultPassword, userErrors } = require('../factory/user_factory');
const { ADMIN_ROLE } = require('../../app/constants/users');
const { userSerializer } = require('../../app/serializer/users');

const request = supertest(app);

describe('/admin/users POST', () => {
  test('Create admin user must be successful when email does not exists', async () => {
    const { newUser: user, responseWhenAdminIsCreated: adminResponse } = userData;
    const userLogin = await factory.create('Admin');
    const requestLogin = {
      email: userLogin.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .post('/admin/users')
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(adminResponse);
  });
  test('Create admin user must be successful when email exists and should change role to admin', async () => {
    const userLogin = await factory.create('Admin');
    const userRegular = await factory.create('UserWithHash');
    const requestLogin = {
      email: userLogin.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const userRequest = {
      ...userRegular.toJSON(),
      password: defaultPassword
    };
    const response = await request
      .post('/admin/users')
      .send(userRequest)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ ...userSerializer(userRegular.toJSON()), role: ADMIN_ROLE });
  });
  test('Create admin without admin role must fail', async () => {
    const { newUser: user } = userData;
    const userRegular = await factory.create('UserWithHash');
    const requestLogin = {
      email: userRegular.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .post('/admin/users')
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject(userErrors.forbidden);
  });
  test('Create admin with invalid token must fail', async () => {
    const { newUser: user } = userData;
    const response = await request
      .post('/admin/users')
      .set('Authorization', 'Bearer invalid:token')
      .send(user);
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject(userErrors.tokenInvalid);
  });
  test('Create admin user without name must fail', async () => {
    const { userWithoutName: admin } = userData;
    const userLogin = await factory.create('Admin');
    const requestLogin = {
      email: userLogin.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .post('/admin/users')
      .send(admin)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.nameRequired);
  });
  test('Create admin user without surname must fail', async () => {
    const { userWithoutSurname: admin } = userData;
    const userLogin = await factory.create('Admin');
    const requestLogin = {
      email: userLogin.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .post('/admin/users')
      .send(admin)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.surnameRequired);
  });
  test('Create admin user without email must fail', async () => {
    const { userWithoutEmail: admin } = userData;
    const userLogin = await factory.create('Admin');
    const requestLogin = {
      email: userLogin.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .post('/admin/users')
      .send(admin)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.emailRequired);
  });
  test('Create admin user without password must fail', async () => {
    const { userWithoutPassword: admin } = userData;
    const userLogin = await factory.create('Admin');
    const requestLogin = {
      email: userLogin.email,
      password: defaultPassword
    };
    const responseLogin = await request.post('/users/sessions').send(requestLogin);
    const {
      body: { token }
    } = responseLogin;
    const response = await request
      .post('/admin/users')
      .send(admin)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.passwordRequired);
  });
});
