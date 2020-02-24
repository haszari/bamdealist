
// styles
require('./styles/app.scss');

const ko = require('knockout');
const Backbone = require('backbone');

// custom bindings
require('./bindings/ace-editor');

// app!
const AppRouter = require('./util/router');
const MainController = require('./controllers/main');

const mainController = new MainController();
var router = new AppRouter({
   controller: mainController
});

// templates
var template = require("./templates/main.html");

// div for template destination
var templateDiv = document.createElement('div');
document.body.appendChild(templateDiv);

// wait for content to load
document.addEventListener("DOMContentLoaded", function() {

   templateDiv.innerHTML = template;

   ko.applyBindings(mainController);

   Backbone.history.start({ pushState: true });

});





