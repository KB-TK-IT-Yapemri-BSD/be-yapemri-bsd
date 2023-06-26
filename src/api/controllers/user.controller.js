const { AsyncParser } = require('@json2csv/node');

const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    // const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id');

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get download user list
 * @public
 */
exports.download = async (req, res, next) => {
  try {
    const params = req.query || {};
    const users = await User.listDownload(params);
    const transformedUsers = users.map((user) => user.transform());

    if (transformedUsers.length !== 0) {
      const opts = {};
      const transformOpts = {};
      const asyncOpts = {};
      const parser = new AsyncParser(opts, transformOpts, asyncOpts);
      const csv = await parser.parse(transformedUsers).promise();

      if (params.start && params.end) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + `user_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
      } else if (!params.start && params.end) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + `user_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
      } else if (!params.end && params.start) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + `user_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
      } else {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'user_report_all.csv' + '\"');
      }

      res.status(200).send(csv);
    } else if (transformedUsers.length === 0) {
      res.status(400).send();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
