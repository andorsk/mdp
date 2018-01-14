/*
Main Markov Decision Libary mdp.js
*/

var fullyloadedlibraries = {}


/*
Takes in a set of states and actions and initializes them with probability matrix and q matrix. 
To initalize: new MDP([args])

states = [] an array of possible states
actions = [] an array of available actions assumes 

All history functions are used for development. No production. 
See the config.js to generate a base config. 
*/
function MDP(states, actions, agents, config){

	  this.config = config;
	  this.states = states;
	  this.actions = actions; 
	  this.agents = agents; 

      // Game parameters and tracks. Most of these should eventually be turned into game parameters. 
      var observationlikelihood = config.settings.observationlikeliehood;
      var turn = 0;

      //for each state there must be a policy
      var policymap = {};

      /*
       Transition matrix with s, a, s'. Accepts type transition
            s' 
         s__|   = P(s'|s,a) 
             \ 
              a      
       We have a choice to store it as a 3x3 matrix or nested map.
       Size is state * action * state' 
       */
      var transitionmatrix;
      var transitionmatrixhistory = [] //storing the transition matrix history for debugging purposes. 
 
      // QMatrix denotes the probability for each transition. It is the estimated of the future value..  
      var qmatrix;
      var qmatrixhistory = [] //for debugging purposes. Should remain empty in production. 

      //The observation function is the likeliehood of observing o when action a is taken to transitoin to s'.
      var observationmatrix; 
      var observationmatrixhistory = [];

      /*A belief state is a probability distribution over states 
      that summarize the knowledge of the agents of a given point.
	  It is updated via Bayesian logic.
      The belief state matrix is the probability of a the next belief of b' given a belief and an action. 
      */ 
      var believestatematrix;
      var beliefstatehistory = []

      // Decay rate is also called the dicount factor. Incrase this to increase the weight of past values in the value iteration cycle. 
      var decayrate = config.settings.decayrate;

      //Joint actions and observations are the shared actions and observations by the interation of the agents. 
  	  var jointactions; 
  	  var jointobservations;

  	  //Messsage are the sum of atomic messages sent by agent i 
  	  var messages = []

  	   /*
        Initalize the Transition matrix and the Q matrix
      */
      function initProbabilityMatrices(){
       	
          function initTransitionMatrix(){
             transitionmatrix = math.zeros(states.length, states.length)
          }

          function initQMatrix(){
             qmatrix = new QMatrix(states, actions);
             console.log("Initalized QMat with " + qmatrix.tmat)
            }

          function initObservationMatrix(){
             qmatrix = [new Array(states.length),new Array(actions.length),new Array(states.length)]
             qmatrix = fill(qmatrix, 0)
          }

          initTransitionMatrix();
          initQMatrix();

      }


       this.attachMarkovModelToAllAgents = function(agents){
      	for(var i = 0; i < agents.length; i++){
      	     var agent = agents[i]
      		 agent.mdp = this;
      		 agents[i] = agent; 
      	}
      	this.agents = agents;
      	return agents;
      }

      //This will use a policy to state mapping and implement a linked mapping between state1 and state 2. 
      //mapping must be state to state. You can run a conversion in another method if you want to specify the 
      //policy manually. 
      //Each state must have an exisintg next state. If it does not the program will throw an error. 
      this.updateAgentsPositionByStateSpacePolicy = function(policy){
      	//get the current state of the agent. 
      	var agents = this.agents; 
      	for(var i = 0; i < agents.length; i++){
      		var agent = agents[i]
      		var currentstate = agent.getLastState();
      		if(!(JSON.stringify(currentstate) in policy)){
      			console.log("ERROR. State does not have an associative mapping.")
      			console.log("JSON is " + JSON.stringify(currentstate))
      			return;
      		}
      		var nextstate = policy[JSON.stringify(currentstate)];
      		agent.addNextState(nextstate, 1); //push to the next state. 
      		agents[i] = agent; //update agent 	
      	}
      	this.updateAgents(agents);
      }

      this.updateAgents = function(ag){
      	agents = ag; 
      	this.agents = ag;
      }


  	console.log("Initializing Markov Matrix");
  	initProbabilityMatrices();
  	console.log("Initialization is done.")
  	//this.attachMarkovModelToAllAgents(this.agents);
  	console.log("Attaching models to agents.")
  	this.qmatrix = qmatrix;
  	this.transitionmatrix = transitionmatrix;
  	this.believestatematrix = believestatematrix; 

	this.qmatrixhistory = qmatrixhistory;
  	this.transitionmatrixhistory = transitionmatrixhistory;
  	this.beliefstatehistory = beliefstatehistory; 

  	this.joinactions = jointactions;
  	this.jointobservations = jointobservations;
      
}

function QMatrix(statespace, actionspace){
	  this.qmat = generateNestedArray(statespace, actionspace)
	  this.tmat = this.qmat; //this 

	  //needs to be written as recurive function using a list. not too happy with this but it'll do the job for now. 
  	  function generateNestedArray(statespace, actionspace){
  	  	var sarray = new Array(statespace.length)
  	  	var aarr = new Array(actionspace.length)
  	  	var sprime = new Array(statespace.length)
  	  	sprime.fill(0)
  	  	aarr.insertIntoEach(sprime)
  	 	sarray.insertIntoEach(aarr)
  	 	return sarray;
  	  }

  	  //Updates the qmatrix given a state, action, and stateprime
  	  this.updateMatrix = function(state, action, stateprime, val){
  	  	this.mat[state.id][action.id][stateprime.id] = val;
  	  }

  	  this.getValue = function(state,action, stateprime){
  	  	return this.mat[state.id][action.id][stateprime.id]
  	  }
    
}

//approximation methods for transition probabilies. Enum. 
var APPROX_METHODS = Object.freeze({
	"MCMC": StochasticApproimationMethods.MCMC,
	"Crawl": StochasticApproimationMethods.Crawl,
	"Prune": StochasticApproimationMethods.Prune
})

/*
When the state space gets really large then a crawl won't make sense to use for transition approximations (or at least a naive crawler).
*/
function StochasticApproimationMethods(){

	//Monte Carlo Simulation to Estimate transition parameters. 
	StochasticApproimationMethods.MCMC = function(){

	}

	//Brute force method of approximating parameters via a crawler. Each time an agent moves it will update transition matrix. 
	StochasticApproimationMethods.Crawl = function(){

	}
	
	//Prunes a decision tree to intelligently approximate methods. 
	StochasticApproimationMethods.Prune = function()

}
