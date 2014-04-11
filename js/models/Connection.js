define(["jquery", "underscore", "backbone"],
  function ($, _, Backbone) {
    var Connection = Backbone.Model.extend({
      defaults: {
          id: undefined,
          inbound : undefined, //inbound element id
          outbound: undefined, //outbound element id
          el : undefined //represent the grafical element associated
      },
      
      initialize: function(){
        this.id = (new Date()).getTime();
      },

      setId: function(id){
        this.id = id
      },

      getId: function(){
        return this.id;
      },

      setInbound : function(inbound){
        this.inbound = inbound;
      },

      setOutbound: function(outbound){
        this.outbound = outbound;
      },

      //Exporting raw object
      //see here http://stackoverflow.com/questions/10262498/backbone-model-tojson-doesnt-render-all-attributes-to-json
    	toJSON: function(options) {
    	  var connection = new Object();
    	  connection.id = this.id;
    	  connection.inbound = this.inbound;
    	  connection.outbound = this.outbound;	
    	  return _.clone(connection);
    	}

      });

    return Connection;

  });
