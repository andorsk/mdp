/*
Contains information about the agent, including (if set), the history of states between agent. 
This creates a new agent. 

You can invoke multiple agents within an MDP problem. 
The action set is the availble actions to a given agent. You can pass by reference 
or the actual function. 

The config can support multiple parameters. 
*/
function Agent(id, name, actionset, config = {}, mdp={}, jointmdp = {}){
	this.id = id;
	this.name = name != null ? name : id;
	this.time = 0;
	this.history = {}; //history contains a map of t -> state
	this.config = config; 
	this.isfinished = false;
	this.actionset = actionset;
	this.mdp= mdp; //each agent needs to keep track of it's own value map and qmatrix. That is because in certain games agents can have differnet policies. 	
	this.guid = guid();
	this.jointmdp = jointmdp; //joinmdp is the main mdp. 
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

//if the agent finishes, remove him from the main mdp array and call "finish"
Agent.prototype.finish = function(){
 	console.log("Agent " + this.id + " has finished making it to the end. Terminating agent actions")
	this.isfinished = true; 
	this.jointmdp.activeagents[this.id] = false
}

//Restart Agent at the beginning
Agent.prototype.restart = function(){
	this.isfinished = false;
	this.jointmdp.activeagents[this.id] = true
	this.addNextState(this.mdp.states[this.jointmdp.config.birthnode[0]],1) //SHOULDN"T assume 0 is the birthnode
}

//The act function will add the next state and also update the transition model
//assumes a tick of 1. 

//TODO: Need to design the update to both the join model and the single model better. 
Agent.prototype.Act = function(state, action, stateprime){
	//check if the space was already occupied
	var s = this.jointmdp.states[stateprime.id]
	this.jointmdp.states[state.id].removeAgentOccupation();
	if(s.setAgentOccupiedIfOpen(this) == -1){
		return
	};
	this.addNextState(stateprime, 1);

	this.updateTransitionModel(state, action, stateprime);
	if(this.mdp.config.terminalnodes.indexOf(stateprime.id) > -1){
		this.restart();
	}
}

/*
Updates the agents transition models. Need the indexed values of the matrix. 
Alternative: Could rewrite the matrix as keys and then insert. 
*/
Agent.prototype.updateTransitionModel = function(state, action, stateprime){
	var tmat = this.mdp.qmatrix.tmat;
	var jointtmat = this.mdp.qmatrix.tmat;

	this.mdp.qmatrix.tmat[state.id][action.id][stateprime.id] = tmat[state.id][action.id][stateprime.id] + 1;	
	this.jointmdp.qmatrix.tmat[state.id][action.id][stateprime.id] = this.jointmdp.qmatrix.tmat[state.id][action.id][stateprime.id] + 1;	
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

//Agent can have a noise factor associated with any action
Agent.prototype.executeAction = function(action, context){
	this.currentaction = action; //needed so that the action index can be queried later. 

	if(Math.random() <= context.noise){
		//choose new action
		var newaction = action;
		while(newaction == action){
			newaction = this.chooseRandomAction()
		}
		action = newaction;
	} 
	action.action(context.game, context.agent);
}

Agent.prototype.chooseRandomAction = function(){
	var index = Math.floor(Math.random() * this.actionset.length);
	return this.actionset[index]
}
/*
There are a couple things to consider. Agents may have different policies. So each agent 
can have a policy associated with it. 

Each agent also has differnet actions. 
*/


