define(["jquery", "underscore", "backbone", "ractive", "bootbox", "text!templates/dialog.html"],
        function ($, _, Backbone, Ractive, bootbox, template) {

    var dialogView = Backbone.View.extend({
    	
    	events :{
    	
    	},
    	    
        initialize: function (){
            //we need a smarter way to bind the event
            $("#saveOpt").on("click", this.file(this));
            this.render();
        },

        file: function(context){
            return function (){

              bootbox.alert(template);/*, function() {
                console.log("Alert Callback", template);
             });*/
            }
        },

        render: function (eventName) {
        this.template = new Ractive({el : $(this.el), template: template});
        return this;
        }
       
    });

    return dialogView;

  });
