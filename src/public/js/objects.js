 //Square object used for rendering boxes 
 function Square(sidelength){
    this.length = sidelength;
 }
 function Rectangle(width, height){
    this.width = width;
    this.height = height;
 }

 function State(id, name, object, description = ""){
 	this.id = id; 
 	this.name = name;
 	this.description = description;
 	this.object = object; //throw an object parameters such as location. 
 }

 function Action(id, name, callback, description = ""){
 	this.id = id;
 	this.name = name;
 	this.callback = callback; 
 	this.description = description;
 }
