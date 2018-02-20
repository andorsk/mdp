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


    static calculate(board) {

        var playedpieces = BoardToState.countBoardPieces(board)
        var ret = {
            "playedpieces": playedpieces,
            "unplayedpieces": (board.height * board.width) - playedpieces
        }
        return ret;
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
        var barray = board.flatten()
        return barray.filter(Object).length
    }

    static getMethods(obj) {
        var result = [];
        for (var id in obj) {
            try {
                if (typeof(obj[id]) == "function") {
                    result.push(id + ": " + obj[id].toString());
                }
            } catch (err) {
                result.push(id + ": inaccessible");
            }
        }
        return result;
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