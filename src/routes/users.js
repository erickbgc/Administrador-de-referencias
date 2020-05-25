// Rutas del navegador para el administrador
const express = require('express');
const router = express.Router();
const localStorage = require('localStorage');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { isAdmin } = require('../lib/auth');

// Enlistado de usuarios
router.get('/', isLoggedIn, isAdmin, async (req, res) => {
    const users = await pool.query('SELECT * FROM users');
    res.render('users/list', { users });
});

// Acceso a proyectos
router.get('/:id/projects', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const projects = await pool.query('SELECT * FROM projects WHERE user_id = ?', [id]);
    res.render('users/projects-list', { projects });
});

// Acceso a enlaces
router.get('/:title/:id/links', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;    
    const links = await pool.query('SELECT * FROM links WHERE project_id = ?', [id]);
    res.render('users/links-list', { links });
});

module.exports = router;