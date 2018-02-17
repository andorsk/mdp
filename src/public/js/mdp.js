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
class MDP {

    constructor(states, actions, agents, config) {
        this.state = states;
        this.actions = actions;
        this.agents = agents;
        this.config = config;
        this.activeagents = {}
        this.id = guid()
        this.approx_method = config.settings['approx_method'];
        this.statelookup = {}
        this.pushExisitingStates();
        this.pushExistingAgents();
        this.observationlikelihood = config.settings.observationlikeliehood;
        this.policymap = {}; //for each state there must be a policy

        /*
         Transition matrix with s, a, s'. Accepts type transition
              s' 
           s__|   = P(s'|s,a) 
               \ 
                a      
         We have a choice to store it as a 3x3 matrix or nested map.
         Size is state * action * state' 
         */
        this.transitionmatrix = null;
        this.transitionmatrixhistory = [] //storing the transition matrix history for debugging purposes. 

        // QMatrix denotes the probability for each transition. It is the estimated of the future value..  
        this.qmatrix;
        this.qmatrixhistory = [] //for debugging purposes. Should remain empty in production. 

        //The observation function is the likeliehood of observing o when action a is taken to transitoin to s'.
        this.observationmatrix;
        this.observationmatrixhistory = [];

        /*A belief state is a probability distribution over states 
          that summarize the knowledge of the agents of a given point.
          It is updated via Bayesian logic.
          The belief state matrix is the probability of a the next belief of b' given a belief and an action. 
         */
        this.believestatematrix = null;
        this.beliefstatehistory = []

        // Decay rate is also called the dicount factor. Incrase this to increase the weight of past values in the value iteration cycle. 
        this.decayrate = config.settings.decayrate;

        //Joint actions and observations are the shared actions and observations by the interation of the agents. 
        this.jointactions = null;
        this.jointobservations = null;

        //Messsage are the sum of atomic messages sent by agent i 
        this.messages = []
    }

    pushExistingStates() {
        for (var i = 0; i < this.states.length; i++) {
            this.statelookup[JSON.stringify(states[i].getStateDefinition())] = true;
        }
    }

    static init3DepthMatrix(depth1, depth2, depth3) {
        var qmatrix = [new Array(depth1.length), new Array(depth2.length), new Array(depth3.length)]
        return qmatrix;
    }

}



function MDP(states, actions, agents, config) {

    this.config = config;
    this.states = states;
    this.actions = actions;
    this.agents = agents;
    this.appox_method = config.settings["approx_method"];
    this.id = guid();

    //trackers
    this.activeagents = {}; // a mapping to keep track of if the agent is active or not.
    this.statelookup = {};

    for (var i = 0; i < states.length; i++) {
        this.statelookup[JSON.stringify(states[i])] = true;
    }




    //create a list of active agents. Assuming all agents are active at the start. 
    for (var i = 0; i < agents.length; i++) {
        this.activeagents[agents[i].id] = true //push the id of active agents to a mapping. 
    }

    /**
    Add an agent to the current markov model. 
    @agent: an agent
    */
    this.addAgent = function(agent) {
        this.agents.push(agent);
        this.activeagents[agent.id] = true;
        console.log("Added agent. Now the active agents are " + this.activeagents)
    }

    //Initalize the Transition matrix and the Q matrix.
    //The transition matrix size will be state^2
    //The QMatrix will be state^2 * actions
    //At the beginning all states are initialized with a value of 0.  
    function initProbabilityMatrices() {

        function initTransitionMatrix() {
            transitionmatrix = math.zeros(states.length, states.length)
        }

        function initQMatrix() {
            qmatrix = new QMatrix(states, actions);
        }

        function initObservationMatrix() {
            qmatrix = [new Array(states.length), new Array(actions.length), new Array(states.length)]
            qmatrix = fill(qmatrix, 0)
        }

        initTransitionMatrix();
        initQMatrix();

    }

    //This will go through a number of iterations and call the correct approximation method in the exploration.js file. 
    //Examples include: walk, MCMC, and A*. 
    this.generateTransitionProbabilities = function() {
        this.config.settings["approx_method"](this) //run the transtion probabilities
    }

    //returns a COPY of the MDP values. THerefore all addresses are reinitalized.  
    this.clone = function() {
        return $.extend(true, [], this);
    }

    //For each agent in the model, attach this markov model to each of the agents. 
    this.attachMarkovModelToAllAgents = function(agents) {
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i]
            agent.mdp = this;
            agents[i] = agent;
            console.log("Attaching id to agent" + agents[i].mdp.id)
        }
        this.agents = agents;
        return agents;
    }

    //This will use a policy to state mapping and implement a linked mapping between state1 and state 2. 
    //mapping must be state to state. You can run a conversion in another method if you want to specify the 
    //policy manually. 
    //Each state must have an exisintg next state. If it does not the program will throw an error. 
    this.updateAgentsPositionByStateSpacePolicy = function(policy) {
        //get the current state of the agent. 
        var agents = this.agents;
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i]
            var currentstate = agent.getLastState();
            if (!(JSON.stringify(currentstate) in policy)) {
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

    this.updateAgents = function(ag) {
        agents = ag;
        this.agents = ag;
    }

    this.update = function() {
        this.generateTransitionProbabilities();
    }


    consoleMessage("Initializing Markov Matrix");
    initProbabilityMatrices();
    consoleMessage("Initialization is done.")

    this.qmatrix = qmatrix;
    this.transitionmatrix = transitionmatrix;
    this.believestatematrix = believestatematrix;

    this.qmatrixhistory = qmatrixhistory;
    this.transitionmatrixhistory = transitionmatrixhistory;
    this.beliefstatehistory = beliefstatehistory;

    this.joinactions = jointactions;
    this.jointobservations = jointobservations;

}


// The Q Matrix represents the transition state s'| s,a. Eventually this gets converted to the expected future rewards of
// a action at a state given that the agent acts optially throughout the rest of the game. 
function QMatrix(statespace, actionspace) {
    this.qmat = generateNestedArray(statespace, actionspace)
    this.emptyqmat = $.extend(true, [], this.qmat); //make a copy of the structure for later use.  
    this.tmat = this.qmat; //this 

    //needs to be written as recurive function using a list. not too happy with this but it'll do the job for now. 
    function generateNestedArray(statespace, actionspace) {
        var sarray = new Array(statespace.length)
        var aarr = new Array(actionspace.length)
        var sprime = new Array(statespace.length)
        sprime.fill(0)
        aarr.insertIntoEach(sprime)
        sarray.insertIntoEach(aarr)
        return sarray;
    }

    //Updates the qmatrix given a state, action, and stateprime
    this.updateMatrix = function(state, action, stateprime, val) {
        this.mat[state.id][action.id][stateprime.id] = val;
    }

    //get the value for the matrix. 
    this.getValue = function(state, action, stateprime) {
        return this.mat[state.id][action.id][stateprime.id]
    }


    //converts the iterated values into a probability distribution .
    this.convertToQProbabilityMatrix = function(markovmodel) {
        var tmat = this.qmat
        var pmat = clone(this.emptyqmat);
        for (var i = 0; i < tmat.length; i++) { //for each action of each state
            for (var j = 0; j < tmat[i].length; j++) {
                total = math.sum(tmat[i][j])
                for (var k = 0; k < tmat[i][j].length; k++) {
                    if (tmat[i][j][k] > 0 && total > 0) {
                        pmat[i][j][k] = tmat[i][j][k] / total;
                    }
                }
            }
        }
        this.qmat = pmat;
        return pmat;
    }


    //Q Matrix has the probability of moving from one state to another given action a. Take that matrix and 
    //convert it into a a probability matrix of s, s'
    //Note: Need to update the code. This is hacky. IT will have to iterate through every entry in the matrix. 
    //Column stochastic (i.e the probability outgoing on the column side.)
    this.convertQMatToBasicProbabilityMatrix = function() {
        var ret = math.zeros(this.qmat.length, this.qmat.length);
        ret = ret.valueOf()
        for (var i = 0; i < this.qmat.length; i++) {
            for (var j = 0; j < this.qmat[i].length; j++) {
                for (var k = 0; k < this.qmat[i][j].length; k++) {
                    if (this.qmat[i][j][k] > 0) {
                        ret[k][i] = parseInt(ret[k][i]) + this.qmat[i][j][k] //the old values
                    }
                }
            }
        }
        for (var i = 0; i < ret.length; i++) {
            var total = math.sum(ret[i])
            if (total > 0) {
                var nrow = math.divide(ret[i], total)
                ret[i] = nrow;
            }
        }
        console.log("--------------------------")
        console.log(ret)
        return ret;
    }
}

function print2DArray(arr) {
    console.log("Printing 2D array")
    for (var i = 0; i < arr[0].length; i++) {
        var line = returnEmptyString(i);
        for (var j = 0; j < arr[i].length; j++) {
            line = line + ":" + arr[i][j].toFixed(2)
        }
        console.log(line.toString())
    }
}

//loop issues with javascript may require to return an empty string. 
function returnEmptyString(i) {
    this.i = i;
    return "";
}

/**
Possibly push into the helper.js file
* Retrieve a column from a matrix
* @param {Matrix | Array} matrix
* @param {number} index    Zero based column index
* @return {Matrix | Array} Returns the column as a vector
*/
getColumn = (M, i) => math.flatten(M.subset(math.index(math.range(0, M._size[0]), i))).toArray();
getRow = (M, i) => math.flatten(M.subset(math.index(i, math.range(0, M._size[0])))).toArray();
setRow = (M, i, array) => M.subset(math.index())