define(["jquery", "underscore", "backbone", "ractive", "text!templates/tab.html"],
    function ($, _, Backbone, Ractive, template) {

    var tabView = Backbone.View.extend({
	   
	tagName : "ul",
	    
        events : {
            "click" : "changeTab"
        },	
	
        initialize: function (){	
		this.tabs = [];
		this.render();
        },
	
	addTab: function(id, type){
		this.tabs[this.tabs.length] = {id : id, name: type};		
		this.render();
	},
	
	inTab : function(id){		
		for(i=0; i<this.tabs.length; i++){
			if(this.tabs[i].id == id) return true;
		}
		return false;
	},
	
	changeTab: function(ev){
		Backbone.history.navigate('tab/'+ev.target.id, {trigger: true});
	},

        render: function (eventName) {
	    this.template = new Ractive({el : $(this.el), template: template, data : this});
	    return this;
        }
       
      });

    return tabView;

  });
