/**
Value iteration takes a markov model at interates through it to find the optimal policy. 
V^pi = E[sum(R(pi(s_t), s_t+1))] 
In other words, the value of a policy is the expected reward of enacting poicy s_t over s_t+1
Assuming finite horiziong. 
*/

var policy = {} //mapping from state to action 


class ValueIteration {

    constructor() {
        console.log("Running value iteration")
    }

    static calculate(markovmodel) {

        var tick = 0;
        while (tick < 15) {
            tick++;

            markovmodel.getStates().forEach(function(element) {
                var currentvalue = element.getValue();


            })


        }
    }

}


function valueIteration(markovmodel) {
    console.log("Moving through value iteration.")
    var ticks = 0;
    while (ticks < 15) {
        ticks++;

        for (var i = 0; i < markovmodel.states.length; i++) {

            if (markovmodel.states[i].converged == true) {
                continue;
            }

            var res = V(markovmodel, markovmodel.states[i]); //for each state try to calculate V
            var vprime = res[0]
            var p = res[1]
            //check convergence
            if ((math.abs((vprime - markovmodel.states[i].val) / markovmodel.states[i].val)) < .2) {
                markovmodel.states[i].converged = true;
            }
            //replace value 
            if (markovmodel.states[i].val < vprime) {
                markovmodel.states[i].setValue(vprime);
                policy[markovmodel.states[i].id] = p
            }
        }
    }
    console.log("policy is " + JSON.stringify(policy))
    return policy;
}

/**
Function returns a greedy policy from the perspective of s.
*/
function V(markovmodel, state) {
    var gamma = .85 // markovmodel.config.settings.decayrate
    var r = R(state);
    var expected = E(markovmodel, state);
    var v = r + ((1 - gamma) * expected[0])
    if (expected[1] != null) {
        console.log("current optimal action for " + state.id + " is " + expected[1] + " val " + expected[0])
    }
    return [v, expected[1]];
}

function R(state) {
    return state.val;
}


/*
Execpted future value from making the optimal values. 
*/
function E(markovmodel, state) {
    var qmatrix = markovmodel.qmatrix.qmat.valueOf();
    var maxexp = 0;
    var actionreturned = null;
    for (var i = 0; i < qmatrix[state.id].length; i++) { //each action
        var probablitysum = 0;
        for (var j = 0; j < qmatrix[state.id][i].length; j++) {
            var ex = qmatrix[state.id][i][j] * markovmodel.states[j].val
            probablitysum += qmatrix[state.id][i][j]
            if (ex > maxexp) {
                maxexp = ex;
                actionreturned = markovmodel.actions[i]
            }

        }
    }

    return [maxexp, actionreturned];
}