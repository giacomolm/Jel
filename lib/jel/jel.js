!function (name, definition) {
    if (typeof define == 'function' && define.amd) define(definition)
    else this[name] = definition()
}('Jel', function() {
			//if yet defined, return that
		        if(window.Jel) return window.Jel;
			var Jel = window.Jel= {};		
			
			//model
			Jel.Shape = {};
			// collection related to palette
			Jel.paletteShapes = {};
			//instances into the canvas
			Jel.canvasShapes = {};
			//instances of canvases connections
			Jel.connections = {};
				
			Jel.fn = Jel.prototype = {
				init: function(initial) {
				    console.log('Empty initialization. You have to override the Jel.fn.init method');
				},
				
				setPalette: function(palette){
					this.palette = palette;
				},
				
				attachXSD: function(file){
					this.xsdFile = file;
				},
				
				getXML: function(xmlDoc, parentEl, shapes){
					var i=0;
					for(i=0; i<shapes.length; i++){
						var currentXML, resultXML;
						if(shapes.at(i).metaelement){							
							resultXML = xmlDoc.createElement(shapes.at(i).metaelement);
							parentEl.appendChild(resultXML);		
							//composed case						
							if(shapes.at(i).shapes) this.getXML(xmlDoc, resultXML, shapes.at(i).shapes);	
						}										
					}
					
				},
				
				//converts the current instances shapes in an xml representation
				//basefile: xml file containing the base structure of output result
				//baseElement: contain the base element where new nodes are attached
				//wrapper: if specified, a new node is created and nodes converted are appended to this element
				convert: function(baseFile, baseElement, wrapper){					
					
					//load the bas structure of the xml file
					if (window.XMLHttpRequest){
					  xhttp=new XMLHttpRequest();
					}
					else{// code for IE5 and IE6						
					  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
					}
					xhttp.open("GET",baseFile,false);
					xhttp.send();
					xmlDoc = xhttp.responseXML;	

					var sortedShapes = this.topologicalSort(Jel.canvasShapes, Jel.connections);	
					
					var wrapperXML;
					if(wrapper){
						wrapperXML = xmlDoc.createElement(wrapper);
						this.fn.getXML(xmlDoc, wrapperXML, sortedShapes);
						xmlDoc.getElementsByTagName(baseElement)[0].appendChild(wrapperXML);												
					}
					else{
						if(el.canvasShapes.at(i).shapes) this.getXML(xmlDoc, xmlDoc.getElementsByTagName(baseElement)[0], sortedShapes);
					}
					
					/*for(i=0; i<Jel.canvasShapes.length; i++){
						var currentXML, resultXML;
						if(Jel.canvasShapes.at(i).metaelement){							
							resultXML = xmlDoc.createElement(Jel.canvasShapes.at(i).metaelement);							
							if(wrapperXML) {
								wrapperXML.appendChild(resultXML); 
								xmlDoc.getElementsByTagName(baseElement)[0].appendChild(wrapperXML);
								if(el.canvasShapes.at(i).shapes) this.getXML(resultXML, el.canvasShapes.at(i).shapes)
							}
							else xmlDoc.getElementsByTagName(baseElement)[0].appendChild(resultXML);						
						}										
					}*/
					
					if (window.ActiveXObject) {
						console.log(xmlDoc.xml);
						 return xmlDoc.xml;
					}
					else { // code for Chrome, Safari, Firefox, Opera, etc.
						console.log((new XMLSerializer()).serializeToString(xmlDoc));
						return (new XMLSerializer()).serializeToString(xmlDoc);
					}
				},

				//sort the shape collection depending on graph connections
				//shapes: shapes involveed 
				//connection: input shapes collections
				topologicalSort: function(shapes, connections){
					var unmarked = shapes;
					var temporary = new Backbone.Collection();
					var marked = new Backbone.Collection();
					var list = new Backbone.Collection();

					var getOutboundEdges = function(shape){
						result = [];
						for(i=0; i<connections.length; i++){
							if(connections.at(i).outbound == shape.id){	
								result.push(connections.at(i).inbound);
							}
						}
						return result;
					};

					var visit = function(shape){
						if(temporary.get(shape.id)) console.log("Not a DAG", shape.id);
						else{
							if(!marked.get(shape.id)){
								temporary.add(shape);
								var edges = getOutboundEdges(shape);
								for(i=0; i<edges.length; i++){
									visit(shapes.get(edges[i]));
								}
								temporary.remove(shape.id);
								marked.push(shape);								
								list.unshift(shape);
							}
						}
					};

					for(i=0; i<shapes.length; i++){
						if(!temporary.get(shapes.at(i))) visit(shapes.at(i));
						//composed shape
						if(shapes.at(i).shapes) shapes.at(i).shapes = this.topologicalSort(shapes.at(i).shapes, connections);
					}
					return list;
				},
				
				
			}
				
			Jel.fn.init.prototype = Jel.fn;
			
			//shim
			Jel.attachXSD = Jel.fn.attachXSD;
			Jel.convert = Jel.fn.convert;
			Jel.topologicalSort = Jel.fn.topologicalSort;
			
			return Jel;
	}
);

