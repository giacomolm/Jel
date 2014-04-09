define(["jquery", "underscore", "ractive", "models/Connection"],
    function ($,_,Ractive,Connection) {

    var Connections = Backbone.Collection.extend({
        model: Connection,
	    
      	initialize: function(){
      		//instanciate the desidered video collection  based on the type passed 		
      	},

        //populate the collections starting from an array of connections
        createConnections : function(connections){
          var i;
          for(i=0; i<connections.length; i++){
            var connection = new Connection();
            connection.setId(connections[i].id);
            connection.setInbound(connections[i].inbound);
            connection.setOutbound(connections[i].outbound);
            this.add(connection);
          }     
          return this;
        },
	
      });

    return Connections;

  });

