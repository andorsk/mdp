/**
Unlike before, there is not a 1:1 mapping between state space and the board representation. The state representation > the board representations which = 9.
This has cause me to reconsider how the render engine considers the mapping. The game has to operate more siloed than using the updated markov model 
as before. Therefore, the game will play and then update the state space. The state space needs to have some level of being dynamic, 
because unless we want to assume a combinatorial block of ~216,000 state spaces, we don't know how large the state space will be. 

//board storage
For optimzation, board storage should be a bit sequence for each player. Currently stores them as an array

//2x2 array 

//example index
[
[(0,0), (0,1), (0,2)],
[(1,0), (1,1), (1,2)],
[(2,0), (2,1), (2,2)]
]

//flattened array
0,0 -> 0
0,1 -> 1
0,2 -> 2
1,0 -> 3
1,1 -> 4
.
.
.
2,2 -> 8
*/

function TTTRenderEngine(renderconfig) {


    //private accessors
    var wblocks = renderconfig.wblocks;
    var hblocks = renderconfig.hblocks;
    var ticks = 0;
    var square = new Rectangle((renderconfig.width / renderconfig.wblocks), (renderconfig.height / renderconfig.hblocks))
    var locid2graphic = {} //a mapping of location to graphic. location id is a zero indexed value to graphic.
    var svg = d3.select(renderconfig.selector)
        .append("svg")
        .attr("width", renderconfig.width)
        .attr("height", renderconfig.height)

    var renderengine = this;
    var rules = renderconfig.rules;
    var board = new Board(hblocks, wblocks);

    //public accessors
    this.wblocks = wblocks;
    this.hblocks = hblocks;
    this.board = board;
    this.markovmodel = markovmodel;
    this.renderconfig = renderconfig;
    this.ticks = ticks;
    this.svg = svg;
    this.rules = rules;


    //draw methods 
    function drawboard() {
        for (var i = 0; i < wblocks; i++) {
            for (var j = 0; j < hblocks; j++) {
                var ind = ((i * (wblocks)) + j)
                drawsquare(j * square.width, i * square.height, ind)
            }
        }
        drawmarkers(board);
    }

    //draw the markers for an agent
    function drawmarkers(board) {
        //flatten board and iterate
        var rrules = rules;
        var bf = board.flatten();

        bf.forEach(function(value, idx, matrix) {

            var gobj = locid2graphic[idx]
            var rules = rrules["players"]
            var val = bf[idx]

            if (typeof gobj == 'undefined') {
                consoleError("Undefined", "Unable to Retreive Gobj")
                return
            }

            gobj.append("text")
                .attr("id", "Marker" + idx)
                .attr("class", "mark marker" + value + "makeragent" + value)
                .attr("dy", square.height / 2)
                .attr("dx", square.width / 2)
                .text(function(d) {
                    if (val in rules) {
                        return rules[val].marker
                    } else return
                })
                .style("font-size", function(d) {
                    if (val in rules && "markersize" in rules[val]) {
                        return rules[val]["markersize"] + "px"
                    }
                })
        })
    }

    function drawsquare(x, y, id) {

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
            .attr("id", "block" + id)
            .attr("fill", "white")
            .attr("stroke", 'black')

        locid2graphic[id] = gobj;

        return block;
    }

    function clearBoard() {
        $(".block").remove()
    }

    function clearMarkers() {
        $(".marker").remove();
    }

    //---------------- Getters and Setters -----------------------//
    this.updateMarkovModel = function(mm) {
        markovmodel = mm;
    }

    this.updateRenderConfig = function(rendercfg) {
        renderconfig = rendercfg
    }

    this.getAgent = function(id) {
        for (var i = 0; i < this.getAgents().length; i++) {
            if (this.getAgents()[i].id == id) {
                return this.getAgents()[i]
            }
        }
        sendMessage(renderconfig.selector, "Couldn't find agent: " + id)
    }
    this.getAgents = function() {
        return this.markovmodel.agents;
    }

    this.Get = function() {
        return this;
    }

    //-------------------- Update Functions--------------------------//

    this.Update = function() {
        ticks++;
        clearBoard();
        clearMarkers();
        drawboard();
    }

    this.Reset = function() {
        this.board.Reset();
        this.Update();
        sendMessage(renderconfig.selector, "")
    }

    this.Start = function() {
        this.board.emptyCurrentBoard();
        console.log("Starting game." + this)
        drawboard();
        return this;
    }

    this.Stop = function() {
        console.log("Game finished.")
    }
}