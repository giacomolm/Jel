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
		    "click .openOpt" : "openFile"
        },	
	
        initialize: function (shapes){
        	this.reader = new FileReader();
        	this.reader.onload = this.readerHandler(this);
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
				//here we can call the load method
				console.log(context.result);
			};
		},
		
		convert: function(){
			Backbone.history.navigate('text', {trigger: true});
		},
		
		save : function(){
			$('#fileOpts').hide();
			Backbone.history.navigate('save', {trigger: true});
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
