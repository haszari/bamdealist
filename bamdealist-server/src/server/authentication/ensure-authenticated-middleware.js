
import HttpStatus from 'http-status-codes';
import _ from 'lodash';

// generate a middleware func which checks auth

export default function(options) {
   options = _.defaults({},  options, {
      failureRedirect: '/not-authenticated',
   });
   return function(req, res, next) {
     if (req.isAuthenticated()) {
       return next();
     }
     // do apps usually return 403 with a login page redirect?
     res.status(HttpStatus.FORBIDDEN);
     res.redirect(options.failureRedirect);
   }
};
