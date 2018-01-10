$(document).ready(function(){
	
	console.log("Staring Simple MDP");
	var mm = new MDP([1,2], [1,2], {"settings" : {"decayrate": .85, "observationlikeliehood": .33}})
	console.log("Created the Markov Model")
	mm = mm.New()
	console.log("MM is " + mm)

var renderconfig = {
	wblocks: 4,
	hblocks: 3,
	width: 500,
	height: 300,
	selector: "#simplemdp" //this div to insert the svg container in. 
}

//Load the game render
$.getScript('/js/game.js', function(){
	var game  = new GridGameDrawer(mm, renderconfig);
	game.Start();
})


});