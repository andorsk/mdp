/**
Game Engine is responsible for: 

1) Context
2) Render Initialiation
3) Training and Testing Formulas
4) Termination of game 

The logic right now for checking bounds needs to eventually be updated. This was quick. 

*/

function GameEngine(markovmodel, renderconfig) {
    var turnindex = 0;
    var context;
    var board = new TTTRenderEngine(markovmodel, renderconfig)
    board.Start();

    var contextPrototype = function() {
        this.turnindex = turnindex;
        this.board = board;
        this.finished = false;
        this.getTurn = function() {
            return this.turnindex;
        }
        this.Reset = function() {
            this.board.Reset();
            this.finished = false;
        }
        this.getCurrentAgent = function() {
            return context.board.markovmodel.agents[context.turnindex]
        }
    };

    context = new contextPrototype();
    this.context = context;


    function playTurn() {

        var agent = markovmodel.agents[turnindex]
        consoleMessage(agent.name + "'s Turn")
        var stateprime = agent.Explore(function() {
            TTTExploration.RandomChoice(context) //change this to change the exploration
        });

        board.Update();
        checkTerminalStates(context);
        nextTurn();
    }

    this.playTurn = function() {
        playTurn();
    }

    function nextTurn() {
        turnindex = turnindex + 1 >= markovmodel.agents.length ? 0 : turnindex + 1;
        context.turnindex = turnindex;
        // sendMessage(renderconfig.selector, board.getAgents()[context.turnindex].name + " turn.")
        return turnindex;
    }

    function playRound() {
        var tick = 0;
        context.Reset();
        while (!context.finished) {
            playTurn();
            if (tick > renderconfig.wblocks * renderconfig.hblocks) {
                consoleError("Failed to Finish Game")
                break;
            }
            tick++;
        }

    }

    this.playRound = function() {
        console.log("PR")
        playRound();
    }

    this.train = function(iter = 1000) {
        var tick = 0;

        var tickiter = setInterval(function() {
            sendMessage(renderconfig.selector, "Round " + tick)
            playRound();
            tick++;
            console.log("Tick is " + tick)
            if (tick > iter) { //break 
                clearInterval(tickiter)
                isTerminated();
                sendMessage("Done")
                consoleMessage("Game is finished")
            }
        }, 1000)
    }

    //checks the board for terminal states. There are a few examples of terminal cases.
    //1) If there is three in the row of a certain type.
    //2) If the board is filled. 
    function checkTerminalStates(context) {
        if (checkFilled(context.board) && !checkIfWinner(context.board)) {
            isTerminated();
            console.log("No Winner")
            return 0;
        } else if (checkFilled(context.board) && checkIfWinner(context.board)) {
            cosole.log("Winner")
            return 1;
        }
    }

    function checkIfWinner(game) {
        //check each spot on the board
        game.board.forEach(function(value, index, matrix) {
            var idx = game.boardToIndex(index[0], index[1])
            var cw = new checkWinner(game.getBoard())
            if (cw.checkStraight(idx)) {

                var agid = game.getBoard().subset(math.index(index[0], index[1])) //return the agent id
                //           sendMessage(context.renderconfig.selector, "Agent " + agid + " wins")
                sendMessage(renderconfig.selector, "Agent " + agid + " wins")
                consoleMessage(agid + " wins the game!")
                return agid
            };
        })
    }

    function isTerminated() {
        //sendMessage(board.renderconfig.selector, "Game is Done")
        consoleMessage("Terminating Game. It is finished")
        context.finished = true;
    }

    GameEngine.checkTerminalStates = checkTerminalStates;

    function checkWinner(board) {
        this.board = board;

        this.checkStraight = function(idx) {
            checkStraight(idx)
        };

        function checkStraight(idx) {

            var vert = getVerticalForIdx(idx)
            var horz = getHorizontalForIdx(idx)

            console.log("For index " + idx + " vert is " + vert + " horz is " + horz)
            if (!isNull(checkHomogeneousArray(vert)) || !isNull(checkHomogenousArray(horz))) {
                return true;
            } else return false;
        }

        function isNull(val) {
            if (val == null) {
                return true;
            } else return false
        }

        function getVerticalForIdx(idx) {
            var fboard = math.flatten(board).toArray()
            var lidx = idx - context.board.wblocks;
            var ridx = idx + context.board.wblocks;
            if (!checkIdx(lidx) || !checkIdx(ridx)) {
                return null;

            }

            console.log("right index returned is " + ridx)
            return [fboard[lidx], fboard[idx], fboard[ridx]]
        }

        function getHorizontalForIdx(idx) {
            var fboard = math.flatten(board).toArray()
            var lidx = idx - 1
            var ridx = idx + 1

            if (!checkIdx(lidx) || !checkIdx(ridx)) {
                return null;
            }
            return [fboard[lidx], fboard[idx], fboard[ridx]]
        }

        function checkOnLatBound(inx) {
            return false;
        }

        function checkOnLongBound(idx) {
            return false;
        }

        function checkHomogeneousArray(arr) {
            if (arr == null) {
                return null
            }

            var f = arr[1]

            if (f == 0) {
                return null
            }

            var comp = new Array(arr.length)
            if (comp.fill(f) == arr) {
                sendMessage(f + " wins!!")
                return f;
            } else return 0;
        }

        function checkIdx(idx) {
            var board = context.board.getBoard();
            if (idx < 0 || idx > 8) { //hardcoding 8
                console.log("Invalid index at " + idx)
                return false;
            }
            return true;
        }
    }

    //Doesn't need to be a 3x3 Board
    function check3ofAKind(game) {
        var board = game.getBoard();
        var cid;

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
    }

    function checkFilled(game) {
        var emptyboard = game.genEmptyBoard();
        var currentboard = game.getBoard();
        return boardAllDifferent(emptyboard, currentboard)
    }

    //best way would probably do an array mask 
    function boardAllDifferent(board1, board2) {
        var b1 = math.flatten(board1).toArray()
        var b2 = math.flatten(board2).toArray();

        if (b1.length != b2.length) {
            consoleError("Array Comparision Error", "Error comparing arrays. They are of different length")
        }

        for (var i = 0; i < b1.length; i++) {
            if (b1[i] == b2[i]) {
                return false;
            }
        }
        consoleMessage("Board is terminated")
        return true;
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



class AgentTTTActions {

    //Action returns false if failure 
    static PlaceMarker(context, markerid) {
        var agent = context.getCurrentAgent();

        if (!this.validMove(context.board, markerid)) {
            consoleError("INVALID ACTION", "Trying to move into occuppied space")
            return false;
        }

        var bs = context.board.indexToBoard(markerid)
        var newboard = context.board.getBoard().subset(math.index(bs[0], bs[1]), agent.id) //place marker on baord

        context.board.setBoard(newboard)
        consoleMessage(agent.name + " moved to row " + bs[0] + " : column " + bs[1])
        return true;
    }

    //must go to empty position
    static validMove(game, markerid) {
        if (game.getFlattenedIndexValue(markerid) != 0) {
            return false;
        }
        return true;
    }


};