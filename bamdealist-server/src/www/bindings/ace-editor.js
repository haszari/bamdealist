
const _ = require('underscore');

const ko = require('knockout');

const ace = require('brace');

require('brace/mode/markdown');
require('brace/theme/chrome');

ko.bindingHandlers.aceEditor = {
   init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let editorContent = ko.unwrap(valueAccessor()) || "";

      // init editor
      let editor = ace.edit(element);
      editor.setTheme('ace/theme/chrome');
      editor.getSession().setMode('ace/mode/markdown');
      editor.getSession().setUseWrapMode(true);
      editor.renderer.setShowPrintMargin(false);
      editor.renderer.setShowGutter(false);

      // stash editor in element
      element.ko_binding_properties = {
         editor: editor,
         dontUpdateEditorValue: false
      };

      // set content to value
      editor.setValue(editorContent);

      // update observable on change
      if (_.isFunction(valueAccessor)) {
         editor.getSession().on('change', function() {
            element.ko_binding_properties.dontUpdateEditorValue = true;
            valueAccessor()(editor.getValue());
            element.ko_binding_properties.dontUpdateEditorValue = false;
         });
      }
      
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
         // This will be called when the element is removed by Knockout or
         // if some other part of your code calls ko.removeNode(element)
         editor.destroy();
      });
   },
   update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      // update the content in the editor
      if (!element.ko_binding_properties.dontUpdateEditorValue) {
         let editor = element.ko_binding_properties.editor;
         let editorContent = ko.unwrap(valueAccessor()) || "";
         editor.setValue(editorContent);
         
         // move cursor to start, instead of select all 
         editor.getSession().getSelection().moveCursorFileStart();
      }
   }
};