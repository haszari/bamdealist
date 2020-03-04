// utilities for rendering markdown to html, including generating hashtag links

const marked = require('marked');
const hashtag = require('hashtag');
const _ = require('underscore');

let defaultTagBaseUrl = '/find/tags/';

// returns md with hashtags expanded to markdown links
var expandHashtags = function(md, tagBaseUrl) {
   var expandedMd = md;

   let baseUrl = tagBaseUrl || defaultTagBaseUrl;

   var hashtags = hashtag.parse(md);
   var parserElements = hashtags.tokens;
   parserElements.map(element => {
      if (element.type == 'text') {
         return element;
      }
      element.text = `[${element.tag}](${baseUrl}${element.tag})`;
   });
   expandedMd = _.reduce(parserElements, (memo, element) => {
      return memo + element.text;
   }, '');

   return expandedMd;
};

var markdownToHtml = function(md, tagBaseUrl) {
   if (md) {
      return marked(expandHashtags(md, tagBaseUrl));
   }
   return '';
};

module.exports = markdownToHtml;
