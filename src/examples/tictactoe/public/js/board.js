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
        empty.fill(new Array(wblocks))
        return empty;
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
    boardToIndex(col, row) {
        return (this.width * row) + col
    }


    getFlattenedIndexValue(idx) {
        var board = this.flatten()
        return board[idx]
    }

}