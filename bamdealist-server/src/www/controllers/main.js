// The main UI view model, aka controller.

const superagent = require('superagent');

const ko = require('knockout');
const kb = require('knockback');

// util
const _ = require('lodash');

const navigateTo = require('../util/navigate-to')

const ItemModel = require('../models/item');
const ItemCollection = require('../models/item-collection');
const ItemViewModel = require('./item');

const queryUtils = require('../util/query-utils');

const DEFAULTS = {
   // gah - still have this in 2 places!
  itemsPerPage: 8
};

// ui model / item view model / page view model (whatever I need this thing to be!)
const MainAppViewModel = kb.ViewModel.extend({
   constructor: function() {

      // what kind of page are we on?
      this.pageMode = ko.observable('list'); // list || item || cloud

      // are we looking at a search?
      this.currentTags = ko.observableArray([]);
      this.currentTextSearch = ko.observable("");
      this.relatedTags = ko.observableArray([]);
      this.currentStartDate = ko.observable("");
      this.currentEndDate = ko.observable("");
      this.skipToItem = ko.observable(0);
      // search url fragments
      this.currentTagUrl = ko.computed(function() {
         return '/find/tags/' + this.currentTags().join('+');
      }, this);
      this.currentTextSearchUrl = ko.computed(function() {
         var query = this.currentTextSearch();
         if (query)
            return '/text/' + query;
         return "";
      }, this);

      // detail item
      this.currentSingleItem = new ItemViewModel(new ItemModel);

      // list items
      this.itemsCollection = new ItemCollection();
      this.itemsCollection.itemsPerPage = DEFAULTS.itemsPerPage;
      this.items = kb.collectionObservable(this.itemsCollection, {
         factories: {
            'models': ItemViewModel
         }
      });
      // refresh (related) tag cloud
      this.itemsCollection.on("update", function() {
         var url2 = "/api/v1/tags";
         var query = queryUtils.formatMongoSearchQuery(this.currentTags(), this.currentTextSearch());
         superagent.get(url2)
            .query({ query: JSON.stringify(query) })
            .end(function(error, response) {
               var allTags = response.body;
               var searchTags = this.currentTags();
               var searchTagsLower = _.map(this.currentTags(), tag => tag.toLowerCase() );
               allTags = _.filter(allTags, function(tag) {
                  if (_.includes(searchTagsLower, tag.tag.toLowerCase())) {
                     return false;
                  }
                  if (tag.count <= 1) {
                     return false;
                  }
                  return true;
               });

               this.relatedTags.valueWillMutate();
               this.relatedTags.removeAll();
               ko.utils.arrayPushAll(this.relatedTags, allTags);
               this.relatedTags.valueHasMutated();
            }.bind(this));

      }, this);

      // (related) tag cloud
      this.tagSearchActive = ko.computed(function() {
         return (this.currentTags().length > 0);
      }, this);
      this.tagCloudFontSize = function(tagHitCount) {
         const minSize = 8, sizeRange = 30;
         var size = 0;
         var tagCloudItems = this.relatedTags();
         if (tagCloudItems.length) {
            size = tagHitCount / tagCloudItems[0].count;
            size = size * sizeRange;
         }
         return size + minSize;
      };
   },

   // UI handlers
   homeClicked: function() {
      navigateTo.home();
   },
   onTextSearchSubmitted: function(event) {
      navigateTo.foundItems(
         this.currentTags(),
         this.currentTextSearch(),
         this.currentStartDate(), this.currentEndDate(),
      0);
   },
   listClicked: function() {
      navigateTo.foundItems(
         this.currentTags(),
         this.currentTextSearch(),
         this.currentStartDate(), this.currentEndDate(),
      0);
   },
   randomClicked: function() {
      navigateTo.random(this.currentTags(), this.currentTextSearch());
   },
   newClicked: function() {
      navigateTo.newItem();
   },
   prevPageClicked: function() {
      var newPageSkip = this.skipToItem() - this.itemsCollection.itemsPerPage;
      newPageSkip = Math.max(0, newPageSkip);
      navigateTo.foundItems(
         this.currentTags(),
         this.currentTextSearch(),
         this.currentStartDate(), this.currentEndDate(),
      newPageSkip);
   },
   nextPageClicked: function() {
      var newPageSkip = this.skipToItem() + this.itemsCollection.itemsPerPage;
      // we don't know the max items, but user will soon realise and stop clicking next
      navigateTo.foundItems(
         this.currentTags(),
         this.currentTextSearch(),
         this.currentStartDate(), this.currentEndDate(),
      newPageSkip);
   },

   // utility
   resetUI: function() {
      this.skipToItem(0);
      this.currentTextSearch("");
      this.currentTags([]);
      this.relatedTags([]);
      this.currentStartDate("");
      this.currentEndDate("");
      this.pageMode('list');
   },
   constrainSkip: function(skip) {
      skip = +skip; // ensure skip is a number
      if (_.isFinite(skip))
         return Math.floor(skip); // and a finite int 
      return 0;
   },

   // behaviour methods
   showItemsList: function(skip) {
      this.resetUI();
      this.skipToItem(this.constrainSkip(skip));
      this.itemsCollection.findItems(null, null, null, null, null, this.skipToItem());
      this.pageMode('list');
   },

   findItems: function(tagsPlusDelimited, textQuery, startDate, endDate, skip) {
      this.resetUI();
      var tags = [];
      if (tagsPlusDelimited)
         tags = tagsPlusDelimited.split('+');
      this.skipToItem(this.constrainSkip(skip));
      this.currentTextSearch(textQuery);
      this.currentStartDate(startDate);
      this.currentEndDate(endDate);
      this.currentTags(tags);
      this.relatedTags([]);
      this.itemsCollection.findItems(tags, textQuery, startDate, endDate, DEFAULTS.itemsPerPage, this.skipToItem());
      this.pageMode('list');
   },

   showRandomItem: function(tagsPlusDelimited, textQuery) {
      var url = "/api/v1/lucky";
      var tags = [];
      if (tagsPlusDelimited)
         tags = tagsPlusDelimited.split('+');
      var query = queryUtils.formatMongoSearchQuery(tags, textQuery);
      superagent.get(url)
         .query({ query: JSON.stringify(query) })
         .end(function(error, response) {
            var item = response.body;

            this.resetUI();
            this.currentTextSearch(textQuery);
            this.currentTags(tags);
            this.currentSingleItem.model().set(item);
            this.currentSingleItem.showEditForm(false);
            this.pageMode('item');
         }.bind(this)
      );
   },

   newItem: function() {
      this.resetUI();
      this.currentSingleItem.model().clear();
      this.currentSingleItem.showEditForm(true);
      this.pageMode('item');
   },

   showItem: function(itemId) {
      this.resetUI();
      this.currentSingleItem.model().fetchItem(itemId);
      this.currentSingleItem.showEditForm(false);
      this.pageMode('item');
   },

   editItem: function(itemId) {
      this.resetUI();
      this.currentSingleItem.showEditForm(true);
      this.currentSingleItem.model().fetchItem(itemId);
      this.pageMode('item');
   }

});

module.exports = MainAppViewModel;
