
 var loadedscripts = {};

 //fill helper for multi deminsional arrays. fills it with val.
 function fill(mat, val){
   for(var i = 0; i < mat.length; i++){
     mat[i] = mat[i].fill(val)
   }
   return mat;
 }


var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};


 function clone(mat){
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


Array.prototype.insertIntoEach = function(val){
     for(var i = 0; i < this.length; i++){
      var copyOfMyArray = $.extend(true, [], val);   //need to make a copy or else array will update multiple points.   
      this[i] = copyOfMyArray;
     }
}

 //fill helper for multi deminsional arrays. fills it with val.
 function zeroarray(size){
   var arr = new Array(size)
   for(var i = 0; i < arr.length; i++){
     arr[i] = arr[i].fill(0)
   }
   return arr;
 }
 //convert an index to a location on a board.
  function convertindextoloc(board, index){
        var rows = Math.floor(index / board.size()[1])
        var columns = index % board.size()[1]
        return [rows, columns]
  }

  function sendMessage(selector, message){
      $(selector).find("#message").text(message)
  }

  //execute a function by the name
  function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }
  //Load Scripts required to get all the necessary javascript scripts loaded. Better way of handling this later. 
function loadScripts(){
  var scripts = [
    '/js/config.js',
    '/js/game.js',
    '/js/objects.js',
    '/js/agents.js',
    '/js/valueiteration.js',
    '/js/test.js',
    '/js/exploration.js'
  ]

  for(var i =0; i < scripts.length; i++){
    var script = scripts[i];
    loadScript(script, registerScript)
  }
}

function exit( status ) {
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

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}
  function registerScript(url){
    loadedscripts[url] = "true";
  }

  //checks if script is loaded. if not, it will hold to a timing pattern until it is. timeout is set default to 3 sec.
  //Note: For now I just force load of url if it is not loaded synchronously. 
  function waitUntilScriptLoaded(url){
    var defaultTimeout = 3000;
    if(isScriptLoaded(url)){
      return;
    } else{
        console.log("Forcing load of URL" + url);
        loadURLSynchronously(url);
      }
    } 
  
  function loadURLSynchronously(url){
    $.ajax({
      async: false,
      url: url,
      dataType: "script"
  });
  }

  function isScriptLoaded(url){
    if(url in loadedscripts){ 
      return true
    } else{
      return false;
    }
  }

  /**
  Load the javascript first by the url. 
  **/
  function loadScript(url, callback){
    $.ajax({
      url: url,
      dataType: "script",
    }).done(function(){
      callback(url);
    });
  }