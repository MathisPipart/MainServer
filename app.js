var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
const { swaggerUi, swaggerSpec } = require("./swagger/swaggerConfig");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var springbootRouter = require('./routes/springboot');
var chatRoutes = require('./routes/mongoDB');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Define the global layout

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/springboot', springbootRouter);
app.use('/chat', chatRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('pages/error', { title: 'Error' });
});

const utils = require('./public/javascripts/utils');

app.locals.formatDuration = utils.formatDuration;
app.locals.generateStarDisplay = utils.generateStarDisplay;

module.exports = app;
