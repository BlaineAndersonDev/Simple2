# A Simple Node Server

### Create a Simple Node API Server (with a minimal frontend)

##### Create the basics
  * Create a new directory.
    * `mkdir <DirName>`
  * Enter new directory.
    * `cd <DirName>`
  * Create the base server.
    * `touch server.js`
    * Copy and paste the following into server.js:
    ```
    // =====================================
    // Base Imports ========================
    // =====================================
    // Allows use of backend routing.
    // https://expressjs.com/
    const express = require('express');
    // Path allows our Server to find build files stored in our frontend.
    // https://nodejs.org/api/path.html
    const path = require('path');
    // Helmet helps you secure your Express apps by setting various HTTP headers.
    // https://helmetjs.github.io/
    const helmet = require('helmet')
    // HTTP request logger
    // https://github.com/expressjs/morgan
    const morgan = require('morgan')

    // =====================================
    // Initial Setup =======================
    // =====================================
    // Initialize the 'app' using 'express'.
    const app = express();
    // Use the provided PORT if it exists else default to PORT 5000.
    const port = process.env.PORT || 5000;
    // Allows the app to parse 'application/json' request bodies.
    app.use(express.json());
    // Allows the app to parse 'x-ww-form-urlencoded' request bodies.
    app.use(express.urlencoded({ extended: false }));
    // Tells the app to use files in the Client's 'build' folder when rendering static pages (production pages).
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Logs all HTTP actions to the console (Only runs in 'development').
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan(':method :url {HTTP Status: :status} {Content Length: :res[content-length]} {Response Time: :response-time ms}'))
    }
    // Increase App API security by setting Headers using Helemt.
    app.use(helmet())

    // =====================================
    // Router Setup ========================
    // =====================================
    // The app will use the required files below to generate API routes that allows the frontend to use HTTP calls (Axios) to retrieve data from the predetermined end points.
    app.use('/api/object/examples', require('./controllers/exampleObjectController.js'));

    // =====================================
    // Error Handling ======================
    // =====================================
    // Gets called because of `errorWrapper.js` in the controllers directory.
    // End all function for all errors.
    app.use(function(err, req, res, next) {
      // Example of specific error handling. Currently unused.
        // if (error instanceof ReferenceError) {}
      if (process.env.NODE_ENV === 'production') {
        res.status(500)
      } else {
        if (!err.name) {
          res.status(500).json({
            success: false,
            name: 'Blank Error',
            message: 'If this error is displayed, then you likely used `next()` without specifiying anything.'
          });
        } else {
          // Check for test ENV. If true then output only JSON.
          if (process.env.NODE_ENV === 'test') {
            res.status(500).json({
              success: false,
              name: err.name,
              message: err.message
            });
          } else {
            console.log('=================================');
            console.log('========= ERROR RESULTS =========');
            console.log('---------------------------------');
            console.log(err.name);
            console.log(err.message);
            console.log('=================================');
            // console.log(err.stack);
            res.status(500).json({
              success: false,
              name: err.name,
              message: err.message
            });
          };
        };
      };
    });

    // =====================================
    // Final Steps =========================
    // =====================================
    // Tells the app what port to listen on and the NODE_ENV. Upon listening it will display a console log. Upon close it will close and exit the server process.
    app.listen(port, () => console.log('Listening on port ' + port + ' | NODE_ENV: ' + process.env.NODE_ENV));
    // Exports the `app` to be used elsewhere in the project.
    module.exports = app
    ```
  * Create a readme.
    * `touch readme.md`
  * Create you Package (npm/yarn).
    * `yarn init -y`
    * `-y` Accepts all default options and skips the installer.
    * Copy and paste the following into .gitignore:
    ```
    {
      "name": "Simple API",
      "version": "1.0.0",
      "main": "index.js",
      "license": "MIT",
      "dependencies": {
        "express": "^4.17.1",
        "helmet": "^3.21.1",
        "morgan": "^1.9.1",
        "node": "^12.11.1",
        "path": "^0.12.7"
      },
      "scripts": {
        "dev": "NODE_ENV=development node server.js",
        "start": "NODE_ENV=production node server.js"
      }
    }
    ```
  * Initiate Git.
    * `git init`
  * Create .gitignore.
    * `touch .gitignore`
    * Copy and paste the following into .gitignore:
    ```
    # Dependency directories
    node_modules
    yarn.lock

    # dotenv environment variables file
    .env
    ```
  * Install Express.
    * `yarn add express`
  * Install Node.
    * `yarn add node`
  * Install Morgan.
    * `yarn add morgan`
  * Install Helmet.
    * `yarn add helmet`
  * Install Path.
    * `yarn add path`
  * Crate a controllers directory.
    * `mkdir controllers`
  * Create controller for our examples in controllers directory.
    * `touch controllers/exampleObjectController.js`
    * Copy and paste the following into exampleObjectController.js:
    ```
    // ======================================
    // ======================================
    // This controller manipulates a single object using RESTful routes.
    // These routes include error catching and Object based returns.
    // ======================================
    // ======================================

    const express = require('express');
    const exampleObjectRouter = express.Router();
    const errorWrapper = require('./errorWrapper.js');

    // ======================================
    // The object to manipulate in place of read/write to a database.
    const helloWorld = [
      {id: 1, message: 'Hello World!'},
      {id: 2, message: 'This is pretty cool.'},
      {id: 3, message: 'You got this working!'},
      {id: 4, message: 'Amazing job!'}
    ]

    // ======================================
    // Get all Examples.
    // ROUTE: GET `/api/examples/`
    exampleObjectRouter.get('/', errorWrapper(async (req, res, next) => {
      // "Database" query.
      const readResults = helloWorld

      // Return HTTP status and JSON results object.
      return res.status(200).json({
        success: true,
        message: 'API returned list of all Examples',
        results: readResults
      });
    }));

    // ======================================
    // Get individual Example.
    // ROUTE: GET `api/examples/:exampleId`
    exampleObjectRouter.get('/:exampleId', errorWrapper(async (req, res, next) => {
      // Throw Error if body contains exampleId.
      if (req.body.exampleId) { throw new Error('Request body cannot contain exampleId') };

      // "Database" query.
      const readResults = helloWorld[req.params.exampleId]
      // Throw error if Example does not exist.
      if (!readResults) { throw new Error("Example with provided exampleId does not exist") };

      // Return HTTP status and JSON results object.
      return res.status(200).json({
        success: true,
        message: 'API returned Example with exampleId of ' + req.params.exampleId,
        results: readResults
      });
    }));

    // ======================================
    module.exports = exampleObjectRouter;
    ```
  * Create errorWrapper.js to use for each route in exampleObjectController.js.
    * `touch controllers/errorWrapper.js`
    * Copy and paste the following into errorWrapper.js:
    ```
    // =====================================
    // Error Catching ======================
    // =====================================
    // This function passes any errors produces in any routes/functions that are wrapped within it to the error handler in server.js.
    function errorWrapper(fn) {
      return function(req, res, next) {
        fn(req, res, next).catch(next);
      };
    }
    module.exports = errorWrapper;
    ```
  *
  *
