
const Backbone = require('backbone');

// item model (partial, only what client cares about)
var ItemModel = Backbone.Model.extend({
   defaults: {
      title: '',
      content: '',
      userTags: '',
      tags: []
   },
   urlRoot: '/api/v1/item/',
   idAttribute: '_id',
   fetchItem: function(itemId) {
      this.set({ _id: itemId });
      this.fetch();
   }
});

module.exports = ItemModel;
