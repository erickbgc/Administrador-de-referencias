const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

// Login Form
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('succes', 'Bienvenido' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta.'));
        }
    } else {
        return done(null, false, req.flash('message', 'Nombre de usuario incorrecto o no existe.'))
    }

}));

// Sign up Form
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    async (req, username, password, done) => {
        const { fullname } = req.body;
        const newUser = {
            username,
            password,
            fullname
        };
        const multiple = await pool.query('SELECT * FROM users WHERE username = ?', newUser.username)
        if (multiple.length > 0) {
            return done(null, false, req.flash('message', 'Nombre de usuario no disponible.'));
        } else {
            newUser.password = await helpers.encryptPassword(password);
            const result = await pool.query('INSERT INTO users SET ?', [newUser]);
            newUser.id = result.insertId;
            return done(null, newUser);
        }
    }
));

//Muestreo, comparacion de usuarios
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users Where id = ?', [id]);
    done(null, rows[0]);
});