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
            
            //(re)initialize the collections that will contain only the graphical element related to the element
            this.shapes = new Array();
            this.connections = connections;

            var currentShapes = Jel.topologicalSort(shapes, connections);
            this.drawItems(currentShapes);
        },

        //depth is referred to the current node in the xml document
        //breadth is referred to the composed item into the parent canvas
        //parent contains parent id 
        drawItems: function(shapes, depth, breadth, parent){
            var indepth = depth || 0;
            var i,temp_breadth=0, curr_breadth = breadth || 0;
            for(i=0; i<shapes.length; i++){

                var level = this.getLevel(shapes.at(i).id);

                var currentShape = this.paper.image(shapes.at(i).url, (150*(indepth+level)), (90*(temp_breadth+curr_breadth+i)), 86, 54);
                //setting the level, in order to retrieve it later
                currentShape.level = level;
                //we need to reset the element id in order to work with the right connections
                this.shapes[shapes.at(i).id] = currentShape;
                //draw connnections betwenn element of the same level and between the element and its father
                this.drawConnections(shapes.at(i).id, parent);
                if(shapes.at(i).shapes && shapes.at(i).shapes.length>0){
                    temp_breadth += this.drawItems(shapes.at(i).shapes, indepth+level+1,temp_breadth+curr_breadth+i+1, shapes.at(i).id);
                }
            }
            return shapes.length+temp_breadth;
        },

        //draws connections between current shapeId and all the elements preceeding it
        drawConnections: function(shapeId, parent){
            var i, atleastone=false;
            for(i=0; i<this.connections.length; i++){
                 if(this.connections.at(i).inbound == shapeId){
                    this.paper.connection(this.connections.at(i).id, this.shapes[this.connections.at(i).outbound],this.shapes[this.connections.at(i).inbound],"#000", undefined, this);
                    atleastone = true;
                 }
            }
            if(!atleastone && parent) this.paper.connection(undefined, this.shapes[parent],this.shapes[shapeId],"#000", undefined, this);
        },

        //calcute the innermost element that precedes the current shape: it useful to understand the indentation of an element in Anteprima
        getLevel: function(shapeId){
            var i, max = 0;
            for(i=0; i<this.connections.length; i++){
                  if(this.connections.at(i).inbound == shapeId) max = Math.max(this.shapes[this.connections.at(i).outbound].level, max+1);
            }
            return max;
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
