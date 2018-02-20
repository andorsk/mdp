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

    constructor(states = [], actions = [], agents = [], config = {}) {

        this.states = states;
        this.actions = actions;
        this.agents = agents;
        this.config = config;
        this.activeagents = {}
        this.id = guid()
        this.approx_method = config.hasOwnProperty('approx_method') ? config.settings['approx_method'] : null;
        this.statelookup = {}
        this.pushExisitingStates();
        this.observationlikelihood = config.hasOwnProperty('observationlikeliehood') ? config.settings['observationlikeliehood'] : null;
        this.policymap = {}; //for each state there must be a policy
        this.transitions = new TransitionMatrices(states, actions)
        this.transitionmatrixhistory = [] //storing the transition matrix history for debugging purposes. 
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

        //Joint actions and observations are the shared actions and observations by the interation of the agents. 
        this.jointactions = null;
        this.jointobservations = null;

        //Messsage are the sum of atomic messages sent by agent i 
        this.messages = []
    }


    getStates() {
        return this.states;
    }

    getTransitions() {
        return this.transitions;
    }

    /**
       Add an agent to the current markov model. 
       @agent: an agent
       */
    addAgent(agent) {
        this.agents.push(agent);
        this.activeagents[agent.id] = true;
    }

    getLastState() {
        return this.states[this.states.length - 1]
    }

    addState(state) {
        var v = JSON.stringify(state.getStateData())

        if (!this.statelookup.hasOwnProperty(v) && this.statelookup[v] != true) {
            state.setId(this.states.length)
            this.states.push(state); //update the arrays and qmatrix. 
            this.getTransitions().addState();
            this.addStateToLookup(state); //add it to the lookup
        }
    }

    addStateToLookup(state) {
        this.statelookup[JSON.stringify(state.getStateData())] = true
    }

    pushExisitingStates() {
        for (var i = 0; i < this.states.length; i++) {
            this.statelookup[JSON.stringify(this.states[i].getStateData())] = true;
        }
    }

    static init3DepthMatrix(depth1, depth2, depth3) {
        var qmatrix = [new Array(depth1.length), new Array(depth2.length), new Array(depth3.length)]
        return qmatrix;
    }

    //For each agent in the model, attach this markov model to each of the agents. 
    attachMarkovModelToAllAgents() {
        var agents = this.agents;
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i]
            agent.mdp = this;
            agents[i] = agent;
            console.log("Attaching id to agent" + agents[i].mdp.id)
        }
        this.agents = agents;
        return agents;
    }

}

//Q Matrix and State Transition Matrix
class TransitionMatrices {

    constructor(states, actions) {
        this.states = states;
        this.actions = actions;
        this.qmatrix = this.generate3NestedArray(states, actions)
        this.transitionmatrix = this.generate2NestedArray(states)
    }

    addState() {
        this.addStateToQMatrix();
        this.addStateToTransitionArray();
    }

    addStateToQMatrix() {
        var m = new Array(this.actions.length)
        for (var i = 0; i < m.length; i++) {
            m[i] = new Array(this.states.length)
        }
        this.qmatrix.push(m)
    }

    addStateToTransitionArray() {
        for (var i = 0; i < this.transitionmatrix.length; i++) {
            this.transitionmatrix[i] = this.transitionmatrix[i].push([])
        }
    }

    generate2NestedArray(states) {
        var ret = new Array(states.length);

        for (var i = 0; i < ret.length; i++) {
            ret[i] = new Array(ret.length)
        }

        return ret;
    }

    /*
     Transition matrix with s, a, s'. Accepts type transition
          s' 
       s__|   = P(s'|s,a) 
           \ 
            a      
     We have a choice to store it as a 3x3 matrix or nested map.
     Size is state * action * state' 
     */
    generate3NestedArray(statespace, actionspace) {
        var sarray = new Array(statespace.length)

        //transition space is [s][a][s'] 
        for (var i = 0; i < sarray.length; i++) {
            sarray[i] = new Array(actionspace.length);
            for (var j = 0; j < actionspace.length; j++) {
                sarray[i][i] = new Array(statespace.length);
            }
        }
        return sarray;
    }

    incrementModel(state, action, stateprime) {
        this.qmatrix[state.id][action.id][stateprime.id]
        this.transitionmatrix[state.id][stateprime.id]
    }
}