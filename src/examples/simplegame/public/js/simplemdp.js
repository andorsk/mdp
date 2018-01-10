//global variables for later access
var game;
var markovmodel; 
var conf; 

$(document).ready(function(){
	
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
	var type = "grid"
    var settings =  {"decayrate": .85, "observationlikeliehood": .33}
	var rules =  {
       8: {"index": 8,"action": "start", "color": "blue"}, 
       3: {"index": 3,"action": "win", "color": "green", "reward": 1}, 
       5: {"index": 3,"action": "invalid", "color": "grey"}, 
       7: {"index": 7,"action": "lose", "color": "red", "reward": -1}
   }
    //load config with ajax request.
	$.ajax({
	    async: false,
	    url: "/js/config.js",
	    dataType: "script"
	});

	conf = new Config(terminalnodes, birthnodes, type, rules, settings)
	console.log("Staring Simple MDP");
	markovmodel = new MDP([1,2], [1,2], conf)
	markovmodel = markovmodel.New()
	console.log("Created the Markov Model")



	//load config with ajax request.
	$.ajax({
	    async: false,
	    url: "/js/game.js",
	    dataType: "script",
	}).done(function(){
		game  = new GridGameDrawer(markovmodel, renderconfig);
		game = game.Start();
	});
	

});