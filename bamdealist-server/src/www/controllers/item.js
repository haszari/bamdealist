
const ko = require('knockout');
const kb = require('knockback');

var navigateTo = require('../util/navigate-to');

var markdownRenderer = require('../../lib/markdown-renderer');


var ItemViewModel = kb.ViewModel.extend({
   constructor: function() {
      kb.ViewModel.prototype.constructor.apply(this, arguments);

      this.showEditForm = ko.observable(false);

      this.htmlContent = ko.computed(function() {
         return markdownRenderer(this.content());
      }, this);
      this.htmlTitle = ko.computed(function() {
         return markdownRenderer(this.title());
      }, this);
   },

   saveClicked: function() {
      this.model().save({}, {
         success: function() {
            var url = '/item/' + this.model().id;
            navigateTo.itemWithId(this.model().id);
         }.bind(this)
      });
   },
   cancelClicked: function() {
      navigateTo.itemWithId(this.model().id);
   },
   editClicked: function() {
      navigateTo.editItemWithId(this.model().id);
   },


});

module.exports = ItemViewModel;
