var game; //global accessors
var markovmodel;
var conf;

$(document).ready(function() {

    console.log("Starting the game tic-tac-toe")
    loadScripts(); //async load of scripts 


    //Render Config Settings
    var renderconfig = {
        wblocks: 3,
        hblocks: 3,
        width: 500,
        height: 500,
        selector: "#tictactoecontainer"
    }

    //Markov Settings. Note: Player id does not start at 0 index. It is 1 index! DO NOT initialize it at 0. 
    var settings = {
        'decayrate': .85,
        'observationlikliehood': .33,
        'learningrate': .1,
        'epsilon': .2
    }
    var rules = {
        "numofplayers": 2,
        "players": {
            1: {
                "color": "green",
                "marker": "x",
                "name": "Player1",
                "markersize": 50
            },
            2: {
                "color": "blue",
                "marker": "o",
                "name": "Player2",
                "markersize": 50
            }
        }
    }

    waitUntilScriptLoaded("js/config.js")

    var config = new Config("tictactoe", rules, settings)
    var states = []

    waitUntilScriptLoaded("/js/objects.js");

    var actions = initActions()

    waitUntilScriptLoaded("/js/agents.js");
    var agents = initAgents(2, actions, states);

    markovmodel = new MDP(states, actions, agents, config)
    var referencemodel = markovmodel.clone();
    markovmodel.referencemodel = referencemodel;

    for (var i = 0; i < agents.length; i++) { //for each agent attach a mdp model;	
        markovmodel.agents[i].mdp = markovmodel.clone();
        markovmodel.agents[i].mdp.agents = [agents[i]]
        markovmodel.agents[i].jointmdp = markovmodel;
    }

    game = new GameEngine(markovmodel, renderconfig);
    game.train(3);

})



function initStates(num) {
    var ret = []
    for (var id = 0; id < num; id++) {
        var state = new State(id, id, null, "State " + id);
        ret.push(state);
    }
    return ret;
}

function initAgents(num, actions) {
    var agents = []
    for (var i = 0; i < num; i++) {
        var agent = new Agent(id = i + 1, name = i, actionset = actions, config = {
            "noise": .25
        })
        agents.push(agent);
    }
    return agents;
}


function initActions() {
    var a = new Action(0, "PlaceMarker", AgentTTTActions.PlaceMarker, "Agent Will Place Marker");
    return [a]
}