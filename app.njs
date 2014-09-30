// Include the required modules
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('./modules/sockets.njs').listen(server),
	documents = require('./routes/documents.njs'),
	front = require('./routes/front.njs'),
	users = require('./routes/users.njs'),
	files = require('./routes/files.njs');		

// Set the port
var port = process.env.PORT || 1337;

// Let the server listen
server.listen(port);

// Configure the application
app.configure(function() {

	// Enable the bodyParser so we can access POST data
	app.use(express.bodyParser());
	
	// Enable the cookieParser so we can work with cookies
	app.use(express.cookieParser('super-duper-secret'));

	// add req.session cookie support
	app.use(express.cookieSession());

	// Enable the logging
	//app.use(express.logger('dev'));

	// Set the path to the public and upload directory
	app.use(express.static(__dirname + '/public'));

	// Set the views directory
	app.set('views', __dirname + '/views');

	// Set the view engine
	app.set('view engine', 'jade');

	// Set the local vars/functions
	app.locals(require('./modules/app.locals.njs'));
});

// Homepage route
app.get('/', front.index);

// Users routes
app.get('/register', users.register);
app.post('/register', users.create);
app.get('/login', users.login);
app.post('/login', users.login);
app.get('/logout', users.logout);
app.get('/dashboard', users.dashboard);

// Document routes
app.post('/setstyle', documents.setstyle);
app.get('/document/edit/:id', documents.edit);
app.get('/document/manage/:id', documents.manage);
app.get('/custom.css', documents.css);

// Files routes
app.post('/file-upload', files.upload);
app.post('/block-added', documents.saveBlock);

