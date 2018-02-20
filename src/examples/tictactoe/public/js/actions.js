class AgentTTTActions {

    //Action returns false if failure 
    static PlaceMarker(context, markerid) {

        var agent = context.getCurrentAgent();
        var board = context.getBoard();

        if (!AgentTTTActions.validMove(board, markerid)) {
            consoleError("INVALID ACTION", "Trying to move into occuppied space")
            return null;
        }
        var choiceloc = board.indexToBoard(markerid);
        board.setBoardValue(choiceloc[0], choiceloc[1], agent.id)

        return BoardToState.calculate(board);
    }

    //must go to empty position
    static validMove(board, markerid) {
        if (board.flatten()[markerid] == undefined) {
            return true;
        }
        return false;
    }
}