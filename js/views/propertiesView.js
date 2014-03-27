define(["jquery", "underscore", "backbone", "ractive", "xsdAttr", "text!templates/properties.html"],
    function ($, _, Backbone, Ractive, xsdAttr, template) {

    var propertiesView = Backbone.View.extend({
	
	events :{
		"change input" : "updateProps"
	},
	    
        initialize: function (shapeId){
		this.render();
        },		
	
        render: function (eventName) {
	    this.template = new Ractive({el : $(this.el), template: template, data : this.model});
	    return this;
        }
       
      });

    return propertiesView;

  });
