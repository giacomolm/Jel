define(["jquery", "underscore", "ractive", "models/Connection"],
    function ($,_,Ractive,Connection) {

    var Connections = Backbone.Collection.extend({
        model: Connection,
	    
	initialize: function(){
		//instanciate the desidered video collection  based on the type passed 		
	},
	
      });

    return Connections;

  });

