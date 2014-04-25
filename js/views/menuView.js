define(["jquery", "underscore", "backbone", "ractive", "raphael", "jel", "text!templates/menu.html"],
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
		    "click .openOpt" : "openFile",
		    "mouseover #aboutMenu" : "showAboutOpt",
		    "mouseout #aboutMenu" : "hideAboutOpt",
		    "click #infoOpt": "openInfo",
		    "mouseover #exportOpt" : "showExportOpts",
		    "mouseout #exportOpt" : "hideExportOpts",
		    "click #exportSVG" : "exportSVG"

        },	
	
        initialize: function (shapes, connections){
        	if(window.FileReader){
		        	this.reader = new FileReader();
		        	this.reader.onload = this.readerHandler(this);
		    }
			this.shapes = shapes;
			this.connections = connections;
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

		showAboutOpt: function(){
			$('#aboutOpts').show();
		},
		
		hideAboutOpt: function(){
			$('#aboutOpts').hide();
		},

		showExportOpts: function(){
			$('#exportOpts').show();
		},

		hideExportOpts: function(){
			$('#exportOpts').hide();
		},

		openFile: function(){
			$("#fileOpts").hide();
			$("#fileOpen").trigger('click');
		},

		openHandler: function(event){
			var file;
			if(event.target.files && (file = event.target.files[0]))
				event.data.context.reader.readAsText(file); 
		},

		readerHandler:function(context){
			return function(){
				//Here we convert the loaded object
				Jel.input = JSON.parse(context.reader.result)[0];
				Backbone.history.navigate('load', {trigger: true});
			};
		},
		
		convert: function(){
			Backbone.history.navigate('text', {trigger: true});
		},
		
		save : function(){
			$('#fileOpts').hide();
			Backbone.history.navigate('save', {trigger: true});
		},

		openInfo : function(){
			Backbone.history.navigate('notificate/'+"info", {trigger: true});
		},

		exportSVG: function(){
			Backbone.history.navigate('exportSVG', {trigger: true});
		},

        render: function (eventName) {
		    this.template = new Ractive({el : $(this.el), template: template});
		    //Attaching file open handler
		    $(this.template.el.querySelector('#fileOpen')).on("change", {context: this},this.openHandler);
		    return this;
        }
       
      });

    return menuView;

  });
