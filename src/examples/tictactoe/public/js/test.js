function TTTUnitTester() {
    runtests();

    function runtests() {
        this.TestTermination();
        this.TestLogic();
    }

}



TTTUnitTester.TestLogic = function() {
    runtests()

    function runtests() {
        iTestHomogeneousArrayChecker();
    }

    function iTestHomogeneousArrayChecker(array) {
        var tf = logicEngine.checkHomogenousArray();

        var arr = [0, 0, 0]
        testAssertEqual(tf(arr), true)

        arr = [0, 1, 0]
        testAssertEqual(tf(arr), false)

        arr = [0, , 0]
        testAssertEqual(tf(arr), false)

        arr[1, 1, 1]
        testAssertEqual(tf(arr), true)

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