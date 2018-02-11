/**
Unlike before, there is not a 1:1 mapping between state space and the board representation. The state representation > the board representations which = 9.
This has cause me to reconsider how the render engine considers the mapping. The game has to operate more siloed than using the updated markov model 
as before. Therefore, the game will play and then update the state space. The state space needs to have some level of being dynamic, 
because unless we want to assume a combinatorial block of ~216,000 state spaces, we don't know how large the state space will be. 

//board storage
For optimzation, board storage should be a bit sequence for each player. Currently stores them as an array

*/
function TTTRenderEngine(markovmodel, renderconfig) {

    var wblocks = renderconfig.wblocks;
    var hblocks = renderconfig.hblocks;
    var ticks = 0;
    var square = new Rectangle((renderconfig.width / renderconfig.wblocks), (renderconfig.height / renderconfig.hblocks))
    var locid2graphic = {} //a mapping of location to graphic. location id is a zero indexed value to graphic. 
    var game = this;

    this.wblocks = wblocks;
    this.hblocks = hblocks;
    this.board = null;
    game.markovmodel = markovmodel;
    game.renderconfig = renderconfig;
    //Probably better to use simple 2d array from native functions rather than math.js. 

    this.emptyCurrentBoard = function() {
        var b = genEmptyBoard();
        this.setBoard(b)
        return b;
    }

    function genEmptyBoard() {
        var board = game.getBoard();
        var empty = math.zeros(wblocks, hblocks)
        return empty;
    }

    this.genEmptyBoard = function() {
        return genEmptyBoard();
    }

    var svg = d3.select(renderconfig.selector)
        .append("svg")
        .attr("width", renderconfig.width)
        .attr("height", renderconfig.height)

    function drawBoard() {

        for (var i = 0; i < wblocks; i++) {
            for (var j = 0; j < hblocks; j++) {
                var ind = ((i * (wblocks)) + j)
                drawsquare(i * square.width, j * square.height, ind)
            }
        }

        drawmarkers(markovmodel);
    }

    //draw the markers for an agent
    function drawmarkers(mdp) {
        var config = mdp.config;
        var board = game.board

        board.forEach(function(value, index, matrix) {
            var idx = game.boardToIndex(index[1], index[0])

            var gobj = locid2graphic[idx]
            var rules = config.rules.players
            var val = board.subset(math.index(index[0], index[1]));

            if (typeof gobj == 'undefined') {
                showError("Undefined", "Unable to Retreive Gobj")
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
                    } else return "NA"
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

    this.setBoard = function(bd) {
        this.board = bd;
    }
    this.getBoard = function() {
        return this.board;
    }

    this.getGame = function() {
        return this;
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
        return markovmodel.agents;
    }
    //-------------------------------------------------------------//

    this.Update = function() {
        ticks++;
        clearBoard();
        clearMarkers();
        drawBoard();
    }

    this.Reset = function() {
        clearBoard();
        clearMarkers();
        drawBoard();
        this.Start();
    }

    this.Start = function() {
        this.emptyCurrentBoard();
        console.log("Starting game." + this)
        drawBoard();
        return this;
    }

    this.Stop = function() {
        console.log("Game finished.")
    }

    //given an index, returns a board x,y position 
    this.indexToBoard = function(idx) {
        var maxindx = game.getBoard().size()[0] * game.getBoard().size()[1]
        var col = idx % this.board.size()[0]
        var row = Math.floor(idx / this.board.size()[0])
        return [row, col]
    }

    this.boardToIndex = function(col, row) {
        return (wblocks * row) + col
    }

    this.getBoardAsFlattenedArray = function() {
        return math.flatten(this.getBoard())
    }

    this.getFlattenedIndexValue = function(idx) {
        var loc = this.indexToBoard(idx);
        return game.getBoard().subset(math.index(loc[0], loc[1]))
    }

}