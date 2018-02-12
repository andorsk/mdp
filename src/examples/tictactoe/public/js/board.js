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

    emptyCurrentBoard() {
        setBoardArray(genEmptyBoard(this.height, this.width))
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

}