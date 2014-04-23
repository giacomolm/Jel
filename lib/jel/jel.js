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

				getSchema: function(){
					if(Jel.xsdFile){
						if (window.XMLHttpRequest){
						  xhttp=new XMLHttpRequest();
						}
						else{// code for IE5 and IE6						
						  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
						}
						xhttp.open("GET",Jel.xsdFile,false);
						xhttp.send();
						return xhttp.responseText;	
					}
					else console.log('Problems with schema file. Have you loaded it?');
				},

				setBaseFile: function(filename){
					this.baseFile = filename;
				},

				setBaseElement : function(element){
					this.baseElement = element;
				},

				setXMLWrapper : function(wrapper){
					this.wrapper = wrapper;
				},

				setNamespace: function(namespace){
					this.namespace = namespace
				},
					
				//converts the current instances shapes in an xml representation
				//basefile: xml file containing the base structure of output result
				//baseElement: contain the base element where new nodes are attached
				//wrapper: if specified, a new node is created and nodes converted are appended to this element
				convert: function(baseFile, baseElement, wrapper){					
					
					//append in the xmldoc the set of shapes under the parent el
					var getXML = function(xmlDoc, parentEl, shapes){

						var i=0;
						for(i=0; i<shapes.length; i++){
							var currentXML, resultXML;
							if(shapes.at(i).metaelement){	
								resultXML = xmlDoc.createElementNS(Jel.namespace, shapes.at(i).metaelement);
								for(var propName in shapes.at(i).props) {
							        if(shapes.at(i).props.hasOwnProperty(propName) && shapes.at(i).props[propName] != "") {
							            resultXML.setAttribute(propName, shapes.at(i).props[propName]);   
							        }
							    }
								parentEl.appendChild(resultXML);		
								//composed case						
								if(shapes.at(i).shapes){
									getXML(xmlDoc, resultXML, shapes.at(i).shapes);	
								}
							}										
						}
					};

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
						
						//in need to specify that the root element belong to the same namespace 
						var ns1 = Jel.namespace;
						wrapperXML = xmlDoc.createElementNS(ns1,wrapper); 

						getXML(xmlDoc, wrapperXML, sortedShapes);
						xmlDoc.getElementsByTagName(baseElement)[0].appendChild(wrapperXML);
							
					}
					else{
						if(el.canvasShapes.at(i).shapes) getXML(xmlDoc, xmlDoc.getElementsByTagName(baseElement)[0], sortedShapes);
					}
					
					if (window.ActiveXObject &&  xmlDoc.xml) {
						return xmlDoc.xml;
					}
					else { // code for Chrome, Safari, Firefox, Opera, etc.
						var result = (new XMLSerializer()).serializeToString(xmlDoc);
						return result;
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
						var i;
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
								var i=0;
								for(i=0; i<edges.length; i++){
									visit(shapes.get(edges[i]));
								}
								temporary.remove(shape.id);
								marked.push(shape);							
											 //fast object cloning
								var newShape = new Jel.Shape(shape);
								list.unshift(newShape);
							}
						}
					};
					var i=0;
					for(i=0; i<shapes.length; i++){
						if(!temporary.get(shapes.at(i))) visit(shapes.at(i));
						//composed shape
						if(shapes.at(i).shapes){
							var shape = list.get((shapes.at(i).id));
							if(shape) shape.shapes = this.topologicalSort(shapes.at(i).shapes, connections);
						}
					}
					return list;
				},
				
				validate: function(model, metamodel) {
				    console.log('Empty valitdation Function. You have to override the validate function in this way: Jel.fn.validate = urValFunct');
				},
				
			};
				
			Jel.fn.init.prototype = Jel.fn;
			
			//shim
			Jel.attachXSD = Jel.fn.attachXSD;
			Jel.setBaseFile= Jel.fn.setBaseFile;
			Jel.setBaseElement= Jel.fn.setBaseElement;
			Jel.setXMLWrapper = Jel.fn.setXMLWrapper;
			Jel.convert = Jel.fn.convert;
			Jel.topologicalSort = Jel.fn.topologicalSort;
			Jel.getSchema = Jel.fn.getSchema;
			Jel.setNamespace = Jel.fn.setNamespace;
			return Jel;
	}
);

