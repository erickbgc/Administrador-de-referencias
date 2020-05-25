const express = require('express');
const morgan = require('morgan');
const handleBars = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const sesion = require('express-session');
const mySqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//Inicializacion
const app = express();
require('./lib/passport');


//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', handleBars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(sesion({
    secret: 'mysqlprograweb',
    resave: false,
    saveUninitialized: false,
    store: new mySqlStore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//variables requeridas
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


//Rutas del navegador
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/projects', require('./routes/projects'));
app.use('/users', require('./routes/users'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});