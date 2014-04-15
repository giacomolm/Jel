!function (name, definition) {
    if (typeof define == 'function' && define.amd) define(definition)
    else this[name] = definition()
}('utils', function() {		        
			var Utils = new Object();
			
			return Utils;
	}
);