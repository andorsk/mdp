/**
Logic engine for game checkers. Wanted to keep it seperate because i hate long code
*/
class LogicEngine {


    //checks if the entries in the function are homogenous. Returns true if they are. Array cannot be null. Will return false. 
    static checkHomogeneousArray(arr) {
        if (arr == null || arr.length == 0) {
            return false
        }

        var ret = false;

        var comp = new Array(arr.length)
        var a2 = comp.fill(arr[0])

        var ret = LogicEngine.checkEqualScalarArrays(a2, arr)
        return ret;

    }

    checkEqualScalarArrays(arr1, arr2) {
        return LogicEngine.checkEqualScalarArrays(arr1, arr2)
    }

    static JSONObjectEqual(obj1, obj2) {
        if (obj1 == null || obj2 == null) {
            return false;
        }

        if (typeof obj1 != typeof obj2) {
            showError("Incompatible comparision", "Not of the same type")
        }

        if (Array.isArray(obj1)) {
            var obj1 = onlyUniqueItemsFromArray(obj1)
            var obj2 = onlyUniqueItemsFromArray(obj2)

            obj1 = obj1.sort()
            obj2 = obj2.sort()
        }
        return JSON.stringify(obj1) == JSON.stringify(obj2)
    }

    //check if two arrays are equal
    static checkEqualScalarArrays(arr1, arr2) {

        var ret = arr1.length == arr2.length && arr1.every(function(v, i) {
            return v === arr2[i]
        })

        return ret;
    }

    //@input: nxn array. Assumes homogeneous characteristics. 
    //@output: array[indexloc] of edge pieces
    static getEdgeLocations(board) {

        var horizontal_borders = LogicEngine.getHorizontalBorderIndexArray(board)
        var vertical_borders = LogicEngine.getVerticalBorderIndexArray(board)

        var edges = horizontal_borders.concat(vertical_borders).unique()
        return edges;
    }

    //get the vertical edges
    static getHorizontalBorderIndexArray(board) {

        var ret = []
        var f = function(loc, val) {
            if (loc[1] % (board[0].length - 1) == 0) {

                ret.push(loc)
            }
        }

        board.forEachNN(f)
        return ret;
    }

    //get the side edges
    static getVerticalBorderIndexArray(board) {
        var ret = []
        var w = board[0].length;
        var h = board.length;

        var f = function(loc, val) {
            var i = (loc[0] + (loc[0] * w) + loc[1])
            if ((i < w) || (i - 1 > w * (h - 1))) {
                ret.push(loc)
            }
        }
        board.forEachNN(f)
        return ret;
    }
}