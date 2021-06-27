const {
    body, param, query, sanitizeBody,
  } = require('express-validator');
  
  const User = require('../models/userModel');
  const { responseHandler, throwValidationResults } = require('../middlewares/common');
  const cache = require('../middlewares/cache');
  
  const userController = {
    findAllUsers: [
      cache.get,
  
      query('limit').toInt(),
      query('offset').toInt(),
  
      (req, res, next) => {
        User.find({}, {}, {
          skip: req.query.offset,
          limit: req.query.limit,
        })
          .then((users) => {
            res.locals.data = users;
  
            next();
          })
          .catch(next);
      },
  
      cache.set,
  
      responseHandler,
    ],
    findUserById: [
      cache.get,
  
      param('id').isMongoId(),
  
      throwValidationResults,
  
      (req, res, next) => {
        User.findById(req.params.id)
          .then((user) => {
            if (!user) {
              const err = new Error('Author not found for the given ObjectId');
              err.name = 'NotFoundError';
              throw err;
            }
  
            res.locals.data = user;
  
            next();
          })
          .catch(next);
      },
  
      cache.set,
  
      responseHandler,
    ],
    createUser: [
      body('name').isString().trim().isLength({ max: 100 }),
      body('email').isString().trim().isLength({ max: 100 }),
  
      sanitizeBody('*').escape(),
  
      throwValidationResults,
  
      (req, res, next) => {
        User.create(req.body)
          .then((user) => {
            res.locals.data = user;
  
            next();
          })
          .catch(next);
      },
  
      cache.clear,
  
      responseHandler,
    ],
    updateUser: [
      param('id').isMongoId(),
  
      body('name').optional({ checkFalsy: true }).isString().trim()
        .isLength({ max: 100 }),
      body('email').optional({ checkFalsy: true }).isString().trim()
        .isLength({ max: 100 }),
  
      sanitizeBody('*').escape(),
  
      throwValidationResults,
  
      (req, res, next) => {
        const { id } = req.params;
        const replacement = req.body;
        const options = {
          new: true,
          useFindAndModify: false,
        };
  
        User.findByIdAndUpdate(id, replacement, options)
          .then((user) => {
            if (!user) {
              const err = new Error('Author not found for the given ObjectId');
              err.name = 'NotFoundError';
              throw err;
            }
  
            res.locals.data = user;
  
            next();
          })
          .catch(next);
      },
  
      cache.clear,
  
      responseHandler,
    ],
    deleteUser: [
      param('id').isMongoId(),
  
      throwValidationResults,
  
      (req, res, next) => {
        User.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(204);
            res.locals.data = {};
  
            next();
          })
          .catch(next);
      },
  
      cache.clear,
  
      responseHandler,
    ],
  };
  
  module.exports = userController;
  