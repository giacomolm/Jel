define(["jquery", "underscore", "backbone", "ractive", "text!templates/tabItem.html"],
    function ($, _, Backbone, Ractive, template) {

    var tabItemView = Backbone.View.extend({
	   
	tagName : "li",
	    
        events : {
        	"click" : "changeTab",
            "click .boxclose" : "closeTab"
        },	
	
        initialize: function (){
        	this.id = this.model.id;
			this.render();
        },

        closeTab: function(ev){
        	$(this).trigger("removed", [this]);
			this.remove();
		},
		
		changeTab: function(ev){
			Backbone.history.navigate('tab/'+ev.target.id, {trigger: true});
		},

        render: function (eventName) {
		    this.template = new Ractive({el : $(this.el), template: template, data : this.model});
		    return this;
        }
       
      });

    return tabItemView;

  });
