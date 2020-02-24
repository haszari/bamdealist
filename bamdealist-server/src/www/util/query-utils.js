const _ = require('lodash');

const defaults = {
   itemsPerPage: 8,
   skipToItem: 0
};

var formatMongoSearchQuery = function(tagsArray, textSearch, startDate, endDate, max, skip) {
   var query = {}, clauses = [];
   var startDateNum = Date.parse(startDate);
   var endDateNum = Date.parse(endDate);
   if (startDate && _.isFinite(startDateNum)) {
      clauses.push({
         originated: {
            $gte: new Date(startDateNum)
         }
      });
   }
   if (endDate && _.isFinite(endDateNum)) {
      clauses.push({
         originated: {
            $lte: new Date(endDateNum)
         }
      });
   }
   if (tagsArray && tagsArray.length) {
      clauses.push({
         lowerCaseTags: {
            $all: _.map(tagsArray, tag => tag.toLowerCase() )
         }
      });
   }
   if (textSearch) {
      clauses.push({
         "$text": {
            $search: textSearch
         }
      });
   }
   if (clauses.length > 0)
      query.$and = clauses;
   return query;
};

module.exports = {
   defaults: defaults,
   formatMongoSearchQuery: formatMongoSearchQuery
};
