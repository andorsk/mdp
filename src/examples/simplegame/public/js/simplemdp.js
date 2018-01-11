//global variables for later access
var game;
var markovmodel; 
var conf; 


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
	var birthnodes = [7]
	var invalidnodes = []
	var type = "grid"
    var settings =  {"decayrate": .85, "observationlikeliehood": .33, "learningrate": .1} 
	var rules =  {
       8: {"index": 8,"action": "start", "color": "blue"}, 
       3: {"index": 3,"action": "win", "color": "green", "reward": 1}, 
       5: {"index": 3,"action": "invalid", "color": "grey"}, 
       7: {"index": 7,"action": "lose", "color": "red", "reward": -1}
   }

   //Policies can be uploaded by a config or can be generated through iteration. In this case we've uploaded a policy. 
   //You can encode the actions with a mapping if that is preferable. 
   var samplepolicy = {
    0: 'Right',
    1: 'Right',
    2: 'Right',
    3: 'Left',
    4: 'Up',
    6: 'Up',
    7: 'Up',
    8: 'Up',
    9: 'Left',
    10: 'Up',
    11: 'Left'
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

	markovmodel = new MDP(states, actions, conf)
	markovmodel = markovmodel.New()
	console.log("Created the Markov Model")

	//load game
	waitUntilScriptLoaded("/js/game.js");
	game  = new GridGameDrawer(markovmodel, renderconfig);
	game = game.Start();

});



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
	return [a1, a2, a3, a4];
}
//Note: special conditions will be handeled later.

//TO DELETE
function MoveUp(){
	console.log("UP")
} 
function MoveDown(){
	console.log("DOWN")
}
function MoveLeft(){

}
function MoveRight(){

}