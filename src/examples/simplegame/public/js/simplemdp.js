//global variables for later access
var game;
var markovmodel; 
var conf; 

//Policies can be uploaded by a config or can be generated through iteration. In this case we've uploaded a policy. 
//You can encode the actions with a mapping if that is preferable. 
var samplepolicy = {
0: 1,
1: 2,
2: 3,
3: 2,
4: 1,
6: 4,
7: 3,
8: 4,
9: 10,
10: 11,
11: 7
	}  


$(document).ready(function(){
	//start to asynchonously load all the scripts in the order presented in the helper function. 
	loadScripts();

	//Render Config Settings	
	var renderconfig = {
		wblocks: 4,
		hblocks: 3,
		width: 500,
		height: 300,
		selector: "#simplegamecontainer" //this div to insert the svg container in. 
	}
	//Markov Settings
	var terminalnodes = [1,2]
	var birthnodes = [8]
	var invalidnodes = {5: "true"}
	var type = "grid"
    var settings =  {"decayrate": .85, "observationlikeliehood": .33, "learningrate": .1} 
	var rules =  {
       8: {"index": 8,"action": "start", "color": "blue"}, 
       3: {"index": 3,"action": "win", "color": "green", "reward": 1}, 
       5: {"index": 3,"action": "invalid", "color": "grey"}, 
       7: {"index": 7,"action": "lose", "color": "red", "reward": -1}
   }

 	/**
 	The waitUtilScriptLoaded checks and makes sure that the necessary scripts are loaded. The program will try and load them 
 	asynchronously at the beginning. If it isn't loaded, it will force a synchronous load to the script. This is to ensure the dependencies are met. 
 	*/
	waitUntilScriptLoaded("/js/config.js");
	settings.optimtype = OPTIMIZATIONTYPES[4]; //set the optimtype to combination;
	conf = new Config(terminalnodes, birthnodes, invalidnodes, type, rules, settings)
	console.log("Staring Simple MDP");

	waitUntilScriptLoaded("/js/objects.js");
	var states = createStates(12);
	var actions = createActions();

	waitUntilScriptLoaded("/js/agents.js");
	var agents = createAgents(1, actions, states);

	markovmodel = new MDP(states, actions, agents, conf)
	markovmodel = markovmodel.New()
	console.log("Created the Markov Model")

	//load game
	waitUntilScriptLoaded("/js/game.js");
	game  = new GridGameDrawer(markovmodel, renderconfig);
	game = game.Start();

	var statepolicy =  policyIDToStateMapping(samplepolicy, states);
	var tick = 0; 

	//agent update policy	
	setInterval(function(){
		//markovmodel.updateAgentsPositionByStateSpacePolicy(statepolicy);	
		for(var i = 0; i < agents.length; i++){
			var ind = Math.floor(Math.random() * agents[i].actionset.length) 
			agents[i].actionset[ind].action(game, agents[i]); //right now need to pass itself. should not need to do htis.
		}
		game.updateMarkovModel(markovmodel)
		game.Update()}, 1000)
});



//Move agents by one. mostly for testing. 
function MoveAgents(markovmodel){
	var states = markovmodel.states;
	var agents = markovmodel.agents;

	var ret = []
	for(var i = 0; i < agents.length; i++){
		var agent = agents[i];
		var id = agent.getLastState().id
		var newid = id >= states.length - 1 ? 0  : id + 1
		agent.addNextState(states[newid])
		ret.push(agent)
	}
	markovmodel.updateAgents(agents)
}

function policyIDToStateMapping(policy, states){
	var ret = {}
	for(key in policy){
		var s1 = key
		var s2 = policy[key]
		ret[JSON.stringify(states[s1])] = states[s2]; 
	}
	return ret;
}

//create agents helper. In this case all agents will have the same actionset. (down, left, right, up)
function createAgents(num, actions, states){
	var agents = []
	for(var i = 0; i < num; i++){
		var agent = new Agent(id = i, name = i, actionset = actions, config = {"action-error": .25})
		agent.addState(states[conf.birthnode[0]], 0); 
		agents.push(agent);
	}
	return agents;
}

//"Helper functions to pass states"
function createStates(num){
	var ret = []
	for(var id = 0; id< num; id++){
		var state = new State(id, id, null, "State " + id);
		ret.push(state);
	}
	return ret;
}

//Helper function to create Actions. The actions are static. 
function createActions(){
	var a1 = new Action(1, "Up", MoveUp, "Agent will move up upon this action");
	var a2 = new Action(2, "Down", MoveDown, "Agent will move down upon this action");
	var a3 = new Action(3, "Left", MoveLeft, "Agent will move left upon this action");
	var a4 = new Action(4, "Right", MoveRight, "Agent will move right upon this action");
	return [a1,a2,a3,a4]
}
//Note: special conditions will be handeled later.

//Describe Agent Actions
function MoveToStart(agent){
	agent.addNextState(markovmodel.states[markovmodel.config.birthnode[0]], 1)
}


/**
Agent actions are tied to the game. May be also put into the game space. 
*/
function MoveUp(game, agent){
		console.log("Agent " + agent.name + " moving up");
      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var targetstate = state.id - wblocks;
        if(state.id < wblocks || !validBlock(targetstate)){
          console.log("Cannot move above this point.")
          return;
        }
		agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
}

/*
Move Down
*/
function MoveDown(game, agent){
    	console.log("Agent " + agent.name + " moving down");

      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var hblocks = game.renderconfig.hblocks; 
        var targetstate = state.id + wblocks;
        if(state.id > ((hblocks - 1) * wblocks) - 1 || !validBlock(targetstate)){// || !validBlock(targetstate)){
          console.log("Cannot move below this point.")
          return;
        }
		agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
}
/*
Move agent to the right. 
*/
function MoveRight(game, agent){
    	console.log("Agent " + agent.name + " moving right");

      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var targetstate = state.id + 1;
        if(onRight(state.id, wblocks) || !validBlock(targetstate)){
          console.log("Cannot move above this point.")
          return;
        }
		agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
}

function onRight(blockid, wblocks){
      if((blockid + 1) % wblocks == 0){
          return true;
        }
        return false;
} 


//These will directly adjust the Markov Model. 
function MoveLeft(game, agent){
    	console.log("Agent " + agent.name + " moving left");

      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var targetstate = state.id - 1;
        if(onLeft(state.id, wblocks) || !validBlock(targetstate)){
          console.log("Cannot move left. Currently at " + state.id)
          return;
        }
		agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
}

function onLeft(blockid, wblocks){
 if(blockid % wblocks == 0){
  return true;
}
return false;
}


function validBlock(stateid){
    if(stateid in markovmodel.config.invalidnodes){
      return false;
    }
    return true;
}

