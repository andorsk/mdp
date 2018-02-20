class Board extends Array {

    constructor(height, width) {
        super()
        this.height = height;
        this.width = width;
        this.boardarray = this.genEmptyBoard(height, width)
    }

    Reset() {
        this.boardarray = this.genEmptyBoard(this.height, this.width)
    }

    New(height, width) {
        return new Board.call(this.height, this.width);
    }

    flatten() {
        var board = this.Get();
        var ret = []
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                ret.push(board[i][j])
            }
        }
        return ret;
    }

    emptyCurrentBoard() {
        this.setBoardArray(this.genEmptyBoard(this.height, this.width))
    }

    //Generates an empty board. board is
    //[0 ,[0,1,2,3,4]
    //[1 ,[0,1,2,3,4]
    //Where [i] indicates row and board[0][i] indicates column
    genEmptyBoard(hblocks, wblocks) {
        var empty = new Array(hblocks)
        for (var i = 0; i < empty.length; i++) {
            empty[i] = new Array(wblocks)
        }
        return empty;
    }

    static genEmptyBoard(hblocks, wblocks) {
        return genEmptyBoard(hblocks, wblocks)
    }

    //getters and setters 
    setBoardArray(bd) {
        this.boardarray = bd;
    }

    //A wrapper for getting the board array. 
    Get() {
        return this.getBoardArray();
    }

    getBoardArray() {
        return this.boardarray;
    }

    //Index convert to board position. For example:
    //0,0 -> 0
    //0,1 -> 1
    //0,2 -> 2
    //1,0 -> 3
    //.
    //.
    //(row * wblocks) + column -> index
    //col -> index % width
    //row -> math.Floor(index) / width
    //returns null if bad index
    indexToBoard(idx) {
        if (idx > ((this.width * this.height) - 1) || idx < 0) {
            return null
        }
        var col = idx % this.width
        var row = Math.floor(idx / this.width)
        return [row, col]
    }

    //conversion above in the opposite direction
    boardToIndex(row, col) {
        return (this.width * row) + col
    }

    setBoardValue(row, col, val) {
        this.Get()[row][col] = val
    }

    getFlattenedIndexValue(idx) {
        var board = this.flatten()
        return board[idx]
    }

    // comparision function that compares the current board to another board
    // compares each index spot
    boardAllDifferent(otherboard) {
        var orig = this.flatten()
        var comp = otherboard.flatten()

        if (orig.length != comp.length) {
            consoleError("Array Comparision Error", "Error comparing arrays. They are of different length")
        }

        for (var i = 0; i < orig.length; i++) {
            if (orig[i] == comp[i]) {
                return false;
            }
        }
        consoleMessage("Board is terminated")
        return true;
    }
}

class IndexRetreiver {

    constructor(board) {
        this.board = board;
        this.arr = board.Get()
        this.wblocks = board.width;
        this.hblocks = board.height;
        this.total = (board.width * board.height) - 1;
    }

    getIndexArrays(idx) {
        var h = this.getHorizontalForIdx(idx)
        var v = this.getVerticalForIdx(idx)
        return [h, v]
    }


    getHorizontalForIdx(idx) {

        var fboard = this.board.flatten()
        var lidx = idx - 1
        var ridx = idx + 1

        if (!this.isInLine([lidx, idx, ridx])) {
            return null;
        }
        return [fboard[lidx], fboard[idx], fboard[ridx]]

    }

    getVerticalForIdx(idx) {

        var fboard = this.board.flatten()
        var lidx = idx - this.wblocks;
        var ridx = idx + this.wblocks;

        if (!this.isInLine([lidx, idx, ridx])) {
            return null;
        }

        return [fboard[lidx], fboard[idx], fboard[ridx]]
    }


    isInLine(idxarray) {

        var ph = null;
        var pv = null;

        for (var i = 0; i < idxarray.length; i++) {
            var idx = idxarray[i];

            var ch = (math.floor(idx / this.wblocks))
            var cv = idx % this.wblocks;

            if ((ph != null && ch != ph) && (pv != null && cv != pv)) {
                return false;
            }
            pv = cv;
            ph = ch;

        }

        return true;
    }

    static getLDiagnoalForIndex(idx) {}

    static getRDiagnoalForIndex(idx) {}
}