CREATE DATABASE database_links;

USE database_links;

-- Tabla de usuarios
CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(255) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE users;

-- Tabla de proyectos
CREATE TABLE projects(
    id INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL,
    partners TEXT,
    description TEXT,
    supervisor VARCHAR(255) NOT NULL,
    user_id INT(11),
    PRIMARY KEY (id),
    CONSTRAINT fk_user_project FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE projects
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

ALTER TABLE projects
    ADD created_at timestamp NOT NULL DEFAULT current_timestamp;

ALTER TABLE projects
    ADD estatus INT(11) NOT NULL;

DESCRIBE projects;

-- Tabla de links vinculados a proyectos
CREATE TABLE links (
    id INT(11) NOT NULL,
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    project_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_prid FOREIGN KEY (project_id) REFERENCES projects(id)
);

ALTER TABLE links
    ADD PRIMARY KEY (id);

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE links;