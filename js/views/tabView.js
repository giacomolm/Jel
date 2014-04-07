define(["jquery", "underscore", "backbone", "ractive", "views/tabItemView", "text!templates/tab.html"],
    function ($, _, Backbone, Ractive, tabItemView, template) {

    var tabView = Backbone.View.extend({
	   
	tagName : "ul",
	    
        events : {
        	
        },	
	
        initialize: function (){	
			this.tabs = new Array();
			this.render();
        },
	
		addTab: function(id, type){
			this.tabs[id] = {id: id, name: type};
			this.render();
		},
		
		inTab : function(id){		
			if(this.tabs[id]) return true;
			else return false;
		},

		closeTab: function(ev,tab){
			delete ev.data.context.tabs[tab.id];
			//Backbone.history.navigate('tab/'+latest, {trigger: true});
		},

        render: function (eventName) {
		    this.template = new Ractive({el : $(this.el), template: template});

		    for(id in this.tabs){
		    	var subView = (new tabItemView({model: this.tabs[id]}));
		    	$(subView).on("removed", {context : this}, this.closeTab);
			    $(this.el).append(subView.render().el);
			}
	    	return this;
        }
       
      });

    return tabView;

  });
