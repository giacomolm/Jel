define(["jquery", "underscore", "backbone", "ractive", "bootbox","text!templates/notification.html"],
        function ($, _, Backbone, Ractive, bootbox, template) {

    var notificationView = Backbone.View.extend({
    	
    	events :{
    	
    	},
    	    
        initialize: function (){
            $(this.el).hide();
            this.render();
        },

        warning: function(text){
            if(text.indexOf('validates') != -1){
                this.model = {message : text};
                $(this.el).show();
            }
            else{
                bootbox.alert(text, function() {
                    
                });
            }
            this.render();
        },

        render: function (eventName) {
            this.template = new Ractive({el : $(this.el), template: template, data: this.model});
            
            return this;
        }
       
    });

    return notificationView;

  });
