define(["jquery", "underscore", "backbone", "jel"],
  function ($, _, Backbone, Jel) {
    var Shape = Backbone.Model.extend({
      defaults: {
          id: undefined,
		  url : undefined,
		  x : 0,
		  y : 0,
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
		}
      },
      
      setImage: function(url){
		this.url = url;
      },
      
      setProperties: function(){

      },
      
      setPosition: function(x,y){
		this.x = x;
		this.y = y;
      },
      
      //element is a string
      setMetaelement: function(element){
		this.metaelement = element;
		if(Jel.xsdFile){		
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

      setName: function(name){
      	this.name = name;
      },
      
      setAsComposed: function(){
		this.type = "composed";
      },
      
      isComposed: function(){
		if(this.type && this.type == "composed") return true;
		else return false;	
      },

      updateProp: function(propName, propValue){
      	this.props[propName] = propValue;

      	$(this.el).trigger("propsChanged",[propName, propValue]);
      }

      });

    return Shape;

  });
