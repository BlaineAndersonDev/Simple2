const express = require('express');
const userRouter = express.Router();
const knex = require('../db/knex.js');
const moment = require('moment');
const errorWrapper = require('./errorWrapper.js');
const partnersController = require('./partnersController.js');
const loginsController = require('./loginsController.js');
const surveysController = require('./surveysController.js');
const journalsController = require('./journalsController.js');

// ======================================
// Get all Users.
// ROUTE: GET `/api/users/`
userRouter.get('/', errorWrapper(async (req, res, next) => {
  // Knex database query.
  const readResults = await knex('users')
    .select('*')
    .orderBy('userId', 'asc')
    .catch((err) => { throw new Error(err) });

    // Return HTTP status and JSON results object.
    return res.status(200).json({
      success: true,
      message: 'API returned list of all Users',
      results: readResults
    });
}));

// ======================================
// Get individual User.
// ROUTE: GET `api/users/:userId`
userRouter.get('/:userId', errorWrapper(async (req, res, next) => {
  // Throw Error if body contains userId.
  if (req.body.userId) { throw new Error('Request body cannot contain userId') };

  // Knex database query.
  const readResults = await knex('users')
    .select('*')
    .where({ userId: req.params.userId })
    .catch((err) => { throw new Error(err) });

  // Throw error if User does not exist.
  if (!readResults[0]) { throw new Error("User with provided userId does not exist") };

  // Return HTTP status and JSON results object.
  return res.status(200).json({
    success: true,
    message: 'API returned User with userId of ' + req.params.userId,
    results: readResults[0]
  });
}));

// ======================================
// Create individual User.
// ROUTE: POST `api/users/`
userRouter.post('/', errorWrapper(async (req, res, next) => {
  // Throw Error if body contains userId.
  if (req.body.userId) { throw new Error('Request body cannot contain userId') };

  // Knex database query.
  const createResults = await knex('users')
    .insert({
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      title: req.body.title,
      preferredName: req.body.preferredName,
      datingUppers: req.body.datingUppers,
      datingDowners: req.body.datingDowners,
      premium: req.body.premium,
      profileCreated: req.body.profileCreated,
      createdAt: moment(),
      updatedAt: moment()
    })
    .returning('*')
    .catch((err) => { throw new Error(err) });

    // Return HTTP status and JSON results object.
    return res.status(200).json({
      success: true,
      message: 'API returned newly created User with userId of ' + createResults[0].userId,
      results: createResults[0]
    });
}));

// ======================================
// Updates individual User.
// ROUTE: PUT `api/users/:userId`
userRouter.put('/:userId', errorWrapper(async (req, res, next) => {
  // Throw Error if body contains userId.
  if (req.body.userId) { throw new Error('Request body cannot contain userId') };

  // Knex database query.
  const updateResults = await knex('users')
    .where({ userId: req.params.userId })
    .update({
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      title: req.body.title,
      preferredName: req.body.preferredName,
      datingUppers: req.body.datingUppers,
      datingDowners: req.body.datingDowners,
      premium: req.body.premium,
      profileCreated: req.body.profileCreated,
      updatedAt: moment()
    })
    .returning('*')
    .catch((err) => { throw new Error(err) });

    // Throw error if User does not exist.
    if (!updateResults[0]) { throw new Error("User with provided userId does not exist") };

  // Return HTTP status and JSON results object.
  return res.status(200).json({
    success: true,
    message: 'API returned newly updated User with userId of ' + req.params.userId,
    results: updateResults[0]
  });
}));

// ======================================
// Deletes individual User.
// ROUTE: DELETE `api/users/:userId`
userRouter.delete('/:userId', errorWrapper(async (req, res, next) => {
  // Knex database query.
  const deleteResults = await knex('users')
    .where({ userId: req.params.userId })
    .del()
    .returning('*')
    .catch((err) => { throw new Error(err) });

  // Throw error if User does not exist.
  if (!deleteResults[0]) { throw new Error("User with provided userId does not exist") };

  // Return HTTP status and JSON results object.
  return res.status(200).json({
    success: true,
    message: 'API deleted User with userId of ' + req.params.userId
  });
}));

// ======================================
// Passing onto child routers ===========
// ======================================
// This allows the usersRouter to send requests involving Partners to the partner Controller along with all the required information (i.e. params, body, etc).
  // NOTE: For ALL child routes we require the param of 'userId' in these function, and it will not be passed as a param to any functions in the following router (i.e. the partnersController).
  // This means we will have to send it manually as it's own variable. (i.e. req.userId).
// --------------------------------------
userRouter.use('/:userId/partners', function(req, res, next) {
  // Throw Error if params do not contain userId.
  if (!req.params.userId) { throw new Error('Request params missing userId'); };
  // Set userId into req directly as it will not be passed as a param.
  req.userId = req.params.userId;
  // Continue onto the specified partnersController.js route.
  next()
}, partnersController);

userRouter.use('/:userId/logins', function(req, res, next) {
  // Throw Error if params do not contain userId.
  if (!req.params.userId) { throw new Error('Request params missing userId'); };
  // Set userId into req directly as it will not be passed as a param.
  req.userId = req.params.userId;
  // Continue onto the specified loginsController.js route.
  next()
}, loginsController);

userRouter.use('/:userId/surveys', function(req, res, next) {
  // Throw Error if params do not contain userId.
  if (!req.params.userId) { throw new Error('Request params missing userId'); };
  // Set userId into req directly as it will not be passed as a param.
  req.userId = req.params.userId;
  // Continue onto the specified loginsController.js route.
  next()
}, surveysController);

userRouter.use('/:userId/journals', function(req, res, next) {
  // Throw Error if params do not contain userId.
  if (!req.params.userId) { throw new Error('Request params missing userId'); };
  // Set userId into req directly as it will not be passed as a param.
  req.userId = req.params.userId;
  // Continue onto the specified loginsController.js route.
  next()
}, journalsController);

// ======================================
// ROUTING EXCEPTIONS ===================
// ======================================
// Routes here cannot be properly fitted into the normal ExpressJS CRUD routing flow due to routing restraints and must be run from users instead.
// --------------------------------------
// Route Reason: As all other events routes are child routes of partners, and this route explicitly does not require a partnerId, it has to be run from users directly.
// Get all Events of userId.
// ROUTE: GET `api/users/:userId/events/`
userRouter.get('/:userId/events', errorWrapper(async (req, res, next) => {
  // Throw Error if params do not contain userId.
  if (!req.params.userId) { throw new Error('Request params missing userId'); };
  // Throw Error if body contains userId.
  if (req.body.userId) { throw new Error('Request body cannot contain userId') };
  // Throw Error if body contains eventId.
  if (req.body.eventId) { throw new Error('Request body cannot contain eventId') };

  // Knex database query.
  const readResults = await knex('events')
    .select('*')
    .where({ userId: req.params.userId })
    .orderBy('eventId', 'asc')
    .catch((err) => { throw new Error(err) });

    // Return HTTP status and JSON results object.
    return res.status(200).json({
      success: true,
      message: 'API returned list of all Events for userId ' + req.params.userId,
      results: readResults
    });
}));

// ======================================
module.exports = userRouter;
