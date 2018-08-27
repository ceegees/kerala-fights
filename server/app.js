const express = require('express');
// const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); 
const passport = require('passport');
const app = express();
const models = require('./models');
const cookieSession = require('cookie-session');
const {COOKIE_KEYS} = require('./config/keys');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by');  
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({ 
    maxAge: 24*60*60*1000,
    keys: COOKIE_KEYS
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    models.User.findOne({
        where:{
            id:id
        }
    }).then(user => { 
        done(null, user);
    })
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/rescue',require('./routes/api/rescue'));
app.use('/api/v1/service-provider',require('./routes/api/provider'));
app.use('/api/v1',require('./routes/api'));

app.use('/', require('./routes/index'));
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;