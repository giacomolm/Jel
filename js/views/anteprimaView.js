define(["jquery", "underscore", "backbone", "ractive", "raphaelext", "jel", "filesaver", "text!templates/anteprima.html", "raphaelpan"],
    function ($, _, Backbone, Ractive, Raphael, Jel, filesaver, template) {

    var anteprimaView = Backbone.View.extend({
	
    	events :{
                "click #down" : "zoomOut",
                "click #up" : "zoomIn"
        
    	},
    	    
        initialize: function(){
            this.paper = Raphael(this.$el[0], 200, 200);
            //this.panZoom = this.paper.panzoom({ initialZoom: -5, initialPosition: { x: 0, y: 0}, minZoom:-10, maxZoom: 10});
            //this.panZoom.enable();

            $(this).on("exported", this.exportHandler);
            this.sizeout = undefined; //event counter

            this.render();
            
        },

        arrange : function(shapes, connections){
            
            //(re)initialize the collection that will contains only the graphical element related to the shape
            this.shapes = new Array();
            this.connections = connections;
            //this.panZoom.disable();

            //current shapes need to be sorted in a topological way
            this.currentShapes = Jel.topologicalSort(shapes, connections);
            this.drawItems(this.currentShapes);

            //adapting anteprima size to fit its content
            var anteprimaWidth = 0, anteprimaHeight = 0;
            for (key in this.shapes) {                
               var temp_width = this.shapes[key].level+this.shapes[key].attrs.width;
                if(anteprimaWidth<temp_width){
                    anteprimaWidth = temp_width;
                }
                anteprimaHeight = Math.max(this.getBreadth(key), anteprimaHeight);
            }

            //if(anteprimaWidth>1024 || anteprimaHeight>800)
            this.paper.setSize(anteprimaWidth, anteprimaHeight);
            this.panZoom = this.paper.panzoom({ initialZoom: -10, initialPosition: { x: 0, y: 0}, minZoom:-10, maxZoom: 10});
            this.panZoom.enable();


            this.render();
            
        },

        //drawing items in the anteprima section
        //parent contains parent id, if it exists
        drawItems: function(shapes, parent){
            var i;
            for(i=0; i<shapes.length; i++){

                //calculating the offSetX..
                var level = this.getLevel(shapes.at(i).id) || 0;
                //.. and the offSetY
                var breadth = this.getBreadth(shapes.at(i).id, parent);
                //console.log(shapes.at(i).id, shapes.at(i).height, breadth)
                //Calculating the width depending the parent position, if it exists
                if(parent) level = Math.max(parent.attrs.width + parent.level+30, level);
                var currentText = this.paper.text(level+20, breadth+5, shapes.at(i).name + ((shapes.at(i).props && shapes.at(i).props.id) ? ":"+shapes.at(i).props.id : ""));
                var currentShape = this.paper.image(shapes.at(i).url, level, breadth+12, shapes.at(i).width || 86 , shapes.at(i).height || 54);
                //setting the original id
                currentShape.id = shapes.at(i).id;
                //setting the level, indicating the margin left, in order to retrieve it later
                currentShape.level = level;
                if(parent) currentShape.parent = parent;

                this.shapes[shapes.at(i).id] = currentShape;
                //draw connnections betwenn element of the same level and between the element and its father
                if(parent) this.drawConnections(shapes.at(i).id, parent.id);
                else this.drawConnections(shapes.at(i).id);
                if(shapes.at(i).shapes && shapes.at(i).shapes.length>0){
                    this.drawItems(shapes.at(i).shapes, currentShape);
                }
            }
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

        //calcute the rightmost-innermost element that precedes the current shape: it useful to understand the indentation of an element in Anteprima
        getLevel: function(shapeId){
            var i, max = 0;
            for(i=0; i<this.connections.length; i++){
                if(this.connections.at(i).inbound == shapeId){
                    max = Math.max(this.shapes[this.connections.at(i).outbound].attrs.width+this.shapes[this.connections.at(i).outbound].level, max);
                }
            }
            return max+30;
        },

        getBreadth : function(shapeId){
            var i, current_breadth = 0;

            for (id in this.shapes) {
                current_breadth += this.shapes[id].attrs.height + 20; 
            }

            return current_breadth;
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
