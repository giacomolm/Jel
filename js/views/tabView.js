define(["jquery", "underscore", "backbone", "ractive", "views/tabItemView", "text!templates/tab.html"],
    function ($, _, Backbone, Ractive, tabItemView, template) {

    var tabView = Backbone.View.extend({
	   
	tagName : "ul",
	    
        events : {
        	
        },	
	
        initialize: function (){	
			this.tabs = new Array();
			this.history = new Array();
			//history length keep the number of the total tabs opened, in order to assign a unique name
			this.hlength = 0;
			this.render();
        },
	
		//id refers to canvas id 
		//type contains the string in the tab
		addTab: function(id, type){
			this.tabs[id] = {id: id, name: type};
			this.history.unshift(parseInt(id));
			this.hlength++;
			this.render(id);
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
			this.setTabActive(id);
		},

		setTabActive: function(id){
            var i;
            var elements = document.getElementsByName(id);
            for(i=0; i<elements.length; i++){
                $(elements[i]).removeClass("inactive");
            }
            this.setTabInactive(id);
        },

		setTabInactive: function(id){
			var i;
			for(i=0; i<this.history.length; i++){
				if(this.history[i] != id){
					var j;
					var elements = document.getElementsByName(this.history[i]);
					for(j=0; j<elements.length; j++){
						$(elements[j]).addClass("inactive");
					}
				}
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
			Backbone.history.navigate('closeTab/'+tab.id, {trigger: true});
		},

		closeAllTabs: function(){
			//remove all entry of tabs and history.
			for(id in this.tabs){				
		    	this.subViews[id].remove();
			}
			this.tabs = [];
			this.history.splice(0,this.history.length);
			this.render();
		},

		getLatestTab: function(){
			return this.history[0];
		},

		getHlength: function(){
			return this.hlength;
		},

        render: function (id) {        	
		    this.template = new Ractive({el : $(this.el), template: template});
		    this.subViews = new Array();
		    for(id in this.tabs){
		    	this.subViews[id] = (new tabItemView({model: this.tabs[id]}));
		    	$(this.subViews[id]).on("removed", {context : this}, this.closeTab);
			    $(this.el).append(this.subViews[id].render().el);
			}
			if(id) this.setTabInactive(id);
	    	return this;
        }

       
      });

    return tabView;

  });
