define(["jquery", "underscore", "backbone", "ractive", "xsdAttr", "text!templates/properties.html"],
    function ($, _, Backbone, Ractive, xsdAttr, template) {

    var propertiesView = Backbone.View.extend({
	
	events :{
		"keyup input" : "updateProps"
	},
	    
        initialize: function (shapeId){
		this.render();
        },

        updateProps: function(ev){
        	if(this.model.updateProp) this.model.updateProp(ev.target.name, ev.target.value);
        },		
	
        render: function (eventName) {
	    this.template = new Ractive({el : $(this.el), template: template, data : this.model});
	    return this;
        }
       
      });

    return propertiesView;

  });
