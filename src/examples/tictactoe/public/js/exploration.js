//This would be better implemented as an interface. With an axploration class
//and each exploration.js file implementing the Exploration interface
class TTTExploration {

    //To Make a Random Choice, at Minimimum you need:
    //@return NewState
    //@Board Context
    static RandomChoice(context) {

        var boardsize = context.board.getBoard().size()[0] * context.board.getBoard().size()[1]
        var chosen = false;

        var attempts = 0; //chosen just to ensure breakage. 

        while (chosen == false) { //go until a valid move
            attempts++; //for debugging
            var randomIdx = Math.floor(Math.random() * boardsize)
            if (AgentTTTActions.PlaceMarker(context, randomIdx) || attempts > 100) {
                chosen = true;
            }
        }
    }


}