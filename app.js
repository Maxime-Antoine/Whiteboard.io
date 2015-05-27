var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = http.listen(3000, function(){
	console.log('server listening on *:3000');
});


//A user connects to the server (opens a socket)
io.sockets.on('connection', function(socket){
	// (2): The server receives a ping event from the browser on this socket
	socket.on('ping', function(data){
		console.log('socket: server receives ping (2)');
		
		// (3): Return a pong event to the browser echoing back the data from the ping event
		io.sockets.emit('pong', data);
		console.log ('socket: server send pong (3)');
	});
	
	socket.on('drawCircle', function(data, session){
		// console.log('session' + session + ' drew:');
		// console.log(data);
		socket.broadcast.emit('drawCircle', data);
	});
});

module.exports = app;
