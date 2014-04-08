define(["jquery", "underscore", "backbone"],
  function ($, _, Backbone) {
    var Connection = Backbone.Model.extend({
      defaults: {
          id: undefined,
          inbound : undefined, //inbound element
          outbound: undefined, //outbound element
          el : undefined //represent the grafical element associated
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
