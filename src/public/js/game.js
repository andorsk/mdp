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
*/
function GridGameDrawer(markovmodel, renderconfig){

if(markovmodel == null || renderconfig == null ){
	console.log("You need to supply a markov model and a config to render! Returning")
	return
}

var wblocks = renderconfig.wblocks;
var hblocks = renderconfig.hblocks;

/* 
 Generate the board, of size wblocks x hblocks. This can also be considered the "state" map. 
    [0, 1, 2, 3]
    [4, 5, 6, 7]
    [8, 9,10,11]
 */

var board = math.zeros(hblocks, wblocks);

//The main SVG container for everything
var svg = d3.select(renderconfig.selector)
    .append("svg")
    .attr("width", renderconfig.width)
    .attr("height", renderconfig.height)


function drawBoard(){

}

this.Start = function(){
	console.log("Starting game.")
}

this.Stop = function(){
	console.log("Game finished.")
}

}

