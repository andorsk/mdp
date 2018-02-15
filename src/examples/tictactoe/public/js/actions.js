class AgentTTTActions {

    //Action returns false if failure 
    static PlaceMarker(context, markerid) {
        var agent = context.getCurrentAgent();
        var board = context.getBoard();
        consoleMessage("Before board is " + board.Get())
        if (!AgentTTTActions.validMove(board, markerid)) {
            consoleError("INVALID ACTION", "Trying to move into occuppied space")
            return false;
        }

        var choiceloc = board.indexToBoard(markerid);
        board.setBoardValue(choiceloc[0], choiceloc[1], agent.id)
        console.log("board is " + board.Get() + " choice loc is " + choiceloc)
        return true;
    }

    //must go to empty position
    static validMove(board, markerid) {
        if (board.flatten()[markerid] == undefined) {
            return true;
        }
        console.log("Board is " + board.flatten()[markerid])
        return false;
    }
}