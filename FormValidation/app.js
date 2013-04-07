
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator'); //Declare Express-Validator

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(expressValidator);  //required for Express-Validator
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Get
app.get('/', function(req,res){
    res.render('index', { 
        title: 'Form Validation Example',
        message: '',
        errors: {}        
    });            
});

//Post
app.post('/', function(req,res){
    req.assert('name', 'Name is required').notEmpty();           //Validate name
    req.assert('email', 'A valid email is required').isEmail();  //Validate email

    var errors = req.validationErrors();  
    if( !errors){   //No errors were found.  Passed Validation!
        res.render('index', { 
            title: 'Form Validation Example',
        	message: 'Passed Validation!',
        	errors: {}
        });
       
    }
    else {   //Display errors to user
        res.render('index', { 
            title: 'Form Validation Example',
            message: '',
            errors: errors
        });
    }
 });
 
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
