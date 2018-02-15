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