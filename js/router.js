define(["jquery", "underscore", "backbone", "collections/Shapes", "views/canvasView", "jel", "views/menuView", "views/paletteView", "views/tabView", "views/propertiesView"],
    function ($, _,Backbone,Shapes, canvasView, Jel, menuView, paletteView, tabView, propertiesView) {

    var AppRouter = Backbone.Router.extend({

      routes: {
        "": "index",
		"props/:id" : "changeProperties",
		"canvas/:id" : "createCanvas",
		"tab/:id" : "changeTab",
      },

      initialize: function (paletteShapes, canvasShapes, connections,canvas) {
		this.currentView = undefined;

		this.canvases = [];
		
		//make the user defined shapes as default
		this.paletteShapes = paletteShapes;
		this.canvasShapes = canvasShapes;
		//setting the default connections collection
		this.connections = connections;

		//set the initial canvas
		this.canvas = canvas;
		      
		//adding the menu interface
		this.menuView = new menuView();
		$('#menu').append($(this.menuView.el));
		      
		this.tabView = new tabView();
		$('#tab').append($(this.tabView.el));
		      
		//adding the palette with the default shapes
		this.paletteView =new paletteView(this.paletteShapes);
		$('#palette').append($(this.paletteView.el));
		      
		//this.addCustomEvents();
      },
     
      index: function(){	
      	//if the canvas was specified in the init 
      	if(this.canvas){
			this.canvases[this.canvas.id] = this.canvas;
			this.tabView.addTab(this.canvas.id);
			this.changeCanvas(this.canvas);
		}
		else{ //create canvas manually
			this.canvas = new canvasView(this.paletteShapes, this.canvasShapes, this.connections);
			this.canvases[this.canvas.id] = this.canvas;
			this.tabView.addTab(this.canvas.id);
			this.changeCanvas(this.canvas);
		}
      },
      
      addCustomEvents: function(){
		$(document).change(function(ev) {
				//Utils.appRouter.getCurrentView().trigger("change", ev);
		}, this);	
       },
	
       //id related to composed shape that we are exploding 
      createCanvas: function(id){
		var currentComposed = this.currentView.canvasShapes.get(id); //i need to get the shape from the previous canvas, where the composed shape is placed on 
		if(currentComposed && currentComposed.isComposed()){	
			if(!this.tabView.inTab(currentComposed.canvas)){
				if(!currentComposed.shapes) currentComposed.shapes = new Shapes();
				this.canvas = new canvasView(this.paletteShapes, currentComposed.shapes, this.connections);
				//add this canvas to the current collection of existing canvas
				this.canvases[this.canvas.id] = this.canvas;
				
				currentComposed.canvas = this.canvas.id
				this.tabView.addTab(this.canvas.id);
				this.changeCanvas(this.canvas);
			}
			else{
				//if the element is yet in the tabs, we don't need to create a new tab
				this.changeTab(currentComposed.canvas);
			}
		}
	//else this.index();
      },
      
      changeTab: function(id){	
      	//if the current view has an id different      	
			var current = this.canvases[id];
			//i need to bind the original event handler
			current.initHandler();
			this.changeCanvas(current);
		
      },
      
       changeCanvas: function (page) {
        $('#canvas').empty();
        this.currentView = page;
		Jel.Canvas = this.currentView;
        $('#canvas').append($(this.currentView.el));
      },
      
      changeProperties: function(shapeId){
	 if(this.currentView == undefined) this.index();
	 var currentModel = Jel.Canvas.canvasShapes.get(shapeId);
         if(currentModel) {
		$('#properties').empty();
		this.propertiesView = new propertiesView({model : currentModel});
		$('#properties').append($(this.propertiesView.el));
	}
      }
      

    });

    return AppRouter;

  });
