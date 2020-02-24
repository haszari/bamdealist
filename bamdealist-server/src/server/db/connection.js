const mongoose = require('mongoose');
const appConfig = require('../../../app.config');

module.exports = function() {
   mongoose.connect(`mongodb://${appConfig.db.host}/${appConfig.db.database}`);
   
   return mongoose.connection;
}