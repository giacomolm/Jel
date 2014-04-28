define(["jquery", "underscore", "backbone", "jel"],
  function ($, _, Backbone, Jel) {
    var Shape = Backbone.Model.extend({
      defaults: {
          id: undefined,
		  url : undefined,
		  x : 0,
		  y : 0,
		  width : 0,
		  height : 0,
		  props : undefined, //properties associated to shape, retrieved with the help of the meta-element attribute
		  el : undefined, //represent the grafical element associated
		  metaelement : undefined, // if an xsd is attached, represents the corresponding element 
		  type : "base",
		  shapes : undefined, //if the shape is composed, it's composed of subelement, included in the shapes attr
		  name : undefined, //name (alias) associated to the shape
      },
      
      initialize: function(shape){
		if(shape instanceof Shape){
			this.id = shape.id;
			this.url = shape.url;
			this.x = shape.x;
			this.y = shape.y;
			this.props = shape.props;
			this.el = shape.el;
			this.metaelement = shape.metaelement;
			this.name = shape.name;
			this.width = shape.width;
			this.height = shape.height;
		}
      },

      setId: function(id){
      	this.id = id;
      },
      
      setImage: function(url){
		this.url = url;
		//this.set("url", url);
      },
      
      setProperties: function(props){
      	if(props) this.props = _.clone(props);
		else if(Jel.xsdFile){		
				var result= xsdAttr.getAttributes(Jel.xsdFile,this.metaelement);
				this.props = new Object();
				for(var propName in result) {
				    if(result.hasOwnProperty(propName)) {
					//define its value as an empty string
					this.props[propName] = '';   
				    }
				}
			}
      },
      
      setPosition: function(x,y){
		this.x = x;
		this.y = y;
      },
      
      //element is a string
      setMetaelement: function(element){
		this.metaelement = element;
		this.setProperties();
      },

      setName: function(name){
      	this.name = name;
      },
      
      setType: function(type){
      	this.type = type;
      },

      setAsComposed: function(){
		this.type = "composed";
      },

      setDimension: function(width,height){
      	this.width = width;
      	this.height = height;
      },
      
      isComposed: function(){
		if(this.type && this.type == "composed") return true;
		else return false;	
      },

      updateProp: function(propName, propValue){
      	this.props[propName] = propValue;

      	$(this.el).trigger("propsChanged",[propName, propValue]);
      },

      //Exporting raw object
      //see here http://stackoverflow.com/questions/10262498/backbone-model-tojson-doesnt-render-all-attributes-to-json
    	toJSON: function(options) {
    	  var shape = new Object();
    	  shape.id = this.id;
    	  shape.id = shape.id;
		  shape.url = this.url;
		  if(this.el){
		  	shape.x = this.el.attrs["x"];
		  	shape.y = this.el.attrs["y"];
		  }
		  else{
			  shape.x = this.x;
			  shape.y = this.y;
		  }
		  shape.props = this.props;
		  shape.metaelement = this.metaelement;
		  shape.name = this.name;
		  shape.type = this.type;
		  if(this.shapes){
		  	var i;
		  	shape.shapes = new Array(this.shapes.length);
		  	for(i=0; i<this.shapes.length; i++)
		  		shape.shapes[i] = this.shapes.at(i).toJSON(); 
		  }
		  return _.clone(shape);
		}

      });

    return Shape;

  });
