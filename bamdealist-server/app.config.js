const _ = require('lodash');

var defaultConfig = {
   app: {
      hiddenTags: [
         "Diary",
         "history",
         "task",
         "here",

         "January",
         "Jan",
         "February",
         "Feb",
         "March",
         "Mar",
         "April",
         "Apr",
         "May",
         "June",
         "July",
         "August",
         "Aug",
         "September",
         "Sept",
         "Sep",
         "October",
         "Oct",
         "November",
         "Nov",
         "December",
         "Dec",

         /\d\d\d\d\d\d\d\d/,
         /\d\d\d\d\d\d/,
         /\d\d\d\d/,

         "the",
         "are",
         "use",
         "from",
         "but",
         "for",
         "and",
         "with",

         "http",
         "https",
         "www",
         "com",
      ]
   },
   db: {
      database: process.env.MONGO_DATABASE || 'mdealist_dev',
      host: process.env.MONGO_HOST || 'localhost',
   },
};

module.exports = defaultConfig;
