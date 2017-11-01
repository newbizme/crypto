require('dotenv').config();
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var config = require('./config');

//var index = require('./routes/index');
//var users = require('./routes/users');

var User = require('./models/user');

// Connect to the database and load models
require('./models').connect(process.env.MONGOLAB_URI || config.dbUri);

var app = express();

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the user agent is not known
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Tell the app to look for static files in these directories
// THIS WAS TO PRESENT AN INDEX.HTML FILE FOR THE API-ONLY SERVER
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// Expose user upload images to path "http://localhost:3000/uploads"
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'secretpassword',
  resave: true,
  saveUninitialized: false
}));

// Pass the passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log("serializeUser called");
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  console.log("deserializeUser called");
  console.log(_id);
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

// Load Passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
const FacebookStrategy = require('./passport/passport-facebook');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
passport.use('facebook', FacebookStrategy);


// Pass the authentication checker middleware for the priv route
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/priv/v1', authCheckMiddleware);

// API & Auth Routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const privRoutes = require('./routes/priv');
app.use('/auth/v1', authRoutes);
app.use('/api/v1', apiRoutes);
app.use('/priv/v1', privRoutes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


module.exports = app;
