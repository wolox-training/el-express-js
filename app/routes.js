// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { signUp, getUsers } = require('./controllers/users.controller');
const { userSchema } = require('./schemas/user_schema');
const { paginationSchema } = require('./schemas/pagination_schema');
const { validOrAbort } = require('./middlewares/validate_request');


exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [validOrAbort(userSchema)], signUp);
  app.get('/users',[validOrAbort(paginationSchema)], getUsers);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
