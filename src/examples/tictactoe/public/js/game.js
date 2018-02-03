function TTTRenderEngine(markovmodel, renderconfig){

	var wblocks = renderconfig.wblocks;
	var hblocks = renderconfig.hblocks; 
	var ticks = 0; 
    var square = new Rectangle((renderconfig.width / renderconfig.wblocks), (renderconfig.height / renderconfig.hblocks))


	var board = math.zeros(hblocks, wblocks) //Generate a board. Normally 3x3. 

	var svg = d3.select(renderconfig.selector)
    	.append("svg")
    	.attr("width", renderconfig.width)
    	.attr("height", renderconfig.height)

    function drawBoard(){

    	if(wblocks * hblocks != markovmodel.states.length){
			alert("Please make sure that you specify the wblocks * hblocks = to the total states.")
		}

		console.log("Rendering " + (wblocks * hblocks) + " blocks")
		for(var i = 0; i < wblocks; i++){
          for(var j = 0; j < hblocks; j++){
          		var ind = ((i * (wblocks)) + j)
          		var state = markovmodel.states[ind];
            	drawsquare(i*square.width, j*square.height,ind, state)		
          }
        }
    }


	function drawsquare(x,y, id, state){

		var gobj = svg.append("g")
		  .attr("class", "gobject block")
		  .attr("id", "gblock" + id)
		  .attr("transform", "translate(" + x + "," + y + ")")

		var block = gobj
		  .append("rect")
		  .attr("id", id)
		  .attr("height", square.height)
		  .attr("width", square.width)
		  .attr("class", "block")
		  .attr("id", "block"+id)
		  .attr("fill", function(d){if(id.toString() in markovmodel.config.rules){
		    return markovmodel.config.rules[id.toString()].color
		  }else{
		    return "white"
		  }})
		  .attr("stroke", 'black')
		  return block;
	}

	function clearBoard(){
		$(".block").remove()
	}

	this.updateMarkovModel = function(mm){
		markovmodel = mm;
	}

	this.updateRenderConfig = function(rendercfg){
		renderconfig = rendercfg
	}

	this.Update = function(){

	}

	this.Start = function(){
		console.log("Starting game." + this)
		drawBoard();
		return this;
	}

	this.Stop = function(){
		console.log("Game finished.")
	}

	var AgentTTTActions = function(){};

	AgentTTTActions.PlaceMarker = function(game, agent, markerid){

		var state = agent.getLastState();
		var states = game.markovmodel.states;

		if(!validMove(markerid, agent)){
			return;
		}
		agent.Act(state, agent.currentaction, states[markerid])

	}
}