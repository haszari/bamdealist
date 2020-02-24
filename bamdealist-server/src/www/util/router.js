// Main app router.

const Backbone = require('backbone');

// one of these is passed in
//const MainViewModel = require('./views/main');

// util
//const _ = require('underscore');

// client-side router
var AppRouter = Backbone.Router.extend({
   initialize: function(options) {
      var controller = options.controller;

      if (!controller) {
         console.log('surely you want an appController?')
         return;
      }

      // (check route handlers exist, then) hook em up

      // NOTE the later they are registered the higher precedence
      // - that's why newItem is after showItem.
      // (this is the reverse of routes map)

      if (controller.showItemsList)
         this.route("", controller.showItemsList.bind(controller));

      if (controller.showRandomItem) {
         this.route("find(/tags/:plusDelimitedTags)(/text/:textQuery)/random", controller.showRandomItem.bind(controller));
         this.route("random", controller.showRandomItem.bind(controller));
      }

      if (controller.findItems) {
         this.route("find(/tags/:plusDelimitedTags)(/text/:textQuery)(/fromDate/:startDate)(/toDate/:endDate)(/skip/:skip)",
            controller.findItems.bind(controller));
      }

      if (controller.showItem)
         this.route("item/:id", controller.showItem.bind(controller));

      if (controller.editItem)
         this.route("item/:id/edit", controller.editItem.bind(controller));

      if (controller.newItem)
         this.route("item/new", controller.newItem.bind(controller));
   }

});

module.exports = AppRouter;
