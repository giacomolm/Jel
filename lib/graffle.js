Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

Raphael.fn.menu = function (itemList){
	var raphael = setted().getRaphael();	
	this.box = raphael.rect(0,0,100,50);
	this.boxtext = raphael.text(60,20,"Add arrow");
	this.boxtext.type = 'text';
	this.boxtext.click(function(){
					var editor = setted();
					editor.arrowActive.pending = true;
					editor.arrowActive.source = editor.active;
				}
	);
	this.box.attr({fill:'grey'});
	this.el = raphael.set();
	this.el.attr({zIndex : '99999'});;
	this.el.push(this.box);
	this.el.push(this.boxtext);
	this.el.hide();
	this.el.parentShow = this.el.show;
	
	this.el.show = function(posx,posy){		
		posx = posx -260;
		posy = posy + 20;
		this.forEach(function(el){
			
			if(el.type == 'text')
				el.attr({x:posx+30,y:posy+10});
			else  el.attr({x:posx,y:posy});
			}
		);
		
		this.parentShow();
	};
	
	raphael.safari();
	
	return this.el;
};

function allowDrop(ev)
{
	ev.preventDefault();
}

function setted(w){
	this.n;
	if(!this.n){
		this.n=w;
	}
	return n;
}

//Palette Object
function palette(ed){
	this.elements=[];
	this.editor = ed;

	this.add = function(obj){
		this.elements[this.elements.length] = obj;
		
		var img = document.createElement("IMG");
		img.setAttribute("id", this.elements.length-1);
		img.setAttribute("src", obj.url);
		img.setAttribute("draggable", "true");
		img.ondragstart = function drag(ev){			
			ev.dataTransfer = ev.dataTransfer | e.originalEvent.dataTransfer;	
			ev.dataTransfer.setData("Text",event.target.id);
		}
		$('#palette').append(img);
		
		console.log("Added Element with url "+obj.url);
	};

};

//Palette Element
function element(url, props){
	this.url = url;
	this.props = props;
};

function editor(){
	var dragger = function () {
        this.ox = this.type == "ellipse" ? this.attr("cx") : this.attr("x");
        this.oy = this.type == "ellipse" ? this.attr("cy") : this.attr("y");
        this.animate({"fill-opacity": .2}, 500);
    },
        up = function () {
            this.animate({"fill-opacity": 0}, 500);
        };
	this.holder = document.getElementById('holder');
	
	//Editor main objects
        this.r = Raphael("holder", 640, 480);
        this.connections = [];
	this.elements = [];
        this.shapes = [];
	this.p = new palette(this);

	//current active object
	this.active = null;
	
	//if an arrow is on creation
	this.arrowActive = function(){
			this.pending = false;
			this.source;
		};
	
	//Editor functions
	this.addShapes = function(obj){
		var i = this.shapes.length;
		obj.id = i;
		this.shapes[i] = obj;
		var color = Raphael.getColor();
        	this.shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	        this.shapes[i].drag(this.move(this), dragger, up);
		this.shapes[i].contextmenu(function(event){
			setted().active = this;
			if(setted().contextMenu){
				setted().contextMenu.show(event.clientX,event.clientY);
			}
			event.preventDefault(true);
		});
		
		this.shapes[i].click(function(event){
			if(setted().arrowActive.pending){
				setted().arrowActive.pending = false;
				alert(setted().arrowActive.source+" "+this);
				setted().connections.push(setted().r.connection(setted().arrowActive.source, this, "#000"));
			}
			setted().active = this;
			setted().changeProps(this);
			event.preventDefault(true);
		});
	};
	this.getConnections = function(){
		return this.connections;	
	};
	this.getRaphael = function(){
		return this.r;
	};
	this.getEditor = function(){
		return this;
	};
	this.getPalette = function(){
		return this.p;
	};
	this.changeProps = function(obj){
		var props_div = document.getElementById('props');
		props_div.innerHTML = "";
		for(var propertyName in obj.props) {
		   var text = document.createTextNode(propertyName);
		   props_div.appendChild(text);
		   var input = document.createElement("input");
		   input.setAttribute("type", "text");
		   input.setAttribute("value", obj.props[propertyName]);
		   input.setAttribute("id", propertyName);
		   input.onkeyup = function (ev){
				setted().active.props[ev.target.id] = ev.target.value;
			        if(ev.target.id=="id") setted().active.text.attr({text : ev.target.value});
				setted().getRaphael().safari();
			   }
		   props_div.appendChild(input);
		}
	}

	//Editor events
	this.move = function (ed) {		
	    return function(dx, dy){
		var att = this.type == "ellipse" ? {cx: this.ox + dx, cy: this.oy + dy} : {x: this.ox + dx, y: this.oy + dy};
		for(i=0; i<this.parent.items.length; i++){
			this.parent.items[i].attr(att);
		}
		connections = ed.getConnections();
		r = ed.getRaphael();
		for (var i = connections.length; i--;) {
		    r.connection(connections[i]);
		}
		r.safari();
	    }
        };
	
	this.r.canvas.ondrop = function(ev){
		var obj =setted().getPalette().elements[ev.dataTransfer.getData("Text")];		
		var ed = setted();
		var img = ed.getRaphael().image(obj.url, 280, 280, 86, 54);		
		var text = ed.getRaphael().text(280,320,obj.props.id);
		var el = ed.getRaphael().set();
		img.text = text;
		img.props = JSON.parse(JSON.stringify(obj.props)); //avoid copy by reference 
		img.parent = el;
		el.push(img);
		el.push(text);		
		ed.addShapes(el);
		ev.preventDefault();
	};
	
	this.r.canvas.onclick = function(ev){
		setted().contextMenu.hide();
	};
	
	this.getContextMenu = function(){
		var contextMenu = setted().getRaphael().menu();
		return contextMenu;
	};
	
	//set this editor as the default one
	setted(this);
	 
	
	this.contextMenu = this.getContextMenu();

    return this;
}

window.onload = function () {
	var ed = new editor();
	
	var mee = new element('img/me.gif', {id:"me",from:"direct:camel"});
	var met = new element('img/mt.gif', {id:"mt",bean:"uwfAdapter", method:"create"});
	ed.getPalette().add(mee);
	ed.getPalette().add(met);
	
	

};

