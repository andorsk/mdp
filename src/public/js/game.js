/*
Main function calls the start function 
Renders a base markov model.
Requires a rendering config to specify things like the size of the svg container. 

ex. renderconfig = {
	wblocks: 4,
	hblocks: 3,
	width: 500,
	height: 300,
	selector: "#selector" //this div to insert the svg container in. 

}

Note: You must give the game div a ".game" class. 
*/
function GridGameDrawer(markovmodel, renderconfig){

if(markovmodel == null || renderconfig == null ){
	console.log("You need to supply a markov model and a config to render! Returning")
	return
}

this.markovmodel = markovmodel;
this.renderconfig = renderconfig;

var wblocks = renderconfig.wblocks;
var hblocks = renderconfig.hblocks;
var ticks = 0; //ticks keep track of the overall state changes (time t); It will increment for each tickaction class. 

/* 
 Generate the board, of size wblocks x hblocks. This can also be considered the "state" map. 
    [0, 1, 2, 3]
    [4, 5, 6, 7]
    [8, 9,10,11]
 */
var board = math.zeros(hblocks, wblocks);
var agent2board = {}
var board2state = {} //assumes one to one mapping between board position and state.
var state2board = {} //for reverse lookup of state to  board. This returns a json stringified version of the state space.  
var state2graphic = {} //maps each state to a d3 graphic object.
var board2graphic = {} //easy access to graphic object from board index reference. 

/**
Note: Unless the state space or the agent space gets really really large having the extra mappings shouldn't be a problem.
In a future version I will see if I can do this  with less memory. 
Most of these are for maintaining the relationship between graphics, state spaces, and agents in some order. 	
**/

//The main SVG container for everything. Therefore to 
//retain symettry the height is equal to the width. 
var svg = d3.select(renderconfig.selector).select(".game")
    .append("svg")
    .attr("width", renderconfig.width)
    .attr("height", renderconfig.height)


//Board will take over the full size of the SVG container. 
function drawBoard(){

		if(wblocks * hblocks != markovmodel.states.length){
			alert("Please make sure that you specify the wblocks * hblocks = to the total states.")
		}

		for(var i = 0; i < wblocks; i++){
          for(var j = 0; j < hblocks; j++){
          		var ind = ((i * (wblocks -1)) + j)
          		var state = markovmodel.states[ind];
          		board2state[ind] = state;
          		state2board[JSON.stringify(state)] = ind; //state reference is the index to the states array. 
            	drawsquare(i*square.width, j*square.height,i + (j * wblocks), state)		
          }
        }
}



var square = new Rectangle((renderconfig.width / renderconfig.wblocks), (renderconfig.height / renderconfig.hblocks))

function drawsquare(x,y, id, state){

	var gobj = svg.append("g")
	  .attr("class", "gobject block")
	  .attr("id", "gblock" + id)
	  .attr("transform", "translate(" + x + "," + y + ")")

	state2graphic[state] = gobj; //mapping from state to graphics for easy access;
	board2graphic[id] = gobj; 

	var block = gobj
	  .append("rect")
	  .attr("id", id)
	  .attr("height", square.height)
	  .attr("width", square.width)
	  .attr("class", "block")
	  .attr("id", "block"+id)
	  .attr("fill", function(d){if(id in markovmodel.config.rules){
	    return markovmodel.config.rules[id].color
	  }else{
	    return "white"
	  }})
	  .attr("stroke", 'black')
	  return block;
	}
	
	//agent to board mapping. this must happen after the board has been initialized. 
	function drawAgents(){
		//get agents from markov model
		for(var i = 0; i < markovmodel.agents.length; i++){
			var currentAgentState = markovmodel.agents[i].state;
			var graphic = state2graphic[currentAgentState];
			agent2board[markovmodel.agents[i]] = state2board[currentAgentState] //could store agent id as well. 
			drawagent(state2board[JSON.stringify(currentAgentState)], markovmodel.agents[i].getId())
		}
	}

  	//draw agent within the id of a block. Each agent will also have the block id they are attached to to make it easy to retrieve later. 
	function drawagent(blockid, agentid){
		var radius = 20
	    svg.select("#gblock" + blockid).append("circle").attr("r", radius).attr("fill", "green").attr("cx", (square.width/2)).attr("cy", (square.height/2)).attr("id", "agent"+agentid).attr("class", "agent agent" +agentid).attr("currentblock", blockid).attr("opacity", 1)
	    radius -= (radius * .5)
	    svg.select("#gblock" + blockid).append("circle").attr("r", radius).attr("fill", "red").attr("cx", (square.width/2)).attr("cy", (square.height/2)).attr("class", "agent agent" +agentid).attr("opacity", 1)
	}


	function clearBoard(){
		$(".block").remove()
	}

	function clearAgents(){
		$(".agent").remove()
	}

	//Updates the markov model and all the data. 
	this.updateMarkovModel = function(mm){
		markovmodel = mm;
	}

	//need to update this is the state space size changes. 
	this.updateRenderConfig = function(rcnf){
		renderconfig = rcnf; 
	}
	/**
	Main update function. Update the board based upon the markov model;
	Update function happens based upon the rate defined. 
	**/
	this.Update = function(){
		ticks++;
		console.log("Updating to tick " + ticks)
		clearAgents() //clear the agents from the board;
		clearBoard() 
		drawBoard() //Need to redraw board in the case the markov state space changes. 
		drawAgents() //Draw the agents. 
	}

/**
----------------------------------------------------------------------------------
Action Listeners
----------------------------------------------------------------------------------
**/

//Uses the string and reflects it to the correct function
$(document).ready(function(){
	$("#simplegamecontainer").find(":button").on('click', function(){	
		runFunction($(this).val());
	})
})



this.Start = function(){
	console.log("Starting game." + this)
	drawBoard();
	drawAgents();
	return this;
}

this.Stop = function(){
	console.log("Game finished.")
}

}

/**
AGENT ACTION FUNCTIONS FOR GRID BOARD
*/
var AgentGridActions = function(){};

AgentActions();
function AgentActions(){

	AgentGridActions.MoveToStart = function(agent){
		agent.addNextState(markovmodel.states[markovmodel.config.birthnode[0]], 1);	
	}

	AgentGridActions.MoveUp = function(game, agent){
		console.log("Agent " + agent.name + " moving up");
      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var targetstate = state.id - wblocks;
        if(state.id < wblocks || !validBlock(targetstate)){
          console.log("Cannot move above this point.")
          return;
        }
		agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
	}
	AgentGridActions.MoveDown = function(game, agent){
    	console.log("Agent " + agent.name + " moving down");

      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var hblocks = game.renderconfig.hblocks; 
        var targetstate = state.id + wblocks;
        if(state.id > ((hblocks - 1) * wblocks) - 1 || !validBlock(targetstate)){// || !validBlock(targetstate)){
          console.log("Cannot move below this point.")
          return;
        }
		agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
	}	

	AgentGridActions.MoveRight = function(game, agent){
    	console.log("Agent " + agent.name + " moving right");

      	var state = agent.getLastState();
        var states = game.markovmodel.states;
        var wblocks = game.renderconfig.wblocks;
        var targetstate = state.id + 1;
        if(onRight(state.id, wblocks) || !validBlock(targetstate)){
          console.log("Cannot move above this point.")
          return;
      }
	agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
	}

    function onRight(blockid, wblocks){
	      if((blockid + 1) % wblocks == 0){
	          return true;
	        }
	        return false;
	} 

	AgentGridActions.MoveLeft = function(game, agent){
	    	console.log("Agent " + agent.name + " moving left");

	      	var state = agent.getLastState();
	        var states = game.markovmodel.states;
	        var wblocks = game.renderconfig.wblocks;
	        var targetstate = state.id - 1;
	        if(onLeft(state.id, wblocks) || !validBlock(targetstate)){
	          console.log("Cannot move left. Currently at " + state.id)
	          return;
	        }
			agent.addNextState(states[targetstate], 1); //maove a tick up and add the next state.     
	}

	function onLeft(blockid, wblocks){
	 if(blockid % wblocks == 0){
	  return true;
	}
	return false;
	}


    function validBlock(stateid){
	    if(stateid in markovmodel.config.invalidnodes){
	      return false;
	    }
	    return true;
	}
}

	


