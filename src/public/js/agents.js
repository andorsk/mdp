/*
Contains information about the agent, including (if set), the history of states between agent. 
This creates a new agent. 

You can invoke multiple agents within an MDP problem. 
The action set is the availble actions to a given agent. You can pass by reference 
or the actual function. 

The config can support multiple parameters. 
*/
function Agent(id, name, actionset, config = {}, mdp = {}, jointmdp = {}) {
    this.id = id;
    this.name = name != null ? name : id;
    this.time = 0;
    this.history = {}; //history contains a map of t -> state
    this.config = config;
    this.isfinished = false;
    this.actionset = actionset;
    this.mdp = mdp; //each agent needs to keep track of it's own value map and qmatrix. That is because in certain games agents can have differnet policies. 	
    this.guid = guid();
    this.jointmdp = jointmdp; //joinmdp is the main mdp. 
    this.actionmap = {}
    this.genActionMap = function() {
        for (var i = 0; i < this.actionset.length; i++) {
            this.actionmap[this.actionset[i].name] = this.actionset[i]
        }
    }

    this.genActionMap()
}

Agent.prototype.setActionHandler = function(actionhandler) {
    this.ActionHandler = actionhandler;
}

Agent.prototype.setActionSet = function(actions) {
    this.actionset = actions;
}

Agent.prototype.getActionByName = function(name) {
    if (!this.actionmap.hasOwnProperty(name)) {
        consoleError("Error. Could not find action. Returning")
        return
    }
    return this.actionmap[name]
}
Agent.prototype.setMessageCost = function(cost) {
    this.messagecost = cost;
}

Agent.prototype.getId = function() {
    return this.id;
}

Agent.prototype.getName = function() {
    return this.name;
}
//History is an array of states 
Agent.prototype.setHistory = function(history) {
    this.history = history;
}

//This to be called to push a state WITH REGISTERED STATES and replaces the last state.
//Assumes keys are chronological  
Agent.prototype.replaceLastState = function() {
    var lasttimestamp = Object.keys(this.history).reduce(function(a, b) {
        return this.history[a] > this.history[b] ? a : b
    });
    this.history[lasttimestamp] = this.state;
}

Agent.prototype.getLastState = function() {
    var lasttimestamp = Object.keys(this.history).reduce(function(a, b) {
        return this.history[a] > this.history[b] ? a : b
    });
    return this.history[lasttimestamp]
}

//add a state with a timestep of t+1 to the highest timestep. 
Agent.prototype.addNextState = function(state, timestep) {
    if (Object.keys(this.history).length < 1) {
        this.addState(state, timestep)
        return
    }
    var lasttimestamp = Object.keys(this.history).reduce(function(a, b) {
        return this.history[a] > this.history[b] ? a : b
    });
    this.addState(state, lasttimestamp + timestep)
}

//if the agent finishes, remove him from the main mdp array and call "finish"
Agent.prototype.finish = function() {
    console.log("Agent " + this.id + " has finished making it to the end. Terminating agent actions")
    this.isfinished = true;
    this.jointmdp.activeagents[this.id] = false
}

//Restart Agent at the beginning
Agent.prototype.restart = function() {
    this.isfinished = false;
    this.jointmdp.activeagents[this.id] = true
    this.addNextState(this.mdp.states[this.jointmdp.config.birthnode[0]], 1) //SHOULDN"T assume 0 is the birthnode
}

//Dependent on the game needs to accept differen things, so needs to an interface.
Agent.prototype.ActHandler = function(action, stateprime) {
    var laststate = this.getLastState();
    console.log("Acting")
}

//Exploration function returns a state which is stateprime. . 
Agent.prototype.Explore = function(explorationfunction, context) {
    var stateprime = explorationfunction(context);
    return stateprime;
}

//The act function will add the next state and also update the transition model
//assumes a tick of 1. 
//TODO: Need to design the update to both the join model and the single model better. 
Agent.prototype.Act = function(state, action, stateprime) {
    //check if the space was already occupied
    var s = this.jointmdp.states[stateprime.id]
    this.jointmdp.states[state.id].removeAgentOccupation();
    if (s.setAgentOccupiedIfOpen(this) == -1) {
        return
    };
    this.addNextState(stateprime, 1);
    this.updateTransitionModel(state, action, stateprime);
    if (this.mdp.config.terminalnodes.indexOf(stateprime.id) > -1) {
        this.restart();
    }
}

Agent.prototype.updateModel = function(action, stateprime) {
    this.updateTransitionModels(action, stateprime)
    this.addNextState(stateprime, 1)
}


Agent.prototype.updateTransitionModels = function(action, stateprime) {

    var prevstate = this.getLastState();
    var localmdp = this.mdp;
    var jointmdp = this.jointmdp;

    localmdp.addTransition(prevstate, action, stateprime)
    jointmdp.addTransition(prevstate, action, stateprime)
}

Agent.prototype.getLastState = function() {

    if (Object.keys(this.history).length < 1) {
        return null
    }
    var lasttimestamp = Object.keys(this.history).reduce(function(a, b) {
        return this.history[a] > this.history[b] ? a : b
    });
    return this.history[lasttimestamp];
}

//This should be the main called state function. 
Agent.prototype.addState = function(state, t) {
    this.state = state;
    this.history[t] = state;
}

Agent.prototype.setState = function(state) {
    this.state = state;
}

//@Action object
//@Params
//Executes an action given an agent with a varied noise level
Agent.prototype.executeAction = function(action, params = {}) {

    var action_1 = action;
    if (params.hasOwnProperty("noise")) {
        if (Math.random() <= params.noise && this.actionset.length > 1) {
            var count = 0;
            while (action_1 == action) {
                action_1 = this.chooseRandomAction()
            }
        }
        action = action_1;
    }

    var args = Array.prototype.slice.call(arguments, 2)
    args = [action.action].concat(args)
    var newstate = partial.apply(this, args)()


    if (isNaU(newstate)) {
        return null;
    }

    this.updateModel(action, newstate)
    return newstate;
}

Agent.prototype.chooseRandomAction = function() {
    var index = Math.floor(Math.random() * this.actionset.length);
    return this.actionset[index]
}