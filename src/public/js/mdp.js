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
        this.states = [];
        this.statelookup = {}
        this.actions = actions;
        this.agents = agents;
        this.config = config;
        this.guid = guid()
        this.approx_method = config.hasOwnProperty('approx_method') ? config.settings['approx_method'] : null;

        this.observationlikelihood = config.hasOwnProperty('observationlikeliehood') ? config.settings['observationlikeliehood'] : null;
        this.policymap = {}; //for each state there must be a policy

        this.transitions = new TransitionMatrices(this.states, this.actions)
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
        this.init(states, actions)
    }

    init(states, actions) {
        this.pushStates(states)
        //consoleMessage("INFO", "Done initializing MDP " + this.guid)
    }

    pushStates(states) {
        for (var i = 0; i < states.length; i++) {
            this.addState(states[i])
        }
    }

    getStates() {
        return this.states;
    }

    getTransitions() {
        return this.transitions;
    }

    addAgent(agent) {
        this.agents.push(agent);
        this.activeagents[agent.id] = true;
    }

    getLastState() {
        return this.states[this.states.length - 1]
    }


    //Right now state lookup is not optimal because each new state requires a lookup (right now twice)
    addState(state) {

        if (state == null) {
            consoleMessage("ERROR", "Trying to add state when it is null")
            return
        }

        var scheck = this.getState(state)

        if (scheck == null) {
            state.setReferenceIndex(this.guid, this.states.length)
            this.states.push(state); //update the arrays and qmatrix. 
            this.getTransitions().addState(state);
            this.addStateToLookup(state); //add it to the lookup
        } else {
            state = scheck;
        }

        return state;
    }

    getState(state) {
        if (state == null) return null;
        if (state.getStateDataHash() in this.statelookup) {
            return this.statelookup[state.getStateDataHash()]
        } else {
            return null;
        }
    }

    addTransition(state, action, stateprime) {
        var state = this.getState(state)
        var sprime = this.addState(stateprime)
        if (isNaU(state) || isNaU(sprime)) {
            return
        }
        this.transitions.incrementModelIndex(state.getReferenceIndex(this.guid), action.id, sprime.getReferenceIndex(this.guid))
    }

    addStateToLookup(state) {
        this.statelookup[state.getStateDataHash()] = state
    }

    pushExisitingStates() {
        for (var i = 0; i < this.states.length; i++) {
            this.addState(this.states[i])
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
        this.qmatrix = []
    }

    addState(state) {
        this.addStateToQMatrix([state]);
    }

    printQMatrix() {
        return JSON.stringify(this.qmatrix)
    }
    addAction(action) {
        this.actions.push(action)
        this.equalizeQMatrixActions()
    }

    addStateToQMatrix(state) {
        var m = this.generate3NestedArray([state], this.actions, this.states)
        this.qmatrix = this.qmatrix.concat(m)
        this.equalizeQMatrixStates()
    }

    equalizeQMatrixActions() {
        consoleError("Not Available", "The current method equalizeQMatrixActions is not available")
    }

    equalizeQMatrixStates() {

        for (var i = 0; i < this.qmatrix.length; i++) {
            for (var j = 0; j < this.qmatrix[i].length; j++) {
                var stateprimearray = this.qmatrix[i][j];
                if (stateprimearray.length < this.states.length) {
                    var lendif = this.states.length - stateprimearray.length;
                    var appendedarray = new Array(lendif).fill(0) //appended array is an Array(length) and cur is an Array(length)
                    var newsparray = stateprimearray.concat(appendedarray);
                    this.qmatrix[i][j] = newsparray;
                }
            }
        }
    }

    addStateToTransitionArray() {
        for (var i = 0; i < this.transitionmatrix.length; i++) {
            this.transitionmatrix[i] = this.transitionmatrix[i].push(new Array(1))
        }
    }

    convertQMatrixToTransitionArray() {
        var ret = generate2NestedArray(this.qmatrix)

        for (var i = 0; i < this.qmatrix.length; i++) {
            for (var j = 0; j < this.qmatrix[i].length; j++) {
                for (var k = 0; k < this.qmatrix[i][j]; k++) {
                    ret[i][k] += this.qmatrix[i][j][k]
                }
            }

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

     initialized to 0
     */
    generate3NestedArray(states, actions, stateprime) {
        if (isNaU(states) || isNaU(actions)) {
            return;
        }
        var s = new Array(states.length)
        for (var i = 0; i < s.length; i++) {
            var a = new Array(actions.length);
            for (var j = 0; j < a.length; j++) {
                var sp = new Array(stateprime.length)
                sp.fill(0)
                a[j] = sp;
            }
            s[i] = a;
        }
        return s;
    }

    incrementModelIndex(state, action, stateprime) {

        if (isNaU(state) || isNaU(action) || isNaU(stateprime)) {
            return
        }
        try {
            this.qmatrix[stateid][actionid][stateprimeid] += 1
        } catch (err) {
            if (err instanceof TypeError) {
                throw (consoleError("ERROR", "Could not insert into Q Matrix " + JSON.stringify(this.qmatrix) + ":::" + JSON.stringify(state) + ":::::" + JSON.stringify(stateprime)))
            }
        }
    }

    incrementModel(state, action, stateprime) {

        if (isNaU(state) || isNaU(action) || isNaU(stateprime)) {
            return
        }
        try {
            console.log("This GUID IS " + this.guid)
            this.qmatrix[state.getReferenceIndex(this.guid)][action.id][stateprime.getReferenceIndex(this.guid)] += 1
        } catch (err) {
            if (err instanceof TypeError) {
                throw (consoleError("ERROR", "Could not insert into Q Matrix " + JSON.stringify(this.qmatrix) + ":::" + JSON.stringify(state) + ":::::" + JSON.stringify(stateprime)))
            }
        }

    }
}