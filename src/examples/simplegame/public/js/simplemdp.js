$(document).ready(function(){
	console.log("Staring Simple MDP");
	var mm = new MDP([1,2], [1,2], {"settings" : {"decayrate": .85, "observationlikeliehood": .33}})
	console.log("Created the Markov Model")
	mm = mm.New()
	console.log("MM is " + mm)
});