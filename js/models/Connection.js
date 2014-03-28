define(["jquery", "underscore", "backbone"],
  function ($, _, Backbone) {
    var Connection = Backbone.Model.extend({
      defaults: {
          id: undefined,
	  inbound : undefined, //inbound element
	  outbound: undefined, //outbound element
	  el : undefined //represent the grafical element associated
      }

      });

    return Connection;

  });
