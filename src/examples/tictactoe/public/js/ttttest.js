console.log("Testing the file")
var testvar = "testvar loaded"

class TTTUnitTester {

    constructor() {
        console.log("Init Unit Tester")
    }

    static RunTests() {
        // this.TestTermination();
        this.TestLogic();
    }

}



TTTUnitTester.TestLogic = function() {

    runtests()

    function runtests() {
        console.log("Running Logic Tests")
        iTestHomogeneousArrayChecker();
        iTestBorderMatrix()
    }


    function iTestBorderMatrix() {
        sendMessage("Testing Border Logic")

        const test3by3array = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ]

        const test4by3array = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11]
        ]

        const test3by4array = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [9, 10, 11]
        ]


        var checkHorz = LogicEngine.getHorizontalBorderIndexArray
        var checkVert = LogicEngine.getVerticalBorderIndexArray

        sendMessage("Testing 3x3 Array")
        var exp = [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [2, 0],
            [2, 2]
        ]

        testAssertEqual(LogicEngine.JSONObjectEqual(checkHorz(test3by3array), exp), true, " Not equal expected " + exp + " Given " + checkHorz(test3by3array))
        exp = [
            [0, 0],
            [0, 1],
            [0, 2],
            [2, 0],
            [2, 1],
            [2, 2]
        ]

        testAssertEqual(LogicEngine.JSONObjectEqual(checkVert(test3by3array), exp), true, " Not equal expected " + exp + " Given " + checkVert(test3by3array))

        sendMessage("Testing 4x3 Array")
        exp = [
            [0, 0],
            [0, 3],
            [1, 0],
            [1, 3],
            [2, 0],
            [2, 3]
        ]
        testAssertEqual(LogicEngine.JSONObjectEqual(checkHorz(test4by3array), exp), true, " Not equal expected " + exp + " Given " + checkHorz(test4by3array))

        exp = [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [2, 0],
            [2, 1],
            [2, 2],
            [2, 3]

        ]
        testAssertEqual(LogicEngine.JSONObjectEqual(checkVert(test4by3array), exp), true, " Not equal expected " + exp + " Given " + checkVert(test4by3array))

        sendMessage("Testing 3x4 Array")
        exp = [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [2, 0],
            [2, 2],
            [3, 0],
            [3, 2]

        ]
        testAssertEqual(LogicEngine.JSONObjectEqual(checkHorz(test3by4array), exp), true, " Not equal expected " + exp + " Given " + checkHorz(test3by4array))

        exp = [
            [0, 0],
            [0, 1],
            [0, 2],
            [3, 0],
            [3, 1],
            [3, 2]
        ]

        testAssertEqual(LogicEngine.JSONObjectEqual(checkVert(test3by4array), exp), true, " Not equal expected " + exp + " Given " + checkVert(test3by4array))

        exp = [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 2],
            [3, 0],
            [2, 0],
            [2, 2],
            [3, 1],
            [3, 2]
        ]

        var edgeCheck = LogicEngine.getEdgeLocations
        console.log("Testing edge")
        testAssertEqual(LogicEngine.JSONObjectEqual(edgeCheck(test3by4array), exp), true, " Not equal to expected " + exp + " Given " + edgeCheck(test3by4array))
    }


    function iTestHomogeneousArrayChecker(array) {
        var tf = LogicEngine.checkHomogeneousArray;

        var arr = [0, 0, 0]
        testAssertEqual(tf(arr), true, "value: " + arr.toString())

        arr = [0, 1, 0]
        testAssertEqual(tf(arr), false, "value: " + arr.toString())

        arr = [0, , 0]
        testAssertEqual(tf(arr), false, "value: " + arr.toString())

        arr = [1, 1, 1]
        testAssertEqual(tf(arr), true, "value: " + arr.toString())

        arr = []
        testAssertEqual(tf(arr), false, "value: " + arr.toString())

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