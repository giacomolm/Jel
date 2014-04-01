/*inizializazzione require*/
require.config({
  paths: {
    domReady: '../lib/require/domReady',
    text: '../lib/require/text',
    async: '../lib/require/async',
    jquery: '../lib/jquery/jquery',
    backbone: '../lib/backbone/backbone',
    ractive: '../lib/ractive/ractive',
    underscore:  '../lib/underscore/underscore',
    templates:"../templates",
    raphael: '../lib/raphael/raphael',
    raphaelext: '../lib/raphael/raphael.ext',
    jel: '../lib/jel/jel',
    xsdAttr: '../lib/xsdAttr/xsdAttr',
    codemirror: '../lib/codemirror/codemirror',
    xml: '../lib/codemirror/xml',
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'backbone': {
        deps: ['jquery', 'underscore'],
        exports: 'Backbone'
    },
    'ractive': {
        exports: 'ractive'
    },
  }
});
  
/*Using the javascript module pattern to allow external use*/
require(['jquery','domReady','underscore','backbone', 'router', 'jel', 'views/paletteView', "views/canvasView", "models/Shape", "collections/Shapes", "collections/Connections"],
	    function ($,domReady, _,Backbone, AppRouter, Jel, PaletteView, canvasView, Shape, Shapes, Connections) {		    
		
		    //Setting the default Jel shape model,
		    Jel.Shape = Shape;
		    //the default Jel shape collections for palette,
		    var paletteShapes = Jel.paletteShapes = new Shapes();
		    //and the default Jel shapes instances, related to canvas
		    var canvasShapes = Jel.canvasShapes = new Shapes();
            //setting the default collection of connections between canvas shapes
            var connections = Jel.connections = new Connections();
		    //defining the first canvas, the will contains the root elements
		    var canvas = Jel.Canvas = new canvasView(paletteShapes, canvasShapes, connections);	
		   
		    
		    domReady(function () {
		      run();
		    });

		    function run() {	
    			//call the default initialization function
    			Jel.fn.init();       
    			    
    			new AppRouter(paletteShapes,canvasShapes,connections,canvas);
    			Backbone.history.start();
		    }
	});
  
