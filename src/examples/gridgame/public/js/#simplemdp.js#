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
		wblocks: 10,
		hblocks: 10,
		width: 500,
		height: 300,
		selector: "#simplegamecontainer",
		showvalues: true //this div to insert the svg container in. 
	}
	//Markov Settings
	var terminalnodes = [99,98]
	var birthnodes = [0]
	var invalidnodes = {5: "true", 8: "true"}
	var type = "grid"
    var settings =  {"decayrate": .85, "observationlikeliehood": .33, "learningrate": .1, "approx_method": "Crawl", "epsilon": .2} 
	var rules =  {
       0: {"index": 0,"action": "invalid", "color": "blue"}, 
       5: {"index": 3,"action": "invalid", "color": "grey"}, 
       8: {"index": 8,"action": "start", "color": "grey"}, 
       99: {"index": 99,"action": "win", "color": "green", "reward": 1}, 
       98: {"index": 98,"action": "lose", "color": "red", "reward": -1}
   }
   var inv = genRandomInvalidNodes(40);
   rules = inv[0]
   invalidnodes = inv[1] 
   
   function genRandomInvalidNodes(num){
  	var invalidnodes = {}
   	var invalidlist = {}
   		
  	for(var i = 0; i < num; i++){
   		
   		var ind = Math.floor(Math.random() * (renderconfig.wblocks * renderconfig.hblocks));
   		if(birthnodes.indexOf(ind) > -1 || terminalnodes.indexOf(ind) > -1){
   			console.log("Already there.")
   			continue;
   		}
   		invalidnodes[parseInt(ind)] ={"index": parseInt(ind), "action":"invalid", "color": "grey"}
   		invalidlist[parseInt(ind)] = "true"
   	}

   	   invalidnodes[0] = {"index": 0,"action": "start", "color": "blue"}, 
       invalidnodes[99] =  {"index": 99,"action": "win", "color": "green", "reward": 1}, 
       invalidnodes[98] =  {"index": 98,"action": "lose", "color": "red", "reward": -1}
	return [invalidnodes, invalidlist]
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
	var states = createStates(renderconfig.wblocks * renderconfig.hblocks);

	//Game.js has the actinos so we need to load it.
	waitUntilScriptLoaded("/js/game.js");
    var actions = createActions();

	waitUntilScriptLoaded("/js/agents.js");
	var agents = createAgents(2, actions, states);

	//generate the base markov model. 
	markovmodel = new MDP(states, actions, agents, conf) 
	var referencemodel = markovmodel.clone();
	markovmodel.referencemodel = referencemodel;
	//for each agent attach a mdp model;
	for(var i = 0; i < agents.length; i++){
		markovmodel.agents[i].mdp = markovmodel.clone(); //cloning will attach a MM with the same parameters to each agent. Necessary for unique policies by agent. 
		markovmodel.agents[i].mdp.agents = [agents[i]]
		markovmodel.agents[i].jointmdp = markovmodel;
	}

	waitUntilScriptLoaded("/js/exploration.js");

	//load game
	game  = new GridGameDrawer(markovmodel, renderconfig);
	game = game.Start();

	var statepolicy = policyIDToStateMapping(samplepolicy, states);
	
	//Update the game over time.           
	var tick = 0; 	
	
	train(2000)

	var policy;

	function train(iter = 1000){
		var tick = 0;
	var trainseg = setInterval(function(){
			tick++;
			updateGameModel()
			// if(tick % 30 == 0){ //TODO: Instead when they go to a terminal node just restart at the entrance. 
			// 	addNewAgent()
			// }

			if(tick > iter){
				clearInterval(trainseg)
				resolveProbabilities()
				policy = valueIteration(markovmodel);
				test()
			}	
		}, 50) 
		
	}


	game.TestHandler = function(){
		console.log("Game Testing")
		test();
	}

	function test(){
		console.log("Testing policy!")
		visualizePolicyForSingleAgent(policy)
	}
	

	function visualizePolicyForSingleAgent(policy){
		var agent = new Agent(id = 0, name = "testagent", actionset = actions, config = {"action-error": .25})
		agent.addState(states[conf.birthnode[0]], 0); //start agent int the birth node
		agent.mdp = markovmodel.clone();
		agent.mdp.agents = [agent]
		agent.jointmdp = markovmodel;
		
		var sequencer = setInterval(function(){
			var action;
			//No plicy for the state
			if(agent.getLastState().id in policy){
				action = policy[agent.getLastState().id];
			} else{
				console.log("No policy for the state " + agent.getLastState().id + " . Executing random")
				action = agent.chooseRandomAction()
			}
			if(agent.mdp.config.terminalnodes.indexOf(agent.getLastState().id) > -1){
				agent.finish();
				exit()
			}	
			agent.executeAction(action, context={"game": game, "agent": agent, "noise":.25})
			game.updateMarkovModel(agent.mdp)
			game.Update()
		}, 1000) // this is the sequencer

	}
	
	function resolveProbabilities(){
		console.log("Resolving " + markovmodel.agents.length + " agents")
		for(var i = 0; i < markovmodel.agents.length; i++){
			console.log("Agent " + markovmodel.agents[i].id + " Probability Matrix is ");
			agents[i].mdp.qmatrix.convertQMatToBasicProbabilityMatrix()
			agents[i].mdp.qmatrix.convertToQProbabilityMatrix()
			waitUntilScriptLoaded("/js/valueiteration.js");
			console.log("Agent mdp is " + Object.keys(agents[i].mdp.qmatrix.qmat))
		}

		console.log("Joint probability matrix is ")
		console.log(markovmodel.qmatrix.convertQMatToBasicProbabilityMatrix())
		console.log(markovmodel.qmatrix.convertToQProbabilityMatrix())
		valueIteration(markovmodel);
	}

	function updateAgents(){
		for(var i = 0; i < markovmodel.agents.length; i++){
			if(markovmodel.activeagents[i] == true){
				markovmodel.agents[i].mdp.update()
			}
		}
	}

	function updateGameModel(){
		for(var i = 0; i < markovmodel.agents.length; i++){
			//update markov model of agent. 
			if(markovmodel.activeagents[i] == true){
				markovmodel.agents[i].mdp.update()
			}
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


function addNewAgent(){
			var agent = new Agent(id = markovmodel.agents.length, name = markovmodel.agents.length, actionset = markovmodel.actions, markovmodel.config)
			agent.addState(markovmodel.states[conf.birthnode[0]], 0); 
			agent.mdp = markovmodel.referencemodel.clone();//cloning will attach a MM with the same parameters to each agent. Necessary for unique policies by agent. 
			agent.jointmdp = markovmodel;
			markovmodel.addAgent(agent)
			agent.mdp.agents = [agent];	
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
		var agent = new Agent(id = i, name = i, actionset = actions, config = {"noise": .25})
		agent.addState(states[conf.birthnode[0]], 0); 
		agents.push(agent);
	}
	return agents;
}

//"Helper functions to pass states"
function createStates(num){
	var ret = []
	for(var id = 0; id < num; id++){
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

