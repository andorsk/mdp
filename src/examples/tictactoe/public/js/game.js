function GameEngine(markovmodel, renderconfig) {
    var turnindex = 0;
    this.turnindex = turnindex;

    var game = new TTTRenderEngine(markovmodel, renderconfig)
    game.Start();


    this.playTurn = function(choice) {

    }


    function nextTurn() {
        turnindex = turnindex + 1 >= markovmodel.agents.length - 1 ? 0 : turnindex + 1;
    }

    this.train = function(iter = 1000) {
        var tick = 0;

        var trainInt = setInterval(function() {
            tick++;
            if (tick % 10 == 0) {
                console.log("Tick updated at " + tick)
            }
            if (tick > iter) {
                clearInterval(trainInt)
                console.log("Training finished with " + tick + " ticks.")
            }
        }, 100)
    }

}

//There are a total of 255,168 possibilities of board combinations in tic tac toe.
//To reduce the state space represent the board as a a state of multiple things.
//@amountofpiecesonleft: The amount of pieces on the left column
//@amountofpiecesinmiddle: The amount of pieces in the middle column
//@amountofpiecesinright: The amount of pieces in the right columns
//@avg manhattan distance between points
//# of pieces on the board
//agent id's of last turn.
//min manhattan distance for opposing player
//max manhattan distance for opposing player
//min manhattan distance for current agent
//max manhattan distance for current agent
function BoardToStateRepresentation(board, markovmodel, game) {
    this.currentAgentID = markovmodel.agents[game.turnindex]
    this.numofpieces = countBoardPieces(board)
    this.amountofpiecesonleft = countBoardPiecesOnColumn(board, 0)
    this.amountofpiecesinmiddle = countBoardPicesOnColumn(board, 1)
    this.amountofpiecesonright = countBoardPiecesOnColumn(board, 2)
    this.minmanhattandistanceforopposingplayer = manhattanDistanceForPlayer(this.currentAgentID, board)[0] //TODO: Change current Agent ID to other agent ID. 
    this.maxmanhattandistanceforopposingplayer = manhattanDistanceForPlayer(this.currentAgentID, board)[1]
    this.avgmanhattandistanceforopposingplayer = manhattanDistanceForPlayer(this.currentAgentID, board)[2]


    //adding state is a little different than the grid game because we don't know how many states there will be. We don't want to have redundant states. 
    var strver = JSON.stringify(this)
    if (markovmodel.statelookup.hasOwnProperty(strver)) { //make sure we haven't seen this state before. 
        return
    }
    markovmodel.states.push(new State(markovmodel.states.length, "State" + markovmodel.states.length, strver, "")) //create the state and push it. 
    markovmodel.statelookup[strver] = true
}

//returns the min, max, and average manhattan distance beween current players pieces as a tuple
function manhattanDistanceForPlayer(playerid, board) {
    return [1, 1, 1]
}

//count the number of pieces on the board
function countBoardPieces(board) {
    return 10
}

//count the number of pieces on a column
function countBoardPiecesOnColumn(board, col) {
    return 3
}

/**
Unlike before, there is not a 1:1 mapping between state space and the board representation. The state representation > the board representations which = 9.
This has cause me to reconsider how the render engine considers the mapping. The game has to operate more siloed than using the updated markov model 
as before. Therefore, the game will play and then update the state space. The state space needs to have some level of being dynamic, 
because unless we want to assume a combinatorial block of ~216,000 state spaces, we don't know how large the state space will be. 
*/
function TTTRenderEngine(markovmodel, renderconfig) {

    var wblocks = renderconfig.wblocks;
    var hblocks = renderconfig.hblocks;
    var ticks = 0;
    var square = new Rectangle((renderconfig.width / renderconfig.wblocks), (renderconfig.height / renderconfig.hblocks))
    var locid2graphic = {} //a mapping of location to graphic. location id is a zero indexed value to graphic. 
    var board;
    this.board = board;

    function emptyBoard() {
        board = math.zeros(hblocks, wblocks) //Generate a board. Normally 3x3. Keeps track of location of each piece.
    }

    var svg = d3.select(renderconfig.selector)
        .append("svg")
        .attr("width", renderconfig.width)
        .attr("height", renderconfig.height)

    function drawBoard() {

        console.log("Rendering " + (wblocks * hblocks) + " blocks")
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

        board.forEach(function(value, index, matrix) {
            var gobj = locid2graphic[index]
            var rules = config.rules.players[value]
            if (typeof gobj == 'undefined') {
                showError("Undefined", "Unable to Retreive Gobj")
                return
            }
            gobj.append("text")
                .attr("id", "Marker" + index)
                .attr("class", "mark marker" + value + "makeragent" + value)
                .attr("dy", square.height / 2)
                .attr("dx", square.width / 2)
                .text(function(d) {
                    return "test"
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

    this.updateMarkovModel = function(mm) {
        markovmodel = mm;
    }

    this.updateRenderConfig = function(rendercfg) {
        renderconfig = rendercfg
    }

    this.Update = function() {
        ticks++;
        clearBoard();
        clearMarkers();
        drawBoard();
    }

    this.Start = function() {
        emptyBoard();
        console.log("Starting game." + this)
        drawBoard();
        return this;
    }

    this.Stop = function() {
        console.log("Game finished.")
    }

    //given an index, returns a board x,y position 
    function indexToBoard(idx) {
        var maxindx = baord.size[0] * board.size[1]
        var col = idx % board.size[0]
        var row = Math.floor(idx / board.size[0])
        return [row, col]
    }


}

function showError(type, message) {
    console.error("Error: " + Date.now() + " Type:" + type + "  Message: " + message);
}

var AgentTTTActions = function() {

    AgentTTTActions.PlaceMarker = function(game, agent, markerid) {

        var state = agent.getLastState();
        var states = game.markovmodel.states;
        var bs = indexToBoard(markerid)
        board = board.subset(math.index(bs[0], bs[1], agent.id)) //place marker on baord

        if (!validMove(markerid, agent)) {
            console.log("Not a valid move")
            return;
        }
        agent.Act(state, agent.currentaction, states[markerid])
    }

    function validMove(state, agent) {
        if (agents.jointmdp.states[state.id].isOccupied()) { //square must be empty
            return false;
        } else {
            return true;
        }
    }


};