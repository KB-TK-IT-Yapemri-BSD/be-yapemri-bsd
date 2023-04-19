const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../errors/api-error');

const ADMIN = 'admin';
const PARENTS = 'parents';
const PRINCIPAL = 'principal';
const TEACHERS = 'teachers';

const LOGGED_USER = '_loggedUser';

const ROLE1 = ['teachers', 'admin'];

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }

  // if (roles === LOGGED_USER) {
  //   if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
  //     apiError.status = httpStatus.FORBIDDEN;
  //     apiError.message = 'Forbidden 1';
  //     return next(apiError);
  //   }
  // } else if (!roles.includes(user.role)) {
  //   apiError.status = httpStatus.FORBIDDEN;
  //   apiError.message = 'Forbidden 2';
  //   return next(apiError);
  // } else if (err || !user) {
  //   return next(apiError);
  // }

  if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    // apiError.message = user.role + " " + roles;
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;
exports.PARENTS = PARENTS;
exports.PRINCIPAL = PRINCIPAL;
exports.TEACHERS = TEACHERS;

exports.LOGGED_USER = LOGGED_USER;

exports.ROLE1 = ROLE1;

exports.authorize = (roles = User.roles) => (req, res, next) => passport.authenticate(
  'jwt', { session: false },
  handleJWT(req, res, next, roles),
)(req, res, next);

exports.oAuth = (service) => passport.authenticate(service, { session: false });
