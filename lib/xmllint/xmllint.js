!function (name, definition) {
    if (typeof define == 'function' && define.amd) define(definition)
    else this[name] = definition()
}('xmllint', function() {

	var xmllint = {};

	xmllint.validateXML = function(xml, schema) {
	  var Module = {
	    xml: xml,
	    schema: schema
	  };
  	  return Module.return;
	};
	return xmllint;
});