
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

  /**
  Load the javascript first by the url. 
  **/
  function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}