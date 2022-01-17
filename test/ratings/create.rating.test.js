const supertest = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../app');
const { find } = require('../helpers/body');
const { weetErrors } = require('../factory/weet_factory');
const { defaultPassword, userErrors } = require('../factory/user_factory');

const request = supertest(app);
describe('/weets/:id/rating POST', () => {
  test('Create rating should be success and must increase the user score by 1', async () => {
    const weet = await factory.create('WeetNew');
    const user = await factory.create('UserWithHash');
    const score = 1;
    const loginRequest = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginRequest);
    const {
      body: { token }
    } = loginResponse;
    const ratingRequest = {
      score
    };
    const responseUserBeforeRating = await request.get('/users').set('Authorization', `Bearer ${token}`);
    const response = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    const responseUserAfterRating = await request.get('/users').set('Authorization', `Bearer ${token}`);
    const userBeforeRating = find('id', weet.user_id)(responseUserBeforeRating.body.page);
    const userAfterRating = find('id', weet.user_id)(responseUserAfterRating.body.page);
    expect(userAfterRating.score).toBe(userBeforeRating.score + 1);
  });
  test('Create rating should be success and must decrease user score by 1', async () => {
    const weet = await factory.create('WeetNew');
    const user = await factory.create('UserWithHash');
    const score = -1;
    const loginRequest = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginRequest);
    const {
      body: { token }
    } = loginResponse;
    const ratingRequest = {
      score
    };
    const responseUserBeforeRating = await request.get('/users').set('Authorization', `Bearer ${token}`);
    const response = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${token}`);
    const responseUserAfterRating = await request.get('/users').set('Authorization', `Bearer ${token}`);
    const userBeforeRating = find('id', weet.user_id)(responseUserBeforeRating.body.page);
    const userAfterRating = find('id', weet.user_id)(responseUserAfterRating.body.page);
    expect(response.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score - 1);
  });
  test('Create rating when rating exist with same score does not add any value to the user', async () => {
    const weet = await factory.create('WeetNew');
    const user = await factory.create('UserWithHash');
    const score = 1;
    const loginRequest = {
      email: user.email,
      password: defaultPassword
    };
    const loginResponse = await request.post('/users/sessions').send(loginRequest);
    const {
      body: { token }
    } = loginResponse;
    const ratingRequest = {
      score
    };
    const responseFirstTry = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${token}`);
    const responseUserFirstTry = await request.get('/users').set('Authorization', `Bearer ${token}`);
    const responseSecondTry = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${token}`);
    const responseUserSecondTry = await request.get('/users').set('Authorization', `Bearer ${token}`);
    const userFirstTry = find('id', weet.user_id)(responseUserFirstTry.body.page);
    const userSecondTry = find('id', weet.user_id)(responseUserSecondTry.body.page);
    expect(responseFirstTry.statusCode).toBe(201);
    expect(responseSecondTry.statusCode).toBe(201);
    expect(userFirstTry.score).toBe(userSecondTry.score);
  });

  test('Create rating when token is invalid must fail', async () => {
    const weet = await factory.create('WeetNew');
    const response = await request
      .post(`/weets/${weet.id}/ratings`)
      .set('Authorization', 'Bearer invalid:token');
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject(userErrors.tokenInvalid);
  });

  test('Create rating when score is less than -1', async () => {
    const weet = await factory.create('WeetNew');
    const user = await factory.create('UserWithHash');
    const loginRequest = {
      email: user.email,
      password: defaultPassword
    };
    const ratingRequest = {
      score: -100
    };
    const loginResponse = await request.post('/users/sessions').send(loginRequest);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(weetErrors.scoreInvalidRange);
  });
  test('Create rating when score is greater than 1', async () => {
    const weet = await factory.create('WeetNew');
    const user = await factory.create('UserWithHash');
    const loginRequest = {
      email: user.email,
      password: defaultPassword
    };
    const ratingRequest = {
      score: 100
    };
    const loginResponse = await request.post('/users/sessions').send(loginRequest);
    const {
      body: { token }
    } = loginResponse;
    const response = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(weetErrors.scoreInvalidRange);
  });
  test('Create rating with different user should increase the score', async () => {
    const weet = await factory.create('WeetNew');
    const users = await factory.createMany('UserWithHash', 2);
    const firstUser = users.pop();
    const secondUser = users.pop();
    const firstLoginRequest = {
      email: firstUser.email,
      password: defaultPassword
    };
    const secondLoginRequest = {
      email: secondUser.email,
      password: defaultPassword
    };
    const ratingRequest = {
      score: 1
    };
    const firstLoginResponse = await request.post('/users/sessions').send(firstLoginRequest);
    const secondLoginResponse = await request.post('/users/sessions').send(secondLoginRequest);
    const {
      body: { token: firstToken }
    } = firstLoginResponse;
    const {
      body: { token: secondToken }
    } = secondLoginResponse;
    const userBeforeRatingResponse = await request.get('/users').set('Authorization', `Bearer ${firstToken}`);
    const userBeforeRating = find('id', weet.user_id)(userBeforeRatingResponse.body.page);
    const firstRatingResponse = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${firstToken}`);
    const secondRatingResponse = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${secondToken}`);
    const userAfterRatingResponse = await request.get('/users').set('Authorization', `Bearer ${firstToken}`);
    const userAfterRating = find('id', weet.user_id)(userAfterRatingResponse.body.page);
    expect(firstRatingResponse.statusCode).toBe(201);
    expect(secondRatingResponse.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score + 2);
  });
  test('Create rating with different user should decrease score', async () => {
    const weet = await factory.create('WeetNew');
    const users = await factory.createMany('UserWithHash', 2);
    const firstUser = users.pop();
    const secondUser = users.pop();
    const firstLoginRequest = {
      email: firstUser.email,
      password: defaultPassword
    };
    const secondLoginRequest = {
      email: secondUser.email,
      password: defaultPassword
    };
    const ratingRequest = {
      score: -1
    };
    const firstLoginResponse = await request.post('/users/sessions').send(firstLoginRequest);
    const secondLoginResponse = await request.post('/users/sessions').send(secondLoginRequest);
    const {
      body: { token: firstToken }
    } = firstLoginResponse;
    const {
      body: { token: secondToken }
    } = secondLoginResponse;
    const userBeforeRatingResponse = await request.get('/users').set('Authorization', `Bearer ${firstToken}`);
    const userBeforeRating = find('id', weet.user_id)(userBeforeRatingResponse.body.page);
    const firstRatingResponse = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${firstToken}`);
    const secondRatingResponse = await request
      .post(`/weets/${weet.id}/ratings`)
      .send(ratingRequest)
      .set('Authorization', `Bearer ${secondToken}`);
    const userAfterRatingResponse = await request.get('/users').set('Authorization', `Bearer ${firstToken}`);
    const userAfterRating = find('id', weet.user_id)(userAfterRatingResponse.body.page);
    expect(firstRatingResponse.statusCode).toBe(201);
    expect(secondRatingResponse.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score - 2);
  });
});
