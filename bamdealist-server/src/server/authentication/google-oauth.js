
const { URL } = require('url');

import _ from 'lodash';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var defaultOptions = {
   // must pass express app!!
   expressApp: null,
   baseUrl: 'http://localhost:8080', 

   // app routes
   callbackPath: '/auth/google/callback',
   authenticationPath: '/auth/google',
   successPath: '/',
   loginPagePath: '/login',

   // google api credentials
   // must provide creds!
   clientID: '',
   clientSecret: '',
};

// fake lazy user serialise; should use mongo or some session store??
var user_cache = {};
const setupAuthentication = function(options) {
   options = _.defaults({}, options, defaultOptions);
   if (!options.expressApp) throw 'google-oauth requires an express App!!';
   if (!options.clientID || !options.clientSecret) throw 'google-oauth requires oauth credentials!!';

   options.fullCallbackUrl = new URL(options.baseUrl);
   options.fullCallbackUrl.pathname = options.callbackPath;

   options.expressApp.use(passport.initialize());
   options.expressApp.use(passport.session());

   // this gets passed the user object made below and then we serialise it somewhere
   passport.serializeUser(function(user, next) {
      // console.log('serial', user);
      let id = user.id;
      user_cache[id] = user;
      next(null, id);
   });

   passport.deserializeUser(function(id, next) {
      // console.log('deserial');
      next('', user_cache[id]);
   });

   // Use the GoogleStrategy within Passport.
   //   Strategies in Passport require a `verify` function, which accept
   //   credentials (in this case, an accessToken, refreshToken, and Google
   //   profile), and invoke a callback with a user object.
   passport.use(new GoogleStrategy({
       clientID: options.clientID,
       clientSecret: options.clientSecret,
       callbackURL: options.fullCallbackUrl.href,
     },
     function(accessToken, refreshToken, profile, done) {
      let err = null;

      // here we need to construct a user object and pass it to done
      let user = {
         id: profile.id,
         profile: profile,
      }
         // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
         // });
     }
   ));


   // GET /auth/google
   //   Use passport.authenticate() as route middleware to authenticate the
   //   request.  The first step in Google authentication will involve
   //   redirecting the user to google.com.  After authorization, Google
   //   will redirect the user back to this application at /auth/google/callback
   options.expressApp.get(options.authenticationPath,
      passport.authenticate('google', { 
         scope: ['https://www.googleapis.com/auth/plus.login'],
         failureRedirect: options.loginPagePath
      }),
   );

   // GET /auth/google/callback
   //   Use passport.authenticate() as route middleware to authenticate the
   //   request.  If authentication fails, the user will be redirected back to the
   //   login page.  Otherwise, the primary route function function will be called,
   //   which, in this example, will redirect the user to the home page.
   options.expressApp.get(options.callbackPath, 
      passport.authenticate('google', { 
         failureRedirect: options.loginPagePath
      }),
      function(req, res) {
         res.redirect(options.successPath);
      }
   );

}

export default setupAuthentication;