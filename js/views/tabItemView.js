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
            ev.stopImmediatePropagation();
		},
		
		changeTab: function(ev){
            this.setTabActive(this.id);
			Backbone.history.navigate('tab/'+this.id, {trigger: true});
		},

        setTabActive: function(id){
            var i, temp_select ="\""+id+"\"";
            var elements = document.getElementsByName(id)
            for(i=0; i<elements.length; i++){
                $(elements[i]).removeClass("inactive");
            }
        },

        render: function (eventName) {
		    this.template = new Ractive({el : $(this.el), template: template, data : this.model});
		    return this;
        }
       
      });

    return tabItemView;

  });
