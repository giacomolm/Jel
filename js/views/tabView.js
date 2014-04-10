define(["jquery", "underscore", "backbone", "ractive", "views/tabItemView", "text!templates/tab.html"],
    function ($, _, Backbone, Ractive, tabItemView, template) {

    var tabView = Backbone.View.extend({
	   
	tagName : "ul",
	    
        events : {
        	
        },	
	
        initialize: function (){	
			this.tabs = new Array();
			this.history = new Array();
			this.render();
        },
	
		//id refers to canvas id 
		//type contains the string in the tab
		addTab: function(id, type){
			this.tabs[id] = {id: id, name: type};
			this.history.unshift(parseInt(id));
			this.render();
		},
		
		inTab : function(id){		
			if(this.tabs[id]) return true;
			else return false;
		},

		changeTab: function(id){
			var i, temp1 = this.history[0], temp2, trovato = false;
			var id = parseInt(id);
			//if the id is the head, we don't need to push it
			if(this.history[0]!=id){
				for(i=1; (i<=this.history.length) && (!trovato); i++){
					if(temp1 != id) {
						temp2 = this.history[i];
						this.history[i] = temp1;
						temp1 = temp2;
					}
					else trovato = true; 
				}
				if(trovato) this.history[0] = id;
			}
		},

		closeTab: function(ev,tab){
			var i, temp1 = ev.data.context.history[ev.data.context.history.length-1], temp2, trovato = false;

			delete ev.data.context.tabs[tab.id];
			for(i=ev.data.context.history.length-2; ((i>=0) && (!trovato)); i--){
				if(temp1 != tab.id){
					temp2 = ev.data.context.history[i];
					ev.data.context.history[i] = temp1;
					temp1 = temp2;
				}
				else trovato = true;
			}
			ev.data.context.history.splice(ev.data.context.history.length-1, ev.data.context.history.length);
			Backbone.history.navigate('tab/'+ev.data.context.history[0], {trigger: true});
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
