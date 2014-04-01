//if you note the raphael library, i'm using the raphaelext, that includes the original raphael thorught the amd pattern
define(["jquery", "underscore", "backbone", "ractive", "raphaelext", "models/Shape", "models/Connection", "collections/Shapes", "collections/Connections", "text!templates/canvas.html"],
    function ($, _, Backbone, Ractive, Raphael,  Shape, Connection, Shapes, Connections,template) {

    var canvasView = Backbone.View.extend({
	    
        events : {
	    'keydown' : 'keydownHandler',
	    'drop' : 'dropHandler'
        },
	
	template : new Ractive({el : $(this.el), template: template}),
	
        initialize: function (paletteShapes, canvasShapes, connections) {
		
		//palette shapes remains the same 
		this.paletteShapes = paletteShapes;
		//canvas shapes contains instances of palette shapes, with other attrs like positions
		this.canvasShapes = canvasShapes;
		//connections contains all istances of connections between shapes
		this.connections = connections;
		
		//deininition of the main canvas
		this.paper = Raphael(this.$el[0], 640, 480);
		
		//init canvas event handler, like dropping events
		this.initHandler();
		
		//The editor should be able to attach shapes graphically. Thie active flag is set to true when there is an attempt of attach elements
		this.arrowActive = { active : false, source : null};
		
		$(document).on('keydown', {context:this}, this.keydownHandler);
		
		this.id = (new Date()).getTime();
		
		this.render();
        },	
	
	initHandler: function(){	
		//jquery manipulate in a strange way the event object, so we have to pass explicitaly a new parameter containing the data transfer object
		this.paper.getCanvas().ondrop = this.dropHandler(this); 
	},
	
	//this function is called when a shape is dropped into the canvas. In this case the local context (this) is not the current view, so we have to pass explicitly the context in its definition
	//the sourceId contains the identifier of the shape that is being dragged
	dropHandler: function(context){
		return function(ev){			
			var sourceId = ev.dataTransfer.getData("Text");
			var currentShape = context.paletteShapes.at(sourceId);
			context.addShape(currentShape,context,ev);	
			ev.preventDefault();
		}		
	},
	
	//Add a shape to the current canvas. 
	//parameters: currentContext is not mandatory. It is when the add action is related to an event
	//return the current instance of a shape into the canvas
	addShape: function(shape, currentContext,e){
		var context = currentContext || this;			
		//if the add shape is triggered by an event
		if(e){
			shape.x = e.layerX;//-context.paper.canvas.getBoundingClientRect().left;
			shape.y = e.layerY;//-context.paper.canvas.getBoundingClientRect().top;
		}

		//drawing the element with raphael	
		var shapeEl = context.paper.shape(shape.url, shape.x, shape.y, 86, 54, context, context.connectHandler);
		shapeEl.setDblclick(context.composedHandler);

		var shapeText = context.paper.shapeText(shape.name, shape.x, shape.y, shapeEl, context);
		
		var arrow = context.paper.shapeMenu("img/arrow.png", shape.x, shape.y, 21, 25, 86, context, context.onselect);
		
		//setting the related element to el
		var currentShape = new Shape();
		//assigning the current timestamp as id
		currentShape.id = (new Date()).getTime();
		if(shape.metaelement) currentShape.setMetaelement(shape.metaelement);
		
		//the same id must occur in the child elements
		shapeEl.id = currentShape.id;
		arrow.id = currentShape.id;
		
		//Set of all elements related to the current shape
		shapeEl.elements.push(arrow);						
		shapeEl.elements.push(shapeText);	

		//set the default graphical element of currentShape
		currentShape.el = shapeEl;
		currentShape.type = shape.type;
				
		context.canvasShapes.add(currentShape);

		return currentShape;
	},
	
	//currentContext is not mandatory. It is when the action is performed with an event
	connect: function(shapeInstance1, shapeInstance2, currentContext){
		var context = currentContext || this;
		var connection = new Connection();
		connection.outbound = shapeInstance1.id;
		connection.inbound = shapeInstance2.id;
		connection.el = context.paper.connection(shapeInstance1.el,shapeInstance2.el,"#000");
		context.connections.add(connection);
	},
	
	//Since the mousedown event of rafael doesn't support parameters, we have to wrap the real function with another that fix locally the right context
	onselect: function(context){	
		return function(){
			context.arrowActive.source = this.id;
			context.arrowActive.active = true;
			$(context.paper.getCanvas()).on("mousemove",{context : context}, context.simulateConnect);			
		}
	},
	
	simulateConnect: function(e){
		var context = e.data.context;
		var topShape = context.canvasShapes.pop();
		//if the current shape a the end of canvas shape is a fake shape
		if(topShape.id == 0){
			var fakeShape = topShape;
			var att = {x: e.clientX-context.el.offsetLeft-2, y: e.clientY-context.el.offsetTop};								
			fakeShape.el.attr(att);
			context.connections.pop().el.remove();
			context.connect(context.canvasShapes.get(context.arrowActive.source), fakeShape);				
			context.paper.safari();
		}
		else{
			var fakeShape = new Shape();
			fakeShape.id = 0;
			fakeShape.x = e.layerX;//clientX-context.paper.canvas.getBoundingClientRect().left;
			fakeShape.y = e.layerY;//clientY-context.paper.canvas.getBoundingClientRect().top;
			//the fake image can throw an exception due the missing image url 
			var fakeEl = context.paper.image(fakeShape, fakeShape.x1, fakeShape.y, 0, 0);
			fakeShape.el = fakeEl;
			//push the non fake element previously popped
			context.canvasShapes.push(topShape);					
			//add the connection
			context.connect(context.canvasShapes.get(context.arrowActive.source), fakeShape);					
		}
		
		context.canvasShapes.push(fakeShape);						
	},
	
	//Since the mousedown event of rafael doesn't support parameters, we have to wrap the function that defines locally the desiderd parameter
	connectHandler : function(context,target){	
		return function(){			
			if(context.arrowActive.active){
				//eliminate the current fake connection
				context.connections.pop().el.remove();
				//remove the fake element in the canvasShape collections
				context.canvasShapes.pop();
				
				var targetShape = context.canvasShapes.get(target.id);
				targetShape.el.animate({"opacity": 1}, 200);
				
				//connect the source element to the current element
				context.connect(context.canvasShapes.get(context.arrowActive.source), targetShape);
				$(context.paper.getCanvas()).off("mousemove", context.simulateConnect);
				context.arrowActive.active = false;
			}
			Backbone.history.navigate("props/"+target.id, {trigger: true});
		}
	},
	
	keydownHandler : function (e) {
		context = e.data.context;
		switch (e.which) {
		  case 27 : //case of ESC button
			if(context.arrowActive.active){
				//remove the fake connection in connections
				context.connections.pop().el.remove();
				//remove the fake element in the canvasShape collections
				context.canvasShapes.pop();
				$(context.paper.getCanvas()).off("mousemove", context.simulateConnect);
				context.arrowActive.active = false;
			}
		  break;
		}
	},
	
	
		composedHandler : function(context, target){
			return function(){
				Backbone.history.navigate("canvas/"+target.id, {trigger: true});
			}
		},
	

        render: function (eventName) {
	    return this;
        }
       
      });

    return canvasView;

  });
