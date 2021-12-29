const supertest = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../app');
const { userData, userErrors } = require('../factory/user_factory');

const request = supertest(app);

describe('/users POST', () => {
  test('Create user must be success', async () => {
    const { newUser: user, responseWhenUserIsCreated: userResponse } = userData;
    const response = await request.post('/users').send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(userResponse);
  });
  test('Create user when email exists must fail', async () => {
    const { newUser: user } = userData;
    const userCreated = await factory.create('UserWithHash');
    const response = await request.post('/users').send({ ...user, email: userCreated.email });
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.emailExists);
  });
  test('Create user when password is numeric must fail', async () => {
    const { userPasswordNumeric: userInvalidPassword } = userData;
    const response = await request.post('/users').send(userInvalidPassword);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.passwordInvalid);
  });
  test('Create user when password is alphabetic must fail', async () => {
    const { userPasswordAlphabetic: userInvalidPassword } = userData;
    const response = await request.post('/users').send(userInvalidPassword);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.passwordInvalid);
  });
  test('Create user when password is less than 8 characters', async () => {
    const { userPasswordMinLength: userInvalidPassword } = userData;
    const response = await request.post('/users').send(userInvalidPassword);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.passwordMinLength);
  });
  test('Create user without email must fail', async () => {
    const { userWithoutEmail } = userData;
    const response = await request.post('/users').send(userWithoutEmail);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.emailRequired);
  });
  test('Create user without name must fail', async () => {
    const { userWithoutName } = userData;
    const response = await request.post('/users').send(userWithoutName);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.nameRequired);
  });
  test('Create user without surname must fail', async () => {
    const { userWithoutSurname } = userData;
    const response = await request.post('/users').send(userWithoutSurname);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.surnameRequired);
  });
  test('create user without password must fail', async () => {
    const { userWithoutPassword } = userData;
    const response = await request.post('/users').send(userWithoutPassword);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.passwordRequired);
  });
  test('Create user without parameters must fail', async () => {
    const { userWithoutParameters } = userData;
    const response = await request.post('/users').send(userWithoutParameters);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(userErrors.nameRequired);
  });
});
