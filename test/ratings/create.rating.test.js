const supertest = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../app');
const { weetErrors } = require('../factory/weet_factory');
const { checkAuth } = require('../../app/middlewares/auth');
const { User } = require('../../app/models');

const request = supertest(app);
jest.mock('../../app/middlewares/auth');
let authMock = null;
let weet = null;
beforeEach(async () => {
  weet = await factory.create('WeetNew');
  checkAuth.mockClear();
  // eslint-disable-next-line global-require
  authMock = require('../mocks/checkout.middleware');
});

describe('/weets/:id/rating POST', () => {
  test('Create rating should be success and must increase the user score by 1', async () => {
    const score = 1;
    const ratingRequest = {
      score
    };
    const { user_id: userId, id: weetId } = weet;
    const userBeforeRating = await User.findByPk(userId);
    const response = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const userAfterRating = await User.findByPk(userId);
    expect(response.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score + 1);
  });
  test('Create rating should be success and must decrease user score by 1', async () => {
    const score = -1;
    const ratingRequest = {
      score
    };
    const { user_id: userId, id: weetId } = weet;
    const userBeforeRating = await User.findByPk(userId);
    const response = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const userAfterRating = await User.findByPk(userId);
    expect(response.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score - 1);
  });
  test('Create rating when rating exist with same score does not add any value to the user', async () => {
    const user = await factory.create('UserWithHash');
    const score = 1;
    const ratingRequest = {
      score
    };
    checkAuth
      .mockImplementationOnce(authMock.checkAuthOnce(user))
      .mockImplementationOnce(authMock.checkAuthOnce(user));

    const { user_id: userId, id: weetId } = weet;
    const responseFirstTry = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const userFirstTry = await User.findByPk(userId);
    const responseSecondTry = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const userSecondTry = await User.findByPk(userId);
    expect(responseFirstTry.statusCode).toBe(201);
    expect(responseSecondTry.statusCode).toBe(201);
    expect(userFirstTry.score).toBe(userSecondTry.score);
  });

  test('Create rating when score is less than -1', async () => {
    const ratingRequest = {
      score: -100
    };
    const { id: weetId } = weet;
    const response = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(weetErrors.scoreInvalidRange);
  });
  test('Create rating when score is greater than 1', async () => {
    const ratingRequest = {
      score: 100
    };
    const { id: weetId } = weet;
    const response = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(weetErrors.scoreInvalidRange);
  });
  test('Create rating with different user should increase the score', async () => {
    const ratingRequest = {
      score: 1
    };
    const { user_id: userId, id: weetId } = weet;
    const userBeforeRating = await User.findByPk(userId);
    const firstRatingResponse = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const secondRatingResponse = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const userAfterRating = await User.findByPk(userId);
    expect(firstRatingResponse.statusCode).toBe(201);
    expect(secondRatingResponse.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score + 2);
  });
  test('Create rating with different user should decrease score', async () => {
    const ratingRequest = {
      score: -1
    };
    const { user_id: userId, id: weetId } = weet;
    const userBeforeRating = await User.findByPk(userId);
    const firstRatingResponse = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const secondRatingResponse = await request.post(`/weets/${weetId}/ratings`).send(ratingRequest);
    const userAfterRating = await User.findByPk(userId);
    expect(firstRatingResponse.statusCode).toBe(201);
    expect(secondRatingResponse.statusCode).toBe(201);
    expect(userAfterRating.score).toBe(userBeforeRating.score - 2);
  });
  test('Create rating when weet does not exist must fail', async () => {
    const ratingRequest = {
      score: -1
    };
    const { id: weetId } = weet;
    const response = await request.post(`/weets/${weetId + 100}/ratings`).send(ratingRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(weetErrors.weetDoesNotExist);
  });
});
