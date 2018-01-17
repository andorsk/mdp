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
	var terminalnodes = [3,7]
	var birthnodes = [8]
	var invalidnodes = {5: "true"}
	var type = "grid"
    var settings =  {"decayrate": .85, "observationlikeliehood": .33, "learningrate": .1, "approx_method": "Crawl", "epsilon": .2} 
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
	settings.approx_method = APPROX_METHODS[2] //set the transition approximation method. crawl for smaller
	//state spaces will work but if you get to a large state space you will need to use alternative approximation methods.. 

	conf = new Config(terminalnodes, birthnodes, invalidnodes, type, rules, settings)
	console.log("Staring Simple MDP");

	waitUntilScriptLoaded("/js/objects.js");
	var states = createStates(12);

	//Game.js has the actinos so we need to load it.
	waitUntilScriptLoaded("/js/game.js");
    var actions = createActions();

	waitUntilScriptLoaded("/js/agents.js");
	var agents = createAgents(2, actions, states);

	//generate the base markov model. 
	markovmodel = new MDP(states, actions, agents, conf) 
	
	//for each agent attach a mdp model;
	for(var i = 0; i < agents.length; i++){
		markovmodel.agents[i].mdp = markovmodel.clone(); //cloning will attach a MM with the same parameters to each agent. Necessary for unique policies by agent. 
		markovmodel.agents[i].jointmdp = markovmodel;
	}

	//load game
	game  = new GridGameDrawer(markovmodel, renderconfig);
	game = game.Start();

	var statepolicy = policyIDToStateMapping(samplepolicy, states);
	
	//Update the game over time.           
	var tick = 0; 	
	
	iterate();

	function iterate(){
		var updater = setInterval(function(){
		tick++;
		if(tick > 100 || markovmodel.agents.length <= 0){
			clearInterval(updater)
			resolveGame() //this should be resolved every x amount of iterations. 
		}
		 updateGameModel();
	}, 399)
	}
	
	function resolveGame(){
		console.log("Resolving")
		for(var i = 0; i < markovmodel.agents.length; i++){
			console.log("Agent " + markovmodel.agents[i].id + " Probability Matrix is ");
			agents[i].mdp.qmatrix.convertQMatToBasicProbabilityMatrix()
			agents[i].mdp.qmatrix.convertToQProbabilityMatrix()
		}
		alert("Game is done!")
	}
	function updateGameModel(){
		for(var i = 0; i < markovmodel.agents.length; i++){
			//update markov model of agent. 
			markovmodel.agents[i].mdp.update()
			// console.log("Model agents keys are " + Object.keys(markovmodel.agents[i]))
		}
		//update markov movel
		game.updateMarkovModel(markovmodel)
		game.Update()
	}
});


/**
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$CREATION HELPERS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
Can be deleted later if agents are supplied through config. 

*/
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
		if(id in conf.rules){ //FIX
			if("reward" in conf.rules[id]){
				state.setValue(conf.rules[id].reward)	
		 	} else {state.setValue(0)} //Fix
		} else {state.setValue(0)} // set state initial values to zero, unless reward specified. 
		ret.push(state);
	}
	return ret;
}

//Helper function to create Actions. The actions are static. 
function createActions(){
	var a1 = new Action(0, "Up", AgentGridActions.MoveUp, "Agent will move up upon this action");
	var a2 = new Action(1, "Down", AgentGridActions.MoveDown, "Agent will move down upon this action");
	var a3 = new Action(2, "Left", AgentGridActions.MoveLeft, "Agent will move left upon this action");
	var a4 = new Action(3, "Right", AgentGridActions.MoveRight, "Agent will move right upon this action");
	var a5 = new Action(4, "StayPut", AgentGridActions.StayPut, "Agent willl stay put for this tick");
	return [a1,a2,a3,a4,a5]
}

