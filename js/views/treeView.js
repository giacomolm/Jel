define(["jquery", "underscore", "backbone", "ractive", "jstree", "text!templates/tree.html"],
    function ($, _, Backbone, Ractive, jstree, template) {

    var treeView = Backbone.View.extend({

        events : {
        },	
	
        initialize: function (options){
            if(this.collection.length>0){
                this.treeContent = this.convertShapes(this.collection);
            }
            //getting the canvas passed through the options parameter
            this.canvas = options.canvas;
            //Custom events binding, triggered in the router
            this.collection.bind('addShape', function(){this.convertHandler()}, this);
            this.collection.bind('deleteShape', function(){this.convertHandler()}, this);

			this.render();
        },

        convertShapes: function(shapes, parent){
            if(shapes){
                var i, result = "[";
                for(i=0; i<shapes.length; i++){
                    //result+="{ \"id\" : \""+shapes.at(i).id+"\"";
                    result+="{ \"text\" : \""+shapes.at(i).name+"\"";
                    if(parent) result+=", \"canvas\" : \""+parent+"\"";
                    var child;
                    if(child = this.convertShapes(shapes.at(i).shapes, shapes.at(i).id))
                            result+=", \"children\" : "+child+"";
                    result+="}";
                    if(i<shapes.length-1) result+=",";
                }
                return result+"]";
            }
        },

        convertHandler : function(ev){
           this.treeContent = this.convertShapes(this.collection, this.canvas.id);
           this.render();
        },

        render: function (eventName) {

		    this.template = new Ractive({el : $(this.el), template: template});
            $(this.el).empty();
            this.tree = $(this.el).jstree({ core : {data : $.parseJSON(this.treeContent)}}
                             );
            $(this.tree).on('select_node.jstree', function (e, data) {
                                  if(data.node.original.canvas) Backbone.history.navigate("canvas/"+data.node.original.canvas, {trigger:true});
                              });
            $(this.tree).bind("loaded.jstree", function (event, data) {
                // you get two params - event & data - check the core docs for a detailed description
                 data.instance.open_all();
            });   
            //forcing the element to be without classes
            $(this.el)[0].className="";
		    return this;
        }
       
      });

    return treeView;

  });
