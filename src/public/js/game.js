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
var agent2state = {} //maps the agents to a state with key: agent value: state .
var state2graphic = {} //maps each state to a d3 graphic object.


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
		
		console.log("Rendering board with " + wblocks + ":" + hblocks) 
		for(var i = 0; i < wblocks; i++){
          for(var j = 0; j < hblocks; j++){
            drawsquare(i*square.width, j*square.height,i + (j * wblocks))
          }
        }
}


//need to make sure that the objects are loaded before rendering. 
$.ajax({
    async: false,
    url: "/js/objects.js",
    dataType: "script"
});

var square = new Rectangle((renderconfig.width / renderconfig.wblocks), (renderconfig.height / renderconfig.hblocks))

function drawsquare(x,y, id){

	var gobj = svg.append("g")
	  .attr("class", "gobject")
	  .attr("id", "gblock" + id)
	  .attr("transform", "translate(" + x + "," + y + ")")

	state2graphic[id] = gobj;

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
	
	//Uses the agent to state mapping. 
	function drawagents(agentmapping){

	}

  	//draw agent within the id of a block. Each agent will also have the block id they are attached to to make it easy to retrieve later. 
	function drawagent(blockid, agentid){
	   	var radius = 20
	    svg.select("#gblock" + blockid).append("circle").attr("r", radius).attr("fill", "green").attr("cx", (square.length/2)).attr("cy", (square.length/2)).attr("id", "agent"+agentid).attr("class", "agent agent" +agentid).attr("currentblock", blockid).attr("opacity", 1)
	    radius -= (radius * .5)
	    svg.select("#gblock" + blockid).append("circle").attr("r", radius).attr("fill", "red").attr("cx", (square.length/2)).attr("cy", (square.length/2)).attr("class", "agent agent" +agentid).attr("opacity", 1)
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

function runFunction(val){
	console.log("Attempting to execute function " + val)
	executeFunctionByName(val, $(this))
}

function Up(agentid){
	sendMessage("#simplemdpmessagebox", "Moving Agent Up")
}

function MoveUpAgentById(agentid){
	sendMessage("#simplemdpmessagebox", "Moving Agent Up")
}

function MoveDownAgentById(agentid){
	sendMessage("#simplemdpmessagebox", "Moving Agent Down")
}


this.Start = function(){
	console.log("Starting game." + this)
	drawBoard();
	return this;
}

this.Stop = function(){
	console.log("Game finished.")
}

}

