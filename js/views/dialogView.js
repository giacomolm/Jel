define(["jquery", "underscore", "backbone", "ractive", "bootbox", "filesaver", "text!templates/dialog.html"],
        function ($, _, Backbone, Ractive, bootbox, filesaver, template) {

    var dialogView = Backbone.View.extend({
    	
    	events :{
    	
    	},
    	    
        initialize: function (){
            //we need a smarter way to bind the event
            //$("#saveOpt").on("click", this.file(this));
            this.render();
        },

        file: function(shapes, connections){
            console.log(shapes.toJSON());
            var json = JSON.stringify(shapes.toJSON()),
                blob = new Blob([json], {type: "text/json"});
            saveAs(blob, "result.json");
        },

        render: function (eventName) {
        this.template = new Ractive({el : $(this.el), template: template});
        return this;
        }
       
    });

    return dialogView;

  });
