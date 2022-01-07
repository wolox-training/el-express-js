// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signIn, getUsers } = require('./controllers/users.controller');
const { userSchema, signInSchema } = require('./schemas/user_schema');
const { paginationSchema } = require('./schemas/pagination_schema');
const { validOrAbort } = require('./middlewares/validate_request');
const { checkAuth } = require('./middlewares/auth');
const { weetCreate, getWeets } = require('./controllers/weets.controller');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [validOrAbort(userSchema)], signUp);
  app.get('/users', [checkAuth, validOrAbort(paginationSchema)], getUsers);
  app.post('/users/sessions', [validOrAbort(signInSchema)], signIn);
  app.post('/weets', [checkAuth], weetCreate);
  app.get('/weets', [checkAuth, validOrAbort(paginationSchema)], getWeets);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
