define(["jquery", "underscore", "backbone", "ractive", "raphaelext", "jel", "filesaver", "text!templates/anteprima.html", "raphaelpan"],
    function ($, _, Backbone, Ractive, Raphael, Jel, filesaver, template) {

    var anteprimaView = Backbone.View.extend({
	
    	events :{
                "click #down" : "zoomOut",
                "click #up" : "zoomIn"
        
    	},
    	    
        initialize: function(){
            this.paper = Raphael(this.$el[0], 1024, 800);
            this.panZoom = this.paper.panzoom({ initialZoom: 0, initialPosition: { x: 120, y: 70}, minZoom:-15, maxZoom: 10});
            this.panZoom.enable();

            $(this).on("exported", this.exportHandler);
            this.sizeout = undefined; //event counter

            this.render();
            
        },

        arrange : function(shapes, connections){
            
            //(re)initialize the collection that will contains only the graphical element related to the shape
            this.shapes = new Array();
            this.connections = connections;

            var currentShapes = Jel.topologicalSort(shapes, connections);
            this.drawItems(currentShapes);
        },

        //depth is referred to the current node in the xml document
        //breadth is referred to the composed item into the parent canvas
        //parent contains parent id, if it exists
        drawItems: function(shapes, depth, breadth, parent){
            var indepth = depth || 0;
            var i,temp_breadth=0, curr_breadth = breadth || 0;
            for(i=0; i<shapes.length; i++){

                var level = this.getLevel(shapes.at(i).id);
                console.log(shapes.at(i).url, indepth, level);
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

        //draws connections between current shapeId and all the elements preceeding it, including its parent
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
                  if(this.connections.at(i).inbound == shapeId) max = Math.max(this.shapes[this.connections.at(i).outbound].level+1, max);
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

        exportSVG : function(){
            var svgData = this.paper.toSVG(),
                parser = new DOMParser(),
                doc = parser.parseFromString(svgData, "text/xml");

            var images = doc.querySelectorAll( "image" );
            var canvas = document.createElement('canvas');

            var ctx = canvas.getContext( "2d" );
            
            var i, imgArr = new Array();
            for(i=0; i<images.length; i++){
                imgArr[i] = document.createElement("img");
                imgArr[i].setAttribute( "src", images[i].href.baseVal);
                 
                imgArr[i].onload = function(i, images, context){
                    return function() {
                        ctx.drawImage( imgArr[i], 0, 0, 300, 150); //widht and height are the default canvas width and size --> we 've to fill'it
                        // Now is done
                        svgData = svgData.replace(images[i].href.baseVal,canvas.toDataURL( "image/png" ));

                        $(context).trigger('exported', [images.length, svgData]);

                    }   
                }(i, images,this);
            }

               
        },

        exportHandler : function(event, length, svgData){
            if(this.sizeout) this.sizeout--;
            else this.sizeout = length-1;

            if(this.sizeout == 0){
                var blob = new Blob([svgData], {type: "image/svg"});
                setTimeout(function(){saveAs(blob, "anteprima.svg");}, 1000); //we're taking an extra-second
                this.setAttribute = undefined; 
                //PNG CONVERSION --> Disabled
                /*var img = document.createElement('img');
                img.setAttribute( "src", "data:image/svg+xml;base64," + btoa(svgData));
                var canv = document.getElementById('myCanvas'),context= canv.getContext( "2d" );

                img.onload = function() {
                    context.drawImage( img, 0, 0 );
                    var canvasdata = canv.toDataURL("image/png");
                    var pngimg =  document.getElementById( "myImg" ); 
                    //pngimg.setAttribute( "src", canvasdata);
                };*/
            } 
        },

        render: function (eventName) {
            this.paper.safari();
            this.template = new Ractive({el : $(this.el), template: template, append : true});
            return this;
        },
       
      });

    return anteprimaView;

  });
