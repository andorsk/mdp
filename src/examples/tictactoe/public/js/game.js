function GameEngine(markovmodel, renderconfig) {
    var turnindex = 0;
    var context;
    var game = new TTTRenderEngine(markovmodel, renderconfig)
    game.Start();

    var contextPrototype = function() {
        this.turnindex = turnindex;
        this.game = game;
        this.finished = false;
        this.getTurn = function() {
            return this.turnindex;
        }
    };

    context = new contextPrototype();

    function playTurnSets(num) {
        for (var i = 0; i < num; i++) {
            console.log("Round: " + i)
            playTurnSet();
        }
    }

    function playTurnSet() {
        var turns = 0;
        while (turns != game.getAgents().length) {
            playTurn();
            turns++;
        }
    }

    function playTurn() {

        var agent = markovmodel.agents[turnindex]
        console.log("Agent id is " + agent.id + " CCCCCCCCCCCC" + context.getTurn())
        var stateprime = agent.Explore(function() {
            TTTExploration.RandomChoice(context) //change this to change the exploration
        });

        game.Update()
        nextTurn();
    }


    function nextTurn() {
        turnindex = turnindex + 1 >= markovmodel.agents.length ? 0 : turnindex + 1;
        context.turnindex = turnindex;
        return turnindex;
    }

    this.train = function(iter = 1000) {
        var tick = 0;

        var trainInt = setInterval(function() {
            tick++;
            playTurnSets(1);


            if (tick % 10 == 0) {
                console.log("Tick updated at " + tick)
            }
            if (tick > iter) {
                clearInterval(trainInt)
                console.log("Training finished with " + tick + " ticks.")
            }
        }, 2000)
    }

    //checks the board for terminal states. There are a few examples of terminal cases.
    //1) If there is three in the row of a certain type.
    //2) If the board is filled. 
    var DEBUG = true;

    function checkTerminalStates() {
        check3ofAKind();
        checkFilled();
        if (DEBUG) {
            iTestFilled();
            iTest3ofAKind();
        }
    }

    //Doesn't necessarily need to be a 3x3 board. So need to check diagnol all possibilities.
    function check3ofAKind(game) {
        var board = game.board;
        var cid;

        checkForEachAgent() {
            board.forEach(function(value, index, matrix) {

                var idx = game.boardToIndex(index[0], index[1])

                for (var i = 0; i < game.getAgents().length; i++) {
                    var currentagent = game.getAgents[i];
                    var agid = currentagent.id;
                    if (checkDiagnol(idx, agid) || checkStraight(idx, agid)) {
                        isTerminated();
                    };

                }
            })
        }

        function isTerminated() {
            context.finished = true;
        }

        //Only really need to check the latest agents move. 
        function checkDiagnol(idx, agid) {
            var diag = getDiagnolForIdx(idx);
            if (diag == null) {
                return false;
            }
            for (var i = 0; i < diag.length; i++) {
                if (dig[i] != agid) {
                    return false;
                }
            }
        }

        function getDiagnolForIndex(idx) {
            var size = board.size()
            var fboard = math.flatten(board);
            var lidx = idx - board.size()[1] - 1;
            var ridx = idx + board.size()[1] + 1;

            //check bounds
            if (!checkIdx(lidx) || !checkIdx(ridx)) {
                return null;
            }
            return [fboard[lidx], fboard[idx], fboard[ridx]]
        }

        //check the vertical and horizontal for an index
        function checkStraight(idx, agid) {
            var vert = getVerticalForIdx(idx)
            var horz = getHoizontalForIdx(idx)

            if (vert != null) {
                for (var i = 0; i < vert.length; i++) {
                    if (horz[i] != agid) {
                        return false;
                    }
                }
                return true;
            }

            if (horz != null) {
                for (var i = 0; i < horz.length; i++) {
                    if (horz[i] != agid) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }

        function getVerticalForIdx(idx) {
            var size = board.size();
            var fboard = math.flatten(board)
            var lidx = idx - board.size()[1]
            var ridx = idx + board.size()[1]

            if (!checkIdx(lidx) || !checkIdx(ridx)) {
                return null;
            }

            return [fboard[lidx], fboard[idx], fboard[ridx]]
        }

        function getHorizonalForIdx(idx) {
            var size = board.size();
            var fboard = math.flatten(board)
            var lidx = idx - 1
            var ridx = idx + 1

            if (!checkIdx(lidx) || !checkIdx(ridx)) {
                return null;
            }

            return [fboard[lidx], fboard[idx], fboard[ridx]]

        }

        var checkIdxBounds(idx) {
            if (idx < 0 || idx > (board.size()[1] * (board.size()[0] - 1))) {
                return false;
            }
            return true;
        }

        function checkStraight() {

        }
    }

    function iTest3ofAKind() {
        var iden = math.eye(3)
        check3ofAKind(board)
    }

    function iTestFilled() { //should create a class to test internal functions
        var blank = math.zeros(3, 3)
        var blank2 = math.zeros(3, 3)
        var blank3 = math.ones(3, 3)

        if (boardCompare(blank, blank2) != false) {
            console.error("ERROR, iTestFilled Failed. Expected false got true")
        }

        if (boardCompare(blank, blank3) != true) {
            console.error("ERROR, iTestFilled Failed. Expected true got false")
        }
    }

    //For filled, I will make an empty board. If all values are false then 
    function checkFilled(game) {
        var emptyboard = game.genEmptyBoard();
        var currentboard = game.getBoard();
        return boardCompare(emptyboard, currentboard)
    }

    function boardCompare(board1, board2) {

        if (math.sum(emptyboard & currentboard) == 0) {
            return true;
        } else return false;
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
function BoardToStateRepresentation(game) {
    var board = game.board;
    var markovmodel = game.markovmodel;

    console.log("Running Board To State Representation")
    this.currentAgentID = markovmodel.agents[game.turnindex]
    this.numofpieces = countBoardPieces(board)
    this.amountofpiecesonleft = countBoardPiecesOnColumn(board, 0)
    this.amountofpiecesinmiddle = countBoardPiecesOnColumn(board, 1)
    this.amountofpiecesonright = countBoardPiecesOnColumn(board, 2)
    this.minmanhattandistanceforopposingplayer = manhattanDistanceForPlayer(this.currentAgentID, board)[0] //TODO: Change current Agent ID to other agent ID. 
    this.maxmanhattandistanceforopposingplayer = manhattanDistanceForPlayer(this.currentAgentID, board)[1]
    this.avgmanhattandistanceforopposingplayer = manhattanDistanceForPlayer(this.currentAgentID, board)[2]



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


    //adding state is a little different than the grid game because we don't know how many states there will be. We don't want to have redundant states. 
    /* var strver = JSON.stringify(this)
    if (markovmodel.statelookup.hasOwnProperty(strver)) { //make sure we haven't seen this state before. 
      return markovmodel.statelookup[strver]
    }*/
    var state = new State(markovmodel.states.length, "State" + markovmodel.states.length, "test", "")
    markovmodel.states.push(state); //create the state and push it. 
    //markovmodel.statelookup[strver] = state
    return state;
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

    var game = this;

    this.board = null;
    game.markovmodel = markovmodel;
    //Probably better to use simple 2d array from native functions rather than math.js. 

    function emptyBoard() {
        var board = game.getBoard();
        board = math.matrix();
        board.resize([hblocks, wblocks], math.uninitalized)
        game.setBoard(board)
        return board;
    }

    this.genEmptyBoard() {
        return emptyBoard();
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
        console.log("Drawing markers for game " + game.board)
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
    this.indexToBoard = function(idx) {
        console.log("INDEX TO BOARD" + game.getBoard().size()[1])
        var maxindx = game.getBoard().size()[0] * game.getBoard().size()[1]

        var col = idx % this.board.size()[0]
        var row = Math.floor(idx / this.board.size()[0])
        return [row, col]
    }

    this.boardToIndex = function(col, row) {
        return (wblocks * row) + col
    }

}

var MT = ["INFO", "WARNING", "ERROR"]

function consoleMessage(type, message) {
    console.log(Date.now() + " : " + " Type : " + type + " Message: " + message)
}

function showError(type, message) {
    console.error("Error: " + Date.now() + " Type:" + type + "  Message: " + message);
}

class AgentTTTActions {

    //Actions return a null value if no good. 
    static PlaceMarker(game, agent, markerid) {

        var state = agent.getLastState();
        var states = agent.mdp.states;

        var bs = game.indexToBoard(markerid)
        var newboard = game.getBoard().subset(math.index(bs[0], bs[1]), agent.id) //place marker on baordx
        console.log("New Board is " + newboard)
        game.setBoard(newboard)

        if (!this.validMove(markerid, agent)) {
            console.log("Not a valid move")
            return;
        }

        //return the updated state
        return BoardToStateRepresentation(game)
    }

    static validMove(state, agent) {
        return true;
    }


};