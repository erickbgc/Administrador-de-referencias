// RUTAS DEL NAVEGADOR Y MÉTODOS
const express = require('express');
const router = express.Router();
const localStorage = require('localStorage');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { isNotAdmin } = require('../lib/auth');

router.get('/create', isLoggedIn, isNotAdmin, (req, res) => {
    res.render('projects/create');
});

router.post('/create', isLoggedIn, isNotAdmin, async (req, res) => {
    const { title, supervisor, partners, description, estatus } = req.body;
    const newProject = {
        title,
        supervisor,
        partners,
        description,
        estatus,
        user_id: req.user.id
    }
    let myList = [newProject.title, newProject.supervisor, newProject.estatus];
    try {
        myList.forEach((element) => {
            if (element == '') {
                req.flash('message', 'No se pueden dejar espacios vacios. *');
                res.redirect('/projects/create');
            }
        });
        await pool.query('INSERT INTO projects set ?', [newProject]);
        req.flash('success', 'Proyecto creado satisfactoriamente');
        res.redirect('/projects');
    } catch (error) {
        console.log("Error en la solicitud\n" + error);
    }
});

router.get('/', isLoggedIn, isNotAdmin, async (req, res) => {
    if (req.user.username == 'admin') {
        const projects = await pool.query('SELECT * FROM projects');
        res.render('projects/list', { projects });
    } else {
        const projects = await pool.query('SELECT * FROM projects WHERE user_id = ?', [req.user.id]);
        res.render('projects/list', { projects });
    }
});

router.get('/edit/:id', isLoggedIn, isNotAdmin, async (req, res) => {
    const { id } = req.params;
    const projects = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    res.render('projects/edit', { project: projects[0] });
});

router.post('/edit/:id', isLoggedIn, isNotAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, supervisor, partners, description, estatus } = req.body;
    const newProject = {
        title,
        supervisor,
        partners,
        description,
        estatus
    };
    await pool.query('UPDATE projects set ? WHERE id = ?', [newProject, id]);
    req.flash('success', 'Proyecto actualizado satisfactoriamente');
    res.redirect('/projects');
});

// ############# acceso a los enlaces ############## 

router.get('/:title/:id/links', isLoggedIn, isNotAdmin, async (req, res) => {
    const { id } = req.params;
    const { title } = req.params;
    localStorage.setItem('project_title', title);
    localStorage.setItem('project_id', id);
    const links = await pool.query('SELECT * FROM links WHERE project_id = ?', [id]);
    res.render('links/list', { links });
});

router.get('/links/add', isLoggedIn, isNotAdmin, (req, res) => {
    const project_id = localStorage.getItem('project_id');
    if ( project_id == null || project_id == undefined) {
        res.redirect('/projects');
    } else {
        res.render('links/add');
    }    
});

router.post('/links/add', isLoggedIn, isNotAdmin, async (req, res) => {
    const { title, url, description } = req.body;
    const project_title = localStorage.getItem('project_title');
    const project_id = localStorage.getItem('project_id');
    if ( project_id == null || project_id == undefined) {
        res.redirect('/projects/');
    } else {
        const newLink = {
            title,
            url,
            description,
            project_id: project_id
        };
        let myLinkCopy = [newLink.title, newLink.url];
        try {
            myLinkCopy.forEach((element) => {
                if (element == '') {
                    req.flash('message', 'No se pueden dejar espacios vacios. *');
                    res.redirect('/projects/create');                                    
                };
            });
            await pool.query('INSERT INTO links set ?', [newLink]);
            req.flash('success', 'Enlace guardado satisfactoriamente');
            res.redirect('/projects/' + project_title + '/' + project_id + '/links');
        } catch (error) {
            console.log("Error en la solicitud: " + error);
        }        
    };
});

module.exports = router;