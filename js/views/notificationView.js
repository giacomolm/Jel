define(["jquery", "underscore", "backbone", "ractive", "text!templates/notification.html"],
        function ($, _, Backbone, Ractive, template) {

    var notificationView = Backbone.View.extend({
    	
    	events :{
    	
    	},
    	    
        initialize: function (){
            $(this.el).hide();
            this.render();
        },

        warning: function(text){
            this.model = {message : text};
            $(this.el).show();
            this.render();
        },

        render: function (eventName) {
            this.template = new Ractive({el : $(this.el), template: template, data: this.model});
            
            return this;
        }
       
    });

    return notificationView;

  });
