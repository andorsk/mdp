//This would be better implemented as an interface. With an axploration class
//and each exploration.js file implementing the Exploration interface
class TTTExploration {

    //To Make a Random Choice, at Minimimum you need:
    //@return NewState
    //@Board Context
    static RandomChoice(context) {
        var game = context.game.getGame()
        var boardsize = context.game.getBoard().size()[0] * context.game.getBoard().size()[1]
        var randomIdx = Math.floor(Math.random() * boardsize)
        return AgentTTTActions.PlaceMarker(game, game.getAgents()[context.getTurn()], randomIdx)
    }


}