// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signIn } = require('./controllers/users.controller');
const { userSchema, signInSchema } = require('./schemas/user_schema');
const { validOrAbort } = require('./middlewares/validate_request');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [validOrAbort(userSchema)], signUp);
  app.post('/users/sessions', [validOrAbort(signInSchema)], signIn);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
