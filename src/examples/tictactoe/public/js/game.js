/**
Game Engine is responsible for: 

1) Context
2) Render Initialiation
3) Training and Testing Formulas
4) Termination of game 

The logic right now for checking bounds needs to eventually be updated. This was quick. 
*/
function GameEngine(markovmodel, renderconfig) {

    this.guid = guid()
    console.log("-----------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$----------------------")
    consoleMessage("Initializing Game Engine " + this.guid)

    //Set up context
    var context = new GameContext()
    var renderengine = new TTTRenderEngine(renderconfig)

    renderengine.Start();
    context.setRenderEngine(renderengine)
    context.setMarkovModel(markovmodel)
    this.context = context;

    startPlayers();
    this.getContext = function() {
        return getContext();
    }

    function getContext() {
        return context;
    }

    this.startPlayers = function() {
        startPlayers()
    }

    function startPlayers() {
        for (var i = 0; i < context.getMarkovModel().agents.length; i++) {
            context.getMarkovModel().agents[i].executeAction(context.getMarkovModel().agents[i].getActionByName("NullState"))
        }
    }
    //Rewards are agent specific.
    //If agent wins, then 1
    //Tie = 0
    //Lose = -1;
    function getReward(res, agent) {

        var reward;
        switch (res) {
            case "tie":
                reward = 0;
                break;
            case agent.id:
                reward = 1;
                break;
            case (isNaN(res) && res != agent.id):
                reward = -1;
                break;
            default:
                reward = 0;
                break;
        }
        return reward;
    }


    function playMarker(agent, markerid) {

        console.log("playing marker")
        var placemarker = agent.actionset[0]

        agent.executeAction(placemarker, {}, context, markerid)
        context.getRenderEngine().Update(context.getBoard())

        var reward = checkEnd()
        context.nextTurn()
    }

    function playTurn() {

        getContext().getCurrentAgent().Explore(TTTExploration.RandomChoice, context)
        renderengine.Update();
        checkEnd();
        context.nextTurn();

    }

    function playRound() {

        var tick = 0;
        context.Reset();
        console.log("Playing round")
        while (!context.isFinished()) {
            playTurn();
            if (tick > renderconfig.wblocks * renderconfig.hblocks) {
                consoleError("Failed to Finish Game")
                break;
            }
            tick++;
        }
    }

    function train(iter = 1000) {
        var tick = 1;
        consoleMessage("INFO", "---------------------- Starting Game ----------------------- ")
        var tickiter = setInterval(function() {
            sendMessage(renderconfig.selector, "Round " + tick)
            playRound();
            tick++;
            console.log("Tick is " + tick)
            if (tick > iter) { //break 
                clearInterval(tickiter)
                sendMessage("Done")
            }
        }, 1000)
    }

    function checkEnd() {
        var reward = null;
        var result = TerminationEvaluator.checkTerminationStatus(context.getBoard())
        if (result != null) {
            var message = "";
            if (result == "tie") {
                message = "Game is a tie!"
            } else {
                message = "Winner is " + result
            }
            context.terminate()
            sendMessage(renderconfig.selector, message)
        }
    }
    //public wrappers
    this.nextTurn = function() {
        nextTurn();;
    }

    this.playRound = function() {
        console.log("PR")
        playRound();
    }

    this.train = function(iter = 1000) {
        train(iter);
    }

    this.playMarker = function(idx) {
        playMarker(context.getCurrentAgent(), idx)
    }

    this.playTurn = function() {
        playTurn();
    }
}


//Context stores state information on the game such as the turn, and the render engines. 
class GameContext {

    constructor() {
        this.turnindex = 0;
        this.renderengine = null;
        this.finished = false;
    }

    setRenderEngine(_renderengine) {
        this.renderengine = _renderengine;
    }

    getRenderEngine() {
        return this.renderengine;
    }

    getMarkovModel() {
        return this.markovmodel;
    }

    getBoard() {
        return this.getRenderEngine().board;
    }

    setMarkovModel(_markovmodel) {
        this.markovmodel = _markovmodel;
    }

    getTurn() {
        return this.turnindex;
    }

    setTurn(turn) {
        this.turnindex = turn;
    }

    //clears the entire context
    Clear() {
        this.renderengine = null;
        this.turnindex = 0;
        this.markovmodel = null;
        this.isfinished = false;
    }

    //reset the entire game
    Reset() {
        this.getRenderEngine().Reset()
        this.isfinished = false;
        this.setTurn(0)
    }



    getCurrentAgent() {
        return markovmodel.agents[this.getTurn()]
    }

    nextTurn() {
        var turn = this.getTurn() + 1 >= this.markovmodel.agents.length ? 0 : this.getTurn() + 1;
        this.setTurn(turn)

    }

    isFinished() {
        return this.isfinished;
    }

    terminate() {
        consoleMessage("Game is finished")
        this.isfinished = true;
    }

}

//Check that the board is properly terminated.
//Termination occurs when:
//1. The board is filled
//2. An agent has 3 in a row. 
class TerminationEvaluator {

    constructor(board) {
        this.board = board;
        this.results = null;
    }

    clearResults() {
        this.results = null;
    }

    static checkTerminationStatus(board) {

        var checkWinner = TerminationEvaluator.checkWinner;
        var checkFilled = TerminationEvaluator.checkFilled;

        var result = null;
        //if board is filled and no winner, then the result is a tie.
        if (checkFilled(board) && checkWinner(board) == null) {
            result = "tie"
        }

        //check for a winer
        if (checkWinner(board) != null) {
            result = checkWinner(board)
        }

        return result;
    }

    static checkWinner(board) {
        for (var i = 0; i < ((board.width * board.height) - 1); i++) {
            if (TerminationEvaluator.checkRow(board, i) != null) {
                return board.flatten()[i]
            }
        }
        return null;
    }

    static checkRow(board, idx) {
        var vr = new IndexRetreiver(board);
        var iarr = vr.getIndexArrays(idx)
        for (var i = 0; i < iarr.length; i++) {
            if (LogicEngine.checkHomogeneousArray(iarr[i])) {
                return board.flatten()[idx]
            }
        }
        return null;
    }

    static checkFilled(board) {
        var bbb = new Board(board.height, board.width)
        return board.boardAllDifferent(bbb)
    }

};