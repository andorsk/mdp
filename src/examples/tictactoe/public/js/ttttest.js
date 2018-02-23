console.log("Testing the file")
var testvar = "testvar loaded"

class TTTUnitTester {

    constructor() {
        console.log("Init Unit Tester")
    }

    static RunTests() {
        // this.TestTermination();
        this.TestLogic();
        this.TestBoard();
        this.TestMDP()
    }
}

TTTUnitTester.TestMDP = function() {
    runtests()

    function runtests() {
        consoleMessage("-------------------------------------------")
        consoleMessage("INF0", "Running MDP Tests")
        addStateTest()
        probabilityTest()
    }

    function addStateTest() {
        consoleMessage("-------------------------------------------")
        consoleMessage("INFO", "Test for State to MDP")
        var s1 = new State({
            "id": 1
        })

        var s2 = new State({
            "id": 2
        })


        function donothing() {
            console.log("Doing nothing")
        }

        var agent = new Agent(0, "PlaceMarker", [donothing], "")
        var mm = new MDP([s1, s2], [new Action(0, "Do nothing", donothing)])

        testAssertEqual(mm.getTransitions().qmatrix.length, 2, " Expected q matrix length to be 2. Got " + mm.getTransitions().qmatrix.length)

        var s1 = new State({ //copy of state one shouldn't increase the state size.
            "id": 1
        })

        testAssertEqual(mm.getTransitions().qmatrix.length, 2, " Expected q matrix length to be 2. Got " + mm.getTransitions().qmatrix.length)

        var s3 = new State({
            "id": 3
        })


        mm.addState(s3)
        testAssertEqual(mm.getTransitions().qmatrix.length, 3, " Expected q matrix length to be 3. Got " + mm.getTransitions().qmatrix.length)
    }

    function probabilityTest() {
        consoleMessage("INFO", "Starting Probability Test")
        var s1 = new State({
            "id": 1
        })

        var s2 = new State({
            "id": 2
        })


        function donothing() {
            return;
        }



        var action = new Action(0, "Force the State", AgentTTTActions.ForceState)
        var agent = new Agent(0, "Action", [action], "")

        var mm = new MDP([s1, s2], [action], [agent])
        for (var i = 0; i < mm.agents.length; i++) { //for each agent attach a mdp model;	
            mm.agents[i].mdp = new MDP([s1, s2], [action], [agent], {})
            mm.agents[i].jointmdp = mm;
        }

        var context = {}
        agent.executeAction(action, {}, s1)
        agent.executeAction(action, {}, s2)

        //s1 -> s2 means s1.id -> s2.id = 1
        var exp = agent.mdp.transitions.qmatrix[0][0][1]
        testAssertEqual(exp, 1, " Not equal expected " + 1 + " Given " + exp + " QMat is " + agent.mdp.transitions.qmatrix)

        agent.executeAction(action, {}, s1)
        agent.executeAction(action, {}, s2)

        //s1 -> s2 -> s1 -> s2 means s2.id -> s1.id = 1 && s1.id -> s2.id = 2
        var exp = agent.mdp.transitions.qmatrix[0][0][1]
        testAssertEqual(exp, 2, " Not equal expected " + 2 + " Given " + exp + " QMat is " + agent.mdp.transitions.qmatrix)

        var exp = agent.mdp.transitions.qmatrix[1][0][0]
        testAssertEqual(exp, 1, " Not equal expected " + 1 + " Given " + exp + " QMat is " + agent.mdp.transitions.qmatrix)

    }
}

TTTUnitTester.TestBoardToState = function() {

}


TTTUnitTester.TestBoard = function() {
    runtests()

    function runtests() {
        consoleMessage("-------------------------------------------")
        consoleMessage("INFO", "Running tests for Board")
        iTestBoardCreation();
    }

    function iTestBoardCreation() {
        var board = new Board(5, 5).Get()
        var arr = new Array(5)
        for (var i = 0; i < arr.length; i++) {
            arr.fill(new Array(5))
        }
        testAssertEqual(LogicEngine.JSONObjectEqual(arr, board), true, " Not equal expected " + arr + " Given " + board)
    }
}


TTTUnitTester.TestLogic = function() {

    runtests()

    function runtests() {
        consoleMessage("-------------------------------------------")
        console.log("Running Logic Tests")
        iTestHomogeneousArrayChecker();
        iTestBorderMatrix()
    }


    function iTestBorderMatrix() {
        consoleMessage("Testing Border Logic")

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

        consoleMessage("Testing 3x3 Array")
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

        consoleMessage("Testing 4x3 Array")
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

        consoleMessage("Testing 3x4 Array")
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
        consoleMessage("Testing edge")
        testAssertEqual(LogicEngine.JSONObjectEqual(edgeCheck(test3by4array), exp), true, " Not equal to expected " + exp + " Given " + edgeCheck(test3by4array))
        testAssertEqual(LogicEngine.JSONObjectEqual(edgeCheck(test4by3array), exp), false, " Not equal to expected " + exp + " Given " + edgeCheck(test4by3array))
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
        consoleMessage("-------------------------------------------")
        consoleMessage("INFO", "Testing Termination")
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