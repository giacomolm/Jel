define(["jquery", "underscore", "backbone", "ractive", "text!templates/dsl.html", "codemirror", "xml"],
    function ($, _, Backbone, Ractive, template, CodeMirror) {

    var dslView = Backbone.View.extend({
	
    	events :{

    	},
    	    
        initialize: function(){ 
            this.render();
        },	

        render: function (eventName) {
            this.template = new Ractive({el : $(this.el), template: template});
            this.editor = CodeMirror.fromTextArea(this.template.el.children[0], {
                            lineNumbers: true,
                            mode: "application/xml",
                        });
           
            
            return this;
        },

        setText : function(content){
            content = content.replace(/>/g, ">\n");
            this.editor.setValue(content);
            for(var i=0; i<this.editor.lineCount(); i++){
                this.editor.indentLine(i, "smart");
            }
        },
       
      });

    return dslView;

  });
