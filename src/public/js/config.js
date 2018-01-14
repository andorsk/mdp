/*
General game config class. 
Required fields: 

1. Terminal Nodes
2. Type of Game
3. Start Node

Optional fields: 
1. Rules
2. Settings: ex. decay rate.
*/


var OPTIMIZATIONTYPES = Object.freeze({
	1: "maxit", //run for x amount of iteration
	2: "abstol", //run until error rate reaches close to zero. 
	3: "reltol", //when the realtive improvement starts to decrease
	4: "combination" //combination of reltol and maxit. 
})


//approximation methods for transition probabilies. Enum. 
var APPROX_METHODS = Object.freeze({
	"MCMC": StochasticApproimationMethods.MCMC,
	"Crawl": StochasticApproimationMethods.Crawl,
	"Prune": StochasticApproimationMethods.Prune
})


defaultConfig = {
	decayrate: .85,
	observationlikeliehood: .33,
	optimtype: OPTIMIZATIONTYPES[4]
}

function Config(terminalnodes, birthnode, invalidnodes, type, rules = {}, settings = {}){
	var terminalnodes, birthnode, type, rules

	setDefaultsIfNotPresent(settings)

	this.terminalnodes = terminalnodes;
	this.birthnode = birthnode;
	this.invalidnodes = invalidnodes;
	this.type = type;
	this.rules = rules;
	this.settings = settings;
}

Config.prototype.printConfig = function(){
	console.log("Terminal nodes are : " + this.terminalnodes)
	console.log("Birth Node is : " + this.birthnode)
	console.log("Invalid Nodes are  " + this.invalidnodes)
	console.log("Type is : " + this.type)
	console.log("Rules are: " + this.rules)
	console.log("Settings are " + this.settings);
}

function setDefaultsIfNotPresent(settings){
	//set settings defaults
	if (typeof settings.decayrate == 'undefined' || settings.decayrate == null ){
		settings.decayrate = defaultConfig.decayrate
	}

	if (typeof settings.observationlikeliehood == 'undefined' || settings.observationlikeliehood == null ){
		settings.observationlikeliehood = defaultConfig.observationlikeliehood
	}

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