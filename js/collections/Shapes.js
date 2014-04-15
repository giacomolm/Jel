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

		//populate the collections starting from an array of shapes
		createShapes : function(shapes){
			var i;
			for(i=0; i<shapes.length; i++){
				var shape = new Shape();
				shape.setId(shapes[i].id);
				shape.setImage(shapes[i].url);
				shape.setPosition(shapes[i].x, shapes[i].y);
				shape.setMetaelement(shapes[i].metaelement);
				//set properties ha sto be called after the setmetaelement!
				shape.setProperties(shapes[i].props);
				shape.setName(shapes[i].name);
				shape.setType(shapes[i].type);
				if(shapes[i].shapes){
					var childsShapes = new Shapes();
					shape.shapes = childsShapes.createShapes(shapes[i].shapes);
				}
				this.add(shape);
			}			
			return this;
		},

		getShape: function(id){
			var i;
			for(i=0; i<this.length; i++){
				if(this.at(i).id == id) return this.at(i);
				if(this.at(i).shapes){
					var res = this.at(i).shapes.getShape(id);
					if(res) return res;
				}
			}
			return undefined;
		}
	
    });

    return Shapes;

  });

