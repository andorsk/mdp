/*
Contains information about the agent, including (if set), the history of states between agent. 
This creates a new agent. 

You can invoke multiple agents within an MDP problem. 
The action set is the availble actions to a given agent. You can pass by reference 
or the actual function. 
*/
function Agent(id, name, actionset){
	this.id = id;
	this.name = name != null ? name : id;
	this.time = 0;
	this.history = {}; //history contains a map of t -> state
	this.actionset = actionset;
}

Agent.prototype.setActionSet = function(actions){
	this.actionset = actions;
}

Agent.prototype.setMessageCost = function(cost){
	this.messagecost = cost;[]
}
Agent.prototype.getId = function(){
	return this.id;
}

Agent.prototype.getName = function(){
	return this.name;
}
//History is an array of states 
Agent.prototype.setHistory = function(history){
	this.history = history;
}

//This to be called to push a state WITH REGISTERED STATES and replaces the last state.
//Assumes keys are chronological  
Agent.prototype.replaceLastState = function(){
	var lasttimestamp = Object.keys(this.history).reduce(function(a, b){ return this.history[a] > this.history[b] ? a : b });
	this.history[lasttimestamp] = this.state;
}

//add a state with a timestep of t+1 to the highest timestep. 
Agent.prototype.addNextState = function(state, timestep){
	var lasttimestamp = Object.keys(this.history).reduce(function(a, b){ return this.history[a] > this.history[b] ? a : b });
	this.addState(state, lasttimestamp + timestep)
}

Agent.prototype.getLastState = function(){
	var lasttimestamp = Object.keys(this.history).reduce(function(a, b){ return this.history[a] > this.history[b] ? a : b });
	return this.history[lasttimestamp];
}

//This should be the main called state function. 
Agent.prototype.addState = function(state, t){
	this.state = state;
	this.history[t] = state;
}

Agent.prototype.setState = function(state){
	this.state = state;
}