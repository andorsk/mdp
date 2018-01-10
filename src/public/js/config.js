/*
General game config class. 
Required fields: 

1. Terminal Nodes
2. Type of Game
3. Start Node

Optional fields: 
1. Rules
*/
function Config(terminalnodes, birthnode, type, rules){
	var terminalnodes, birthnode, type, rules

	this.terminalnodes = terminalnodes;
	this.birthnode = birthnode;
	this.type = type;
	this.rules = rules;
}


/*
A node is a state. The node must have at least a name and an index. It is common to give the node the same name as the index
The map variable can store additional information. 
*/
function Node(index, name, value, map){
	this.index = index;
	this.name = name;
	this.value = value;
	this.map = map; 
}