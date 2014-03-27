define(["jquery", "underscore", "backbone", "ractive", "raphael", "jel","text!templates/menu.html"],
    function ($, _, Backbone, Ractive, Raphael, Jel, template) {

    var menuView = Backbone.View.extend({
	    
        events : {
            "mouseover #fileMenu" : "showFileOpt",
	    "mouseout #fileMenu" : "hideFileOpt",
	    "click #fileMenu" : "toggleFileOpt",
	    "click #saveOpt" : "save",
	    "mouseover #editMenu" : "showEditOpt",
	    "mouseout #editMenu" : "hideEditOpt",
	    "click #editMenu" : "toggleEditOpt",
	    "click #convertOpt" : "convert",
        },	
	
        initialize: function (shapes){
		this.render();
        },	
	
	showFileOpt: function(){
		$('#fileOpts').show();
	},
	
	hideFileOpt: function(){
		$('#fileOpts').hide();
	},
	
	toggleFileOpt: function(){
	
	},
	
	showEditOpt: function(){
		$('#editOpts').show();
	},
	
	hideEditOpt: function(){
		$('#editOpts').hide();
	},
	
	toggleEditOpt: function(){
	
	},
	
	convert: function(){
		Jel.convert('xml/camelRoute.xml', 'routes', 'route');
	},
	
	save : function(){
		$('#fileOpts').hide();
	},

        render: function (eventName) {
	    this.template = new Ractive({el : $(this.el), template: template});
	    return this;
        }
       
      });

    return menuView;

  });
