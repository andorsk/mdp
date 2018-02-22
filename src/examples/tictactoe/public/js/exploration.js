//This would be better implemented as an interface. With an axploration class
//and each exploration.js file implementing the Exploration interface
class TTTExploration {

    //To Make a Random Choice, at Minimimum you need:
    //@return NewState
    //@Board Context
    //PlaceMarker must be index 0. Need to do lookup by name
    static RandomChoice(context) {

        var board = context.getBoard()
        var boardsize = board.height * board.width
        var chosen = false;
        var currentAgent = context.getCurrentAgent();
        var attempts = 0; //chosen just to ensure breakage. 

        var oldstate = currentAgent.getLastState()

        while (chosen == false) { //go until a valid move
            attempts++; //for debugging
            var randomIdx = Math.floor(Math.random() * boardsize)
            var newstate = currentAgent.executeAction(currentAgent.getActionByName("PlaceMarker"), {}, context, randomIdx)

            if (newstate != null || attempts > 30) {
                chosen = true;
            }
        }

        return newstate
    }


}