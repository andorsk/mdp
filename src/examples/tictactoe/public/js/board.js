class Board extends Array {

    constructor(height, width) {
        super()
        this.height = height;
        this.width = width;
        this.boardarray = this.genEmptyBoard(height, width)
    }

    New(height, width) {
        return constructor(height, width);
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
        console.log("Col " + col + "  other " + (this.width * row))
        return (this.width * row) + col
    }

    setBoardValue(row, col, val) {
        this.Get()[row][col] = val
        console.log("New board is " + JSON.stringify(this.Get()))
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

class IndexRetreival {

    static getVerticalForIdx(idx) {
        var fboard = math.flatten(board).toArray()
        var lidx = idx - context.board.wblocks;
        var ridx = idx + context.board.wblocks;
        if (!checkIdx(lidx) || !checkIdx(ridx)) {
            return null;

        }
        console.log("right index returned is " + ridx)
        return [fboard[lidx], fboard[idx], fboard[ridx]]
    }

    static getHorizontalForIdx(idx) {
        var fboard = math.flatten(board).toArray()
        var lidx = idx - 1
        var ridx = idx + 1

        if (!checkIdx(lidx) || !checkIdx(ridx)) {
            return null;
        }
        return [fboard[lidx], fboard[idx], fboard[ridx]]
    }

    static getLDiagnoalForIndex(idx) {}

    static getRDiagnoalForIndex(idx) {}
}