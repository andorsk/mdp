
 var loadedscripts = {};

 //fill helper for multi deminsional arrays. fills it with val.
 function fill(mat, val){
   for(var i = 0; i < mat.length; i++){
     mat[i] = mat[i].fill(val)
   }
   return mat;
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
    '/js/gamelisteners.js'
  ]

  for(var i =0; i < scripts.length; i++){
    var script = scripts[i];
    loadScript(script, registerScript)
  }
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