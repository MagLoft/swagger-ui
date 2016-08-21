'use strict';

SwaggerUi.SignatureViewIncrement = 0;

SwaggerUi.Views.SignatureView = Backbone.View.extend({
  increment: 0,
  
  events: {
    'mousedown .snippet_json'          : 'jsonSnippetMouseDown',
    'mousedown .snippet_xml'          : 'xmlSnippetMouseDown'
  },

  initialize: function () {
    this.model.increment = SwaggerUi.SignatureViewIncrement += 1;
  },

  render: function(){
    $(this.el).html(Handlebars.templates.signature(this.model));
    return this;
  },

  // handler for snippet to text area
  snippetToTextArea: function(val) {
    if(this.model.editor) {
      this.model.editor.setValue(val, -1);
    }else{
      var textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));
      if($.trim(textArea.val()) === '') {
        textArea.val(val);
      }
    }
  },

  jsonSnippetMouseDown: function (e) {
    if (this.model.isParam) {
      if (e) { e.preventDefault(); }

      this.snippetToTextArea(this.model.sampleJSON);
    }
  },

  xmlSnippetMouseDown: function (e) {
    if (this.model.isParam) {
      if (e) { e.preventDefault(); }

      this.snippetToTextArea(this.model.sampleXML);
    }
  }
});