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
	    /*var result = new Object();
	    result["shapes"] = shapes.toJSON();
	    result["connections"] = connections.toJSON();*/	
            var json = "[{\"shapes\" : "+JSON.stringify(shapes.toJSON())+", \"connections\" : "+JSON.stringify(connections.toJSON())+"}]";//JSON.stringify(JSON.stringify(result)),
		    var blob = new Blob([json], {type: "application/json"});
            saveAs(blob, "result.json");
        },

        render: function (eventName) {
        this.template = new Ractive({el : $(this.el), template: template});
        return this;
        }
       
    });

    return dialogView;

  });
