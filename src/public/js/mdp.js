/*
Main Markov Decision Libary mdp.js
*/
$.getScript('/js/helpers.js', function(){
	console.log("Loaded helpers.js")
})

/*
Takes in a set of states and actions and initializes them with probability matrix and q matrix. 
To initalize: new MDP([args])

states = [] an array of possible states
actions = [] an array of available actions assumes 

See the config.js to generate a base config. 
*/
function MDP(states, actions, config){

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

      // QMatrix denotes the probability for each transition. It is the estimated of the future value..  
      var qmatrix;

      // Decay rate is also called the dicount factor. Incrase this to increase the weight of past values in the value iteration cycle. 
      var decayrate = config.settings.decayrate;

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

          initTransitionMatrix();
          initQMatrix();

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