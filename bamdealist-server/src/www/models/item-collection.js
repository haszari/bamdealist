
const Backbone = require('backbone');

const ItemModel = require('./item');

const queryUtils = require('../util/query-utils');

var ItemCollection = Backbone.Collection.extend({
   model: ItemModel,
   url: '/api/v1/item/',
   constructor: function() {
      Backbone.Collection.apply(this, arguments);
   },
   fetch: function() {
      this.findItems();
   },
   findItems: function(tagsArray, textSearch, startDate, endDate, max, skip) {
      var query = queryUtils.formatMongoSearchQuery(tagsArray, textSearch, startDate, endDate);
      if (!max) {
         max = queryUtils.defaults.itemsPerPage;
      }
      if (!skip) {
         skip = queryUtils.defaults.skipToItem;
      }
      Backbone.Collection.prototype.fetch.apply(this, [{
         traditional: true, // so we can do query params
         data: {
            query: JSON.stringify(query),
            limit: max,
            skip: skip,
            sort: JSON.stringify({originated: -1})
         }
      }]);
   },
});

module.exports = ItemCollection;
