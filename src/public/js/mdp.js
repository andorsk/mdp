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
             transitionmatrix = [new Array(states.length),new Array(actions.length),new Array(states.length)]
             transitionmatrix = fill(transitionmatrix,0)
          }

          function initQMatrix(){
             qmatrix = [new Array(states.length),new Array(actions.length),new Array(states.length)]
             qmatrix = fill(qmatrix, 0)
          }

          function initObservationMatrix(){
             qmatrix = [new Array(states.length),new Array(actions.length),new Array(states.length)]
             qmatrix = fill(qmatrix, 0)
          }

          initTransitionMatrix();
          initQMatrix();

      }

      //This will use a policy to state mapping and implement a linked mapping between state1 and state 2. 
      //mapping must be state to state. You can run a conversion in another method if you want to specify the 
      //policy manually. 

      //Each state must have an exisintg next state. If it does not the program will throw an error. 
      this.updateAgentsPositionByPolicy = function(policy){
      	//get the current state of the agent. 
      	var agents = this.agents; 
      	for(var i = 0; i < agents.length; i++){
      		var agent = agents[i]
      		var currentstate = agent.getLastState();
      		if(!(currentstate in policy)){
      			console.log("ERROR. State does not have an associative mapping.")
      			return;
      		}
      		var nextstate = policy[currentstate];
      		agent.addNextState(nextstate, 1); //push to the next state. 
      		agents[i] = agent; //update agent 	
      	}
      	this.updateAgents(agents);
      }

      this.updateAgents = function(ag){
      	agents = ag; 
      	this.agents = ag;
      }

      function init(){
      	console.log("Initializing Markov Matrix");
      	initProbabilityMatrices();
      	console.log("Initialization is done.")
      }


      this.New = function(){
      	init();
      	return this;
      }

}
