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
class BoardToState {

    constructor(board) {
        this.board = board;
        this.calculate()
        return this.convertToState(id)
    }

    static calculate(board) {
        var totalpieces = BoardToState.countBoardPieces(board)
        var rowpieces = BoardToState.countPiecesInRows(board)
        var boardarray = board.Get()
    }

    calculate() {
        this.boardarr = this.board.Get()
        this.boardpiecesnum = this.countBoardPieces();
        this.rowpiecenumber = this.countPiecesInRows();
    }

    //need to pass an id
    convertToStateObject(id) {

        if (id == 'undefined') {
            consoleError("INVALID", "ID not specified")
            return
        }
        var id = 1;
        return new State(id, id, this);
    }

    //Count the total number of board pieces
    countBoardPieces() {
        BoardToState.countBoardPieces(this.board)
    }

    static countBoardPieces(board) {
        return board.flatten().filter(Object).length
    }

    //Count # of pieces in columns and rows
    countPiecesInRows() {
        return BoardToState.countPiecesInRows(this.board)
    }

    static countPiecesInRows(board) {
        var boardarr = board.Get()
        var res = {}
        for (var i = 0; i < boardarr.length; i++) {
            res[i] = boardarr[i].filter(Object).length
        }
        return res
    }
}


class BoardToStateRepresentation {

    constructor(board) {
        this.board = board;
        this.Get()
    }

    Get() {
        this.totalpiececount = this.countBoardPieces(this.board)
        this.openspots = this.board.flatten().length - this.totalpiececount
    }

    countBoardPieces() {
        return BoardToStateRepresentation.countBoardPieces(this.getBoard())
    }

    getBoard() {
        return this.board;
    }

    static countBoardPieces(board) {
        return board.flatten().filter(Number).length
    }

    //count the number of pieces on a column
    countBoardPiecesOnColumn(board, col) {
        return 3
    }

}