/**
Class contains various search methods to in the grid game. These search methods can be used to generate a probability 
grid of the game.
*/

class StochasticApproimationMethods{

	//Monte Carlo Simulation to Estimate transition parameters. 
    static MCMC(){
		console.log("Approximiation via Monte Carlo Estimations")

	}

	//Brute force method of approximating parameters via a crawler. Each time an agent moves it will update transition matrix. 
	static Crawl(markovmodel){
		var agents = markovmodel.agents;

		for(var i = 0; i < agents.length; i++){
    	var ind = Math.floor(Math.random() * agents[i].actionset.length) 
			var context =  {"game": game, "agent": agents[i]} //change noise later. up high for testing. 
			agents[i].executeAction(agents[i].actionset[ind], context);
		}
		return;
	}

	//Prunes a decision tree to intelligently approximate methods. 
	static Prune(){
		console.log("Pruning")
	}

	
}