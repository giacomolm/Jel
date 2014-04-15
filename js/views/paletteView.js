define(["jquery", "underscore", "backbone", "ractive", "raphael", "collections/Shapes","text!templates/palette.html"],
    function ($, _, Backbone, Ractive, Raphael, Shapes, template) {

    var paletteView = Backbone.View.extend({
	    
        events : {
            "dragstart img" : "drag"
        },	
	
        initialize: function (shapes){
		this.shapes = this.splitByType(shapes);
		for(var propName in this.shapes) {
			if(this.shapes.hasOwnProperty(propName)) {
			   this.render({type: propName || "Base", list:this.shapes[propName]});   
			}
		    }
        },
	
	drag: function(ev){
		//setting data that will be transferred when the element is dropped into the canvas
		ev.dataTransfer = ev.dataTransfer || ev.originalEvent.dataTransfer;	
		ev.dataTransfer.setData("Text",ev.target.id);
	},
	
	splitByType: function(shapes){
		var shapesOrdered = new Object();
		for(i=0; i<shapes.models.length; i++){
			if(shapes.at(i).type==undefined){//base case
				if(! shapesOrdered["base"]) shapesOrdered["base"] = [];
				shapesOrdered["base"].push(shapes.at(i));
			}
			else{ //if attribute type is defined
				if(! shapesOrdered[shapes.at(i).type]) shapesOrdered[shapes.at(i).type] = [];
				shapesOrdered[shapes.at(i).type].push(shapes.at(i));
			}
		}
		return shapesOrdered;
	},

        render: function (shapes) {
	    this.template = new Ractive({el : $(this.el), template: template, data: shapes, append: true });
	    return this;
        }
       
      });

    return paletteView;

  });
