// Utility for navigating (routing) to app routes - generates standard urls and triggers nav using backbone.

const _ = require('underscore');

const Backbone = require('backbone');

function routeToPath(url) {
   var navigated = Backbone.history.navigate(url, true);

   if (navigated === undefined) {
      // Backbone didn't actually route as we're already at that url.
      // We'll force it so things like /home and /random reload when you click em.
      Backbone.history.loadUrl(Backbone.history.fragment);
   }
}

var navigateTo = {
   // routing (these are for our internal use - could be just closure funcs? or even another module)
   home: function(skip) {
      var url = '/';
      routeToPath(url);
   },
   pageStartingAt: function(skip) {
      var url = '/';
      if (_.isFinite(skip))
         url = '/skip/' + Math.floor(skip); // ensure skip is a number
      routeToPath(url);
   },
   random: function(tagArray, textQuery) {
      var findUrlFragment = '';
      if (tagArray && tagArray.length)
         findUrlFragment += '/tags/' + tagArray.join('+');
      if (textQuery)
         findUrlFragment += '/text/' + textQuery;
      var url = (findUrlFragment ? 'find' : '') + findUrlFragment + '/random';
      routeToPath(url);
   },
   foundItems: function(tagArray, textQuery, startDate, endDate, skip) {
      var url = '/find';
      if (tagArray && tagArray.length)
         url += '/tags/' + tagArray.join('+');
      if (textQuery)
         url += '/text/' + textQuery;
      if (startDate)
         url += '/fromDate/' + startDate;
      if (endDate)
         url += '/toDate/' + endDate;
      // if (max)
      //    url += '/max/' + max;
      if (skip)
         url += '/skip/' + skip;
      routeToPath(url);
   },
   newItem: function() {
      var url = '/item/new';
      routeToPath(url);
   },
   itemWithId: function(itemId) {
      var url = '/';
      if (itemId)
         url = '/item/' + itemId;
      routeToPath(url);
   },
   editItemWithId: function(itemId) {
      var url = '/';
      if (itemId)
         url = '/item/' + itemId + '/edit';
      routeToPath(url);
   },
};

module.exports = navigateTo;
