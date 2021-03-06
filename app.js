var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var expressWinston = require('express-winston');
//var winston = require('winston'); // for transports.Console
var express = require('express');

var externalMongo = process.env.HEROKU_MONGODB_URI // heroku config var for external mongodb in mlab
mongoose.connect(externalMongo || 'mongodb://localhost/tips');
var app = express();

require('./models/IdeaState');
require('./models/UserRole');
require('./models/Subjects');
require('./models/Logger');
require('./models/Ideas');
require('./models/Comments');
require('./models/Tips');





require('./models/Users');
require('./config/passport');



var routes = require('./routes/index');
var userRoutes = require('./routes/userRoutes');
var ideaRoutes = require('./routes/ideaRoutes');
var subjectRoutes = require('./routes/subjectRoutes');
var activityRoutes = require('./routes/activityRoutes');






// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());


app.use('/', routes);
app.use('/users', userRoutes);
app.use('/ideas',ideaRoutes);
app.use('/subjects',subjectRoutes);
app.use('/activities',activityRoutes);

/*
app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
      colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
    }));
*/

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
  console.log("erorrr");
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
