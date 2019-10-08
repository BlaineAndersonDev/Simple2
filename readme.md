# A Simple Node API
##### Create a Simple Node API
  > This API is setup to use RESTful routing to manipulate a static object. It includes only the API (no frontend) and must be manipulated using calls (I.E. Postman). It is meant to be used when creating/learning cloud based hosting techniques.

## Create the API
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
  * Add and Commit the changes to git.
    * `git add .`
    * `git commit -m "Initial commit."`
  * Create a github repo & push up.
    * `git remote add origin <repoLink>`
    * `git push -u origin master`

## Setup Digital Ocean:
  * Create a Digital Ocean Account.
    * `https://www.digitalocean.com/`
  * Create a Project
    * For this I used the name "Simple"
  * Create a Droplet (Cloud Server) in the project (For the purposes of these notes, I have elected to add ALL dependencies manually).
    * These are the options I chose to use:
      * Image (Distribution / OS): `Ubuntu 18.04.3 (LTS) x64`
      * Plan: `Standard, $5 mo` (Plan is technically free for 600 hours).`
      * Datacenter: `San Francisco [2]`
      * Additional Options: `Monitoring`
      * Authentication: `Create SSH Key` (Follow the Steps).
        * Identification File: `simple`
        * Public Key File: `simple.pub`
        * Public Key:
        ```
        ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCYbfFOr1hbnOuvhKlJfXoE43ct2v/ZUUReXehZ/XjuYWt0BRZ0/3B4/JeQiZ9OnuENlyD0sx0AoxzVXojND7bZwaNw83uh0O/n2DvkWxE7LD2LEvSi/oE4Ozm6hmnQtEoNaK1DYSU81KzfTA0c7SwUukU4yoHuyKVwQRNZZ7xr0Jca5KCObO41iL7fvQlKgDuzzriNHR4/IvB9e4qw2BD4IOcOKZjnpTSrv2OQgL4DQssZ0oc9nCt4lc6VyK2a6wyo531fllfwgsbU+zm4JTWrQ2cS+Ljw4Ok0awvIzmEqBbbJyGw6Ek2Ap7C/WbW7z5qRD4MgASU3NjEoG7p/GDET blaineanderson@BlainesMiniMac
        ```
        * Passphrase: `Simple321`
        * Fingerprint: `SHA256:FWROgt9yZf8Cczlc4FW7cet07W1xGaUuSzm7bPUytJk blaineanderson@BlainesMiniMac`
        * Random Image:
        ```
        +---[RSA 2048]----+
        |       ...=   ..=|
        |      .  = .o. o+|
        |       . .oo oo*.|
        |        o.o oo* O|
        |        So  =+.O+|
        |           . =*.*|
        |            oo B+|
        |           ...E..|
        |           .o  o |
        +----[SHA256]-----+
        ```
      * Amount of Droplets: `1`
      * Droplet Hostname: `simple-001`
      * Selected Project: `Simple` (The one we just created)
  * Login from your local terminal:
    * `ssh root@<dropletIP>`
  * Accept the query: "Are you sure you want to continue connecting (yes/no)?"
    * `Are you sure you want to continue connecting (yes/no)?`
  * Now that you have accepted the query, use the ssh login one more time:
    * `ssh root@<dropletIP>`
    * [Optional] If you use `ssh root@<dropletIP>` and it returns "root@<dropletIP>: Permission denied (publickey)." then you have multiple SSH keys on your local system. To specify the key in the command line use:
      * `ssh -i <pathToSSHKey> <user/root>@<dropletIP>`
      * This will prompt you for your SSH passphrase. Enter that and you should have access.

## Combining our API with our Digital Ocean Droplet (cloud server)
  * At this point, you'll need to add in the basics (NPM OR Yarn)
    * NPM: Npm is easily installed using a native command provided by Digital Ocean
    * NPM (current) command:
    ```
    apt install npm
    ```
    * Yarn: https://yarnpkg.com/lang/en/docs/install/#debian-stable
    * Yarn (current) commands in order:
    ```
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    ```
    ```
    sudo apt-get update && sudo apt-get install yarn
    ```
  * In the root directory of your droplet, clone your github repo:
    * `git clone <githubRepo>`
  * Enter the newly created repo:
    * `cd <repoName>`
  *
    * ``
  *
    * ``
