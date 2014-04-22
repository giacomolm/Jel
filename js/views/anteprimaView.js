define(["jquery", "underscore", "backbone", "ractive", "raphaelext", "jel","text!templates/anteprima.html", "raphaelpan"],
    function ($, _, Backbone, Ractive, Raphael, Jel, template) {

    var anteprimaView = Backbone.View.extend({
	
    	events :{
                "click #down" : "zoomOut",
                "click #up" : "zoomIn"
        
    	},
    	    
        initialize: function(){
            this.paper = Raphael(this.$el[0], 1600, 1600);
            this.panZoom = this.paper.panzoom({ initialZoom: 0, initialPosition: { x: 120, y: 70}, minZoom: -20, maxZoom: 40});
            this.panZoom.enable();

            this.render();
            
        },

        arrange : function(shapes, connections){
            var currentShapes = Jel.topologicalSort(shapes, connections);
            this.drawItems(currentShapes);
        },

        //depth is referred to the current node in the xml document
        //breadth is referred to the composed item into the parent canvas
        drawItems: function(shapes, depth, breadth){
            var indepth = depth || 0;
            var i,temp_breadth=0, curr_breadth = breadth || 0;
            for(i=0; i<shapes.length; i++){
                this.paper.image(shapes.at(i).url, (110*indepth), (60*(temp_breadth+curr_breadth+i)), 86, 54);
                if(shapes.at(i).shapes && shapes.at(i).shapes.length>0){
                    temp_breadth += this.drawItems(shapes.at(i).shapes, indepth+1,temp_breadth+curr_breadth+i+1);
                }
            }
            return shapes.length+temp_breadth;
        }, 

        zoomIn: function(e){
            this.panZoom.zoomIn(1);
            e.preventDefault();
        },

        zoomOut: function(e){
            this.panZoom.zoomOut(1);
            e.preventDefault();
        },

        render: function (eventName) {
            this.paper.safari();
            this.template = new Ractive({el : $(this.el), template: template, append : true});
            return this;
        },
       
      });

    return anteprimaView;

  });
