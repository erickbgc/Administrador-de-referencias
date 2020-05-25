//RUTAS DEL NAVEGADOR Y METODOS
const express = require('express');
const router = express.Router();
const localStorage = require('localStorage');

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const project_title = localStorage.getItem('project_title');
    const project_id = localStorage.getItem('project_id');
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Enlace eliminado');
    res.redirect('/projects/' + project_title + '/' + project_id + '/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const project_title = localStorage.getItem('project_title');
    const project_id = localStorage.getItem('project_id');
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Enlace actualizado satisfactoriamente');
    res.redirect('/projects/' + project_title + '/' + project_id + '/links');
});

module.exports = router;