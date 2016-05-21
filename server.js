var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://microblog_db_1:27017/MEANTest');

app.use(express.static(__dirname + '/app'));
app.use(morgan('dev'));
app.use(bodyParser.raw({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb',extended: 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

require('./routes.js')(app);

app.listen(4000);
