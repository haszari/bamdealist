import mongoose from 'mongoose';

import appConfig from '../../app.config.js';

const connectToDatabase = () => {
  mongoose.connect(`mongodb://${appConfig.db.host}/${appConfig.db.database}`);

  return mongoose.connection;
}

export default connectToDatabase;