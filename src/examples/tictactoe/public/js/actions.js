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

        var ret = BoardToState.calculate(board);
        console.log("Returnning state " + ret)
        return ret;
    }

    //must go to empty position
    static validMove(board, markerid) {
        if (board.flatten()[markerid] == undefined) {
            return true;
        }
        return false;
    }

    static NullState() {
        return new State()
    }

    static ForceState(state) {
        return state;
    }
}