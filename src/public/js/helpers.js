var loadedscripts = {};

//fill helper for multi deminsional arrays. fills it with val.
function fill(mat, val) {
    for (var i = 0; i < mat.length; i++) {
        mat[i] = mat[i].fill(val)
    }
    return mat;
}


var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};


function clone(mat) {
    return $.extend(true, [], mat);
}

//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


Array.prototype.insertIntoEach = function(val) {
    for (var i = 0; i < this.length; i++) {
        var copyOfMyArray = $.extend(true, [], val); //need to make a copy or else array will update multiple points.   
        this[i] = copyOfMyArray;
    }
}

//fill helper for multi deminsional arrays. fills it with val.
function zeroarray(size) {
    var arr = new Array(size)
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].fill(0)
    }
    return arr;
}
//convert an index to a location on a board.
function convertindextoloc(board, index) {
    var rows = Math.floor(index / board.size()[1])
    var columns = index % board.size()[1]
    return [rows, columns]
}

function sendMessage(selector, message) {
    $(selector).find("#message").text(message)
}

//execute a function by the name
function executeFunctionByName(functionName, context /*, args */ ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}
//Load Scripts required to get all the necessary javascript scripts loaded. Better way of handling this later. 
function loadScripts() {
    var scripts = [
        '/js/config.js',
        '/js/objects.js',
        '/js/agents.js',
        '/js/valueiteration.js',
        '/js/test.js',
    ]

    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        loadScript(script, registerScript)
    }
}

function exit(status) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation(e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i = 0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function(e) {
            stopPropagation(e);
        }, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}

function registerScript(url) {
    loadedscripts[url] = "true";
}

//checks if script is loaded. if not, it will hold to a timing pattern until it is. timeout is set default to 3 sec.
//Note: For now I just force load of url if it is not loaded synchronously. 
function waitUntilScriptLoaded(url) {
    var defaultTimeout = 3000;
    if (isScriptLoaded(url)) {
        return;
    } else {
        console.log("Forcing load of URL" + url);
        loadURLSynchronously(url);
    }
}

function loadURLSynchronously(url) {
    $.ajax({
        async: false,
        url: url,
        dataType: "script"
    });
}

function isScriptLoaded(url) {
    if (url in loadedscripts) {
        return true
    } else {
        return false;
    }
}


var MT = ["INFO", "WARNING", "ERROR"]

function consoleMessage(type, message) {
    if (typeof message == "undefined") {
        consoleMessageSimple(type)
    } else {
        console.log(Date.now() + " : " + " Type : " + type + " Message: " + message)
    }

}

function consoleMessageSimple(message) {
    console.log(Date.now() + " : " + " Message: " + message)
}


function isNull(val) {
    if (val == null) {
        return true;
    } else return false
}


/** 
 * From: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 * 
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
function hashCode(s) {
    if (isNaU(s)) {
        return null;
    }
    var h = 0,
        l = s.length,
        i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};



function testAssertEqual(given, expected, mm) {

    if (given != expected) {
        var m = "Given: " + given + " Expected: " + expected;
        if (message != null) {
            m = m.concat(" Message: " + mm)
        }
        testErrorMessage("ASSERT", m)
    }
}

var partial = function(func) {

    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};

//loop through a multidimensional array
//callback function takes (loc, val)
Array.prototype.forEachNN = function(callback) {
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < this[i].length; j++) {
            callback([i, j], this[i][j])
        }
    }
}

//is null or undefined
function isNaU(object) {
    if (object == null) {
        return true;
    }
    return false;
}

Array.prototype.unique = function() {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};



//@input: 
//@return: index
function onlyUniqueItemsFromArray(arr) {
    var map = {}
    arr.forEach(function(cv, index, arr) {
        map[cv] = true;
    })

    var ret = []
    for (var element in map) {
        ret.push(element)
    }
    return ret;
}


function testErrorMessage(type, message) {
    if (message == 'undefined') {
        type = "UNDEFINED"
        message = type;
    }
    // alert("Failure on test. Message :  " + message)
    consoleError(type, message)
}

function consoleError(type, message, showtime = true) {
    if (showtime) {
        console.error("Error: " + Date.now() + " Type:" + type + "  Message: " + message);
    } else {
        console.error("Error Type:" + type + "  Message: " + message);
    }
}

/**
Load the javascript first by the url. 
**/
function loadScript(url, callback) {
    $.ajax({
        url: url,
        dataType: "script",
    }).done(function() {
        callback(url);
    });
}