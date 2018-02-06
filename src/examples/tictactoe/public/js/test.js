function TTTUnitTester() {
    runtests();

    function runtests() {
        this.TestTermination();
    }

}


TTTUnitTester.TestTermination = function() {
    runtests();

    function runtests() {
        iTestFilled();
        iTest3ofAKind();
    }

    function iTest3ofAKind() {
        var iden = math.eye(3)
        check3ofAKind(board)
    }

    function iTestFilled() { //should create a class to test internal functions
        var blank = math.zeros(3, 3)
        var blank2 = math.zeros(3, 3)
        var blank3 = math.ones(3, 3)

        if (boardCompare(blank, blank2) != false) {
            console.error("ERROR, iTestFilled Failed. Expected false got true")
        }

        if (boardCompare(blank, blank3) != true) {
            console.error("ERROR, iTestFilled Failed. Expected true got false")
        }
    }
}