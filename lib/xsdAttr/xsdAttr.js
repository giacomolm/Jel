!function (name, definition) {
    if (typeof define == 'function' && define.amd) define(definition)
    else this[name] = definition()
}('xsdAttr', function() {		        
			var xsdAttr = window.xsdAttr= {};		
				
			xsdAttr.fn = xsdAttr.prototype = {
				getAttributes: function(file, attributeName){
					var http; //contains the xmlhttprequest, in a cross way
					
					if (window.XMLHttpRequest){
						xhttp=new XMLHttpRequest();
					}
					else{// for IE 5/6
						xhttp=new ActiveXObject("Microsoft.XMLHTTP");
					}
					
					xhttp.open("GET",file,false);
					xhttp.send();
					
					var txt =xhttp.response;
	
					var xmlDoc;
					if (window.DOMParser){
					  parser=new DOMParser();
					  xmlDoc=parser.parseFromString(txt,"text/xml");					  
					}
					else{ // Internet Explorer
					  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					  xmlDoc.async=false;
					  xmlDoc.loadXML(txt);
					} 
							
					return xsdAttr.fn.fetchElement(xmlDoc, attributeName, new Object());
				},
				
				fetchElement: function(xmlDoc, elName, result){
					var xmlElement = xmlDoc.querySelector("[name='"+elName+"']");	
					
					var xmlQuery;
					if(xmlElement.getElementsByTagName('attribute').length > 0){ //chrome case
						xmlQuery = xmlElement.getElementsByTagName('attribute');
						
					}
					else{//firefox, IE case
						xmlQuery = xmlElement.getElementsByTagName('xs:attribute');
					}	
					
					var xmlExtension;
					if(xmlElement.getElementsByTagName('extension').length > 0){ //chrome case
						xmlExstension = xmlElement.getElementsByTagName('extension');
					}
					else{
						xmlExstension = xmlElement.getElementsByTagName('xs:extension');
					}
					
					var xmlChoice;
					if(xmlElement.getElementsByTagName('choice').length > 0){ //chrome case
						xmlChoice = xmlElement.getElementsByTagName('choice');
					}
					else{
						xmlChoice = xmlElement.getElementsByTagName('xs:choice');
					}
										
					
					for(i=0; i<xmlQuery.length; i++){
						var name = xmlQuery[i].attributes.name;
						result[name.value] = undefined;											
					}	
					
					for(j=0; j<xmlChoice.length; j++){
						for(k=0; k<xmlChoice[j].children.length; k++){					
							if(result.choice == undefined){
								result.choice= [];
								result.choice[0] = xmlChoice[j].children[k].attributes[0].nodeValue.split(":")[1];
							}
							else{							
								result.choice[result.choice.length];	
								result.choice[k] = xmlChoice[j].children[k].attributes[0].nodeValue.split(":")[1];
							}
						}					
					}					
					
					if((xmlQuery.length==0)&&(xmlExstension.length==0)){
						if(xmlElement.attributes[1].nodeValue){
							return xsdAttr.fn.fetchElement(xmlDoc, xmlElement.attributes[1].nodeValue.split(":")[1], result);
						}
					}			
														
					
					if(xmlExstension[0]){
						var ext = xmlExstension[0].attributes[0].nodeValue;
						return xsdAttr.fn.fetchElement(xmlDoc, ext.split(":")[1], result); //i'm splitting because 
					}
					else return result;
					
				}
			}		
				
			//shim
			xsdAttr.getAttributes = xsdAttr.fn.getAttributes;
			
			return xsdAttr;
	}
);