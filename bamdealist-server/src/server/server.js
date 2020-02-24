const path = require('path');
const express = require('express');
const { URL } = require('url');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const historyApiFallback = require('connect-history-api-fallback');

var session = require("express-session");
var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// import ensureAuthenticatedMiddleware from './authentication/ensure-authenticated-middleware';
// import setupAuthentication from './authentication/google-oauth';

// dev or production (so we can serve up appropriate client stuff)
const DEVELOPMENT = process.env.NODE_ENV === 'development';

var appConfig = require('../../app.config');

// is there a way to make a url directly from the components??
const externalBaseUrl = new URL('http://localhost');
externalBaseUrl.protocol = process.env.EXTERNAL_PROTOCOL || 'http';
externalBaseUrl.hostname = process.env.EXTERNAL_HOSTNAME || 'localhost';
externalBaseUrl.port = process.env.EXTERNAL_BIND_PORT || 8080;

// should do all this config logic in app.config.js
const internalPort = process.env.INTERNAL_APP_PORT || 8080;

const app = express();

const loginPagePath = '/login';

app.use(session({ secret: process.env.SESSION_SECRET || 'fancy-feast' }));
// is this (urlencoded) required for passport? 
app.use(bodyParser.urlencoded({ extended: false })); 
// these help express-restify-mongoose do its job
app.use(bodyParser.json()); 
app.use(methodOverride());

// setupAuthentication({
//    expressApp: app, 
//    baseUrl: externalBaseUrl.href,

//    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
//    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,

//    loginPagePath: loginPagePath
// });

// auth failure route
app.get(loginPagePath, function (req, res) {
  res.send("You're gonna wanna <a href='/auth/google'>log in</a>");
});

// const ensureAuthenticated = ensureAuthenticatedMiddleware({
//    failureRedirect: loginPagePath,
// });

// pull in db layer and expose api routes
let dbRouter = undefined;
try {
   dbRouter = require('./db-routes');
}
catch (err) {
   console.log(err);
   console.log('UNABLE to connect to database; exiting');
}

if (dbRouter) {
   // app.use(ensureAuthenticated, dbRouter);
   app.use(dbRouter);

   // pull in api and expose api routes
   // (this is a slightly generic mechanism that I'm not using)
   // const _ = require('lodash');
   // const api = require('./api');
   // const API_BASE_PATH = '/api/';
   // _.forIn(api, (routeHandler, routePath) => {
   //    app.get(API_BASE_PATH + routePath, ensureAuthenticated, routeHandler);
   // });

   if (DEVELOPMENT) {
      // serve up webpacked client-side app
      console.log("We're serving up dev");
      var devServer = require('./dev-server');
      app.use(devServer);
   }
   else {
      // I think this requires that we run from root folder ..
      console.log("We're serving up production from dist/www/");
      app.use(express.static(path.join(__dirname, '../../dist/www')));
   }
}

// reroute whatever client urls through to (webpack) index.html so we can have client-side routing
// order seems to matter - this stopped working when I moved it after the `/` route (below)
app.use(historyApiFallback({
   // log for dev (not really necessary)
   // verbose: DEVELOPMENT
}));

// serve up our html file
// todo just serve the file, not the folder?
app.use('/', 
   // ensureAuthenticated,
   express.static(path.join(__dirname, '../../src/www/public/'))
);


// default hello world middleware (which will never get hit)
app.get('/', function (req, res) {
  res.send('Last ditch hello world .. our client app is not getting served?');
});

let listenCallback = function () {
  console.log(`listening on ${externalBaseUrl.href}!`);
};

app.listen(internalPort, listenCallback);

