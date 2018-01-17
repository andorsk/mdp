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
 	this.setValue = function(val){
 		this.val = val; 
 	}
 	this.converged = false;
 }


 //Action is a action function tied to an agent.
 function Action(id, name, action, description = ""){
 	this.id = id;
 	this.name = name;
 	this.action = action; 
 	this.description = description;
 }

 var pathcost; // set up the path cost with the transition matrix (of state size state.length, state.length)
 //this is to encode variety of pathing costs with associated with a transition between one state and another state. 
 //end is a transition matrix with path costs. 

