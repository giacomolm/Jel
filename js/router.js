define(["jquery", "underscore", "backbone", "collections/Shapes", "views/canvasView", "jel", "views/menuView", "views/paletteView", "views/tabView", "views/propertiesView", "views/dslView", "views/dialogView", "views/notificationView"],
    function ($, _,Backbone,Shapes, canvasView, Jel, menuView, paletteView, tabView, propertiesView, dslView, dialogView, notificationView) {

    var AppRouter = Backbone.Router.extend({

      routes: {
        "": "index",
		"props/:id" : "changeProperties",
		"canvas/:id" : "createCanvas",
		"tab/:id" : "changeTab",
		"text": "convert"
      },

      initialize: function (paletteShapes, canvasShapes, connections,canvas) {
      	//currentView will contain main views of the application: in this case are canvas and dslTextEditor
		this.currentView = undefined;

		this.contents = [];
		
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

		//initialize the editor dialog
		this.dialog = new dialogView();

		this.notification = new notificationView();
		$('#notification').append($(this.notification.el));
		      
		this.tabView = new tabView();
		$('#tab').append($(this.tabView.el));
		      
		//adding the palette with the default shapes
		this.paletteView =new paletteView(this.paletteShapes);
		$('#palette').append($(this.paletteView.el));
		      
		//adding the default text editor view
		this.dslView = new dslView();
		$('#dsl').append($(this.dslView.el));
		//this.addCustomEvents();
      },
     
      index: function(){	
      	//if the canvas was specified in the init 
      	if(this.canvas){
			this.contents[this.canvas.id] = this.canvas;
			this.tabView.addTab(this.canvas.id, "canvas"+this.tabView.tabs.length);
			Jel.Canvas = this.canvas;
			this.changePage(this.canvas);
		}
		else{ //create canvas manually
			this.canvas = new canvasView(this.paletteShapes, this.canvasShapes, this.connections);
			this.contents[this.canvas.id] = this.canvas;
			this.tabView.addTab(this.canvas.id, "canvas"+this.tabView.tabs.length);
			Jel.Canvas = this.canvas;
			this.changePage(this.canvas);
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
				this.contents[this.canvas.id] = this.canvas;
				currentComposed.canvas = this.canvas.id
				this.tabView.addTab(this.canvas.id, currentComposed.props.id || "canvas"+this.tabView.tabs.length);
				Jel.Canvas = this.canvas;
				this.changePage(this.canvas);
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
		var current = this.contents[id];
		//i need to bind the original event handler
		if(current.initHandler){
			current.initHandler();
			//NEED a more elegant way of understand the canvas case.. typeOF?
			Jel.Canvas = current;
		}			
		this.changePage(current);
		
      },
      
      changeProperties: function(shapeId){
      	//if currentView is undefined, it means that we have to create it
		if(this.currentView == undefined) this.index();
		var currentModel = Jel.Canvas.canvasShapes.get(shapeId);
		if(currentModel) {
			$('#properties').empty();
			this.propertiesView = new propertiesView({model : currentModel});
			$('#properties').append($(this.propertiesView.el));
		}
      },

      convert: function(){
      	//Conversion is possible only if the user has defined a basefile and a baseelement
      	if(Jel.baseFile && Jel.baseElement){
			var conversionRes;
			//Conversion phase: the result of conversion is contained in conversionRes
			if(Jel.wrapper) conversionRes = Jel.convert(Jel.baseFile, Jel.wrapper, Jel.baseElement);
			else conversionRes = Jel.convert(Jel.baseFile, undefined, Jel.baseElement);
			this.dslView.setText(conversionRes);

			var validateRes = Jel.validate(conversionRes, Jel.getSchema());
			this.notification.warning(validateRes);
			//if it's the first conversion, we need to add the dsl editor to the main div
			if(!this.contents[this.dslView.id]){
				this.contents[this.dslView.id] = this.dslView;
				this.tabView.addTab(this.dslView.id,"result.xml");	
				this.changePage(this.dslView);			
			}
			else this.changeTab(this.dslView.id);
			//Codemirror doesn't refresh its context after changes, so we do manually
			this.dslView.refresh();
			
				
		}
      },

      changePage: function(page){
      	$('#main').empty();
        this.currentView = page;
        $('#main').append($(this.currentView.el));
      }
      

    });

    return AppRouter;

  });
