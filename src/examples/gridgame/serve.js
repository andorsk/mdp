var http = require('http')
	fs = require('fs')
	sys = require('util')
    express = require('express')
    app = express()
    path = require('path')

// Define the port to run on
app.set('port', 1337);
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Port running ' + port);
});