define(["jquery", "underscore", "ractive", "models/Shape"],
    function ($,_,Ractive,Shape) {

    var Shapes = Backbone.Collection.extend({
        model: Shape,
	    
	initialize: function(){
		//instanciate the desidered video collection  based on the type passed 		
	},    
	
	addShape: function(s){
		//if the id is not setted, there's an automatic setting
		if(!s.id) s.id = this.length;	
		this.add(s);
	},
	
      });

    return Shapes;

  });

