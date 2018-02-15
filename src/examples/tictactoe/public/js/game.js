/**
Game Engine is responsible for: 

1) Context
2) Render Initialiation
3) Training and Testing Formulas
4) Termination of game 

The logic right now for checking bounds needs to eventually be updated. This was quick. 
*/
function GameEngine(markovmodel, renderconfig) {
    consoleMessage("Initializing Game Engine")

    //Set up context
    var context = new GameContext()
    var renderengine = new TTTRenderEngine(renderconfig)

    renderengine.Start();
    context.setRenderEngine(renderengine)
    context.setMarkovModel(markovmodel)
    this.context = context;


    function playMarker(agent, markerid) {
        var placemarker = agent.actionset[0].action
        if (!placemarker(context, markerid)) {
            return;
        }

        context.getRenderEngine().Update(context.getBoard())
        checkEnd()
        context.nextTurn()
    }

    function checkEnd() {

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

    function playTurn() {

        var agent = context.getCurrentAgent();
        var board = context.getBoard();
        var rendereng = context.getRenderEngine();

        consoleMessage(agent.name + "'s Turn")
        var stateprime = agent.Explore(function() {
            TTTExploration.RandomChoice(context) //change this to change the exploration
        });

        rendereng.Update();
        context.nextTurn();
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

    function train(iter = 1000) {
        var tick = 0;

        var tickiter = setInterval(function() {
            sendMessage(renderconfig.selector, "Round " + tick)
            //    playRound();

            tick++;
            console.log("Tick is " + tick)
            if (tick > iter) { //break 
                clearInterval(tickiter)
                sendMessage("Done")
            }
        }, 1000)
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
        if (this.board != null) {
            this.getBoard().Reset()
        }
    }

    getCurrentAgent() {
        return markovmodel.agents[this.getTurn()]
    }

    nextTurn() {
        var turn = this.getTurn() + 1 >= this.markovmodel.agents.length ? 0 : this.getTurn() + 1;
        this.setTurn(turn)

    }

    terminate() {
        consoleMessage("Game is finished")
        this.finished = true;
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