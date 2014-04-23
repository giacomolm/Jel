!function (name, definition) {
    if (typeof define == 'function' && define.amd) define(definition)
    else this[name] = definition()
}('xsdAttr', function() {		        
			var xsdAttr = window.xsdAttr= new Object();		
				
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
					
					var txt = xhttp.response || xhttp.responseText;
	
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
				
				//Internet Explorer doesn't fully support query selector: it returns only the parent element, withuout childs
				//xmlDoc refers to xml document
				//tag name refers to potential tags containing the attribute value
				//attribute containt the value related to the name of the element
				selectElement: function(xmlDoc, tagname, attribute){
					var elements = xmlDoc.getElementsByTagName(tagname);
					var i;
					for(i=0; i<xmlDoc.getElementsByTagName(tagname).length; i++){
						var element = xmlDoc.getElementsByTagName(tagname)[i];
						//console.log(element.getAttribute("name"), attribute);
						if(element.getAttribute("name") == attribute) return element;
					} 
				},
				
				fetchElement: function(xmlDoc, elName, result){
					var xmlElement = xmlDoc.querySelector("[name='"+elName+"']");	
					if(xmlElement){
						var xmlQuery;
						
						if(xmlElement.getElementsByTagName('attribute').length > 0){ //chrome case
							xmlQuery = xmlElement.getElementsByTagName('attribute');
						}
						else if(xmlElement.getElementsByTagName('xs:attribute').length > 0){//firefox,
							xmlQuery = xmlElement.getElementsByTagName('xs:attribute');
						}
						else if(((window.ActiveXObject+"").substring(0,9))!="undefined"){//IE
							xmlQuery = xsdAttr.fn.selectElement(xmlDoc, "xs:complexType",elName);
							if(!xmlQuery){
								xmlQuery = xsdAttr.fn.selectElement(xmlDoc, "xs:element",elName);
								xsdAttr.fn.fetchElement(xmlDoc, xmlQuery.getAttribute("type").split(":")[1], result)
							}
						}
						else{//firefox,
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
						
						if(xmlQuery){
							for(i=0; i<xmlQuery.length; i++){
								var name = xmlQuery[i].attributes.name;
								result[name.value] = undefined;											
							}	
						}
						
						for(j=0; j<xmlChoice.length; j++){
							if(xmlChoice[j].children){
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
						}					
						
						//basic element case
						if(xmlQuery && (xmlQuery.length==0)&&(xmlExstension.length==0)){
							if(xmlElement.attributes[1] && xmlElement.attributes[1].nodeValue){
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
			}		
				
			//shim
			xsdAttr.getAttributes = xsdAttr.fn.getAttributes;
			
			return xsdAttr;
	}
);