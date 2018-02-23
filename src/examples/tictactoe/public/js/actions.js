class AgentTTTActions {

    //Action returns false if failure 
    static PlaceMarker(context, markerid) {

        var agent = context.getCurrentAgent();
        var board = context.getBoard();

        if (!AgentTTTActions.validMove(board, markerid)) {
            consoleError("INVALID ACTION", "Trying to move into occuppied space", false)
            return null;
        }
        var choiceloc = board.indexToBoard(markerid);
        board.setBoardValue(choiceloc[0], choiceloc[1], agent.id)

        var ret = BoardToState.calculate(board);

        return new State(ret);
    }

    //must go to empty position
    static validMove(board, markerid) {
        if (board.flatten()[markerid] == undefined) {
            return true;
        }
        return false;
    }

    static NullState() {

        return new State({
            "id": "ns"
        })
    }

    static ForceState(state) {
        return state;
    }
}