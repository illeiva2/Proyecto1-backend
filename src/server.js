const express = require("express");
const path = require("path");
const { findAll, findOneById, create, update, destroy } = require("./database/data.manager.js");

require("dotenv").config();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/ordenes', (req, res) => {
    findAll()
        .then((ordenes) => res.status(200).send(ordenes))
        .catch((error) => res.status(400).send(error.message))
});

server.get('/ordenes/:id', (req, res) => {
    const { id } = req.params;
    
    findOneById(Number(id))
        .then((orden) => res.status(200).send(orden))
        .catch((error) => res.status(400).send(error.message))
});

server.post('/ordenes', (req, res) => {
    const { doe, acta, ur } = req.body;
    create({ doe, acta, ur })
        .then((ordenes) => res.status(201).send(ordenes))
        .catch((error) => res.status(400).send(error.message))
});

server.put('/ordenes/:id', (req, res) => {
    const { id } = req.params;
    const { doe, acta, ur } = req.body;

    update({ id: Number(id), doe, acta, ur })
        .then((orden) => res.status(200).send(orden))
        .catch((error) => res.status(400).send(error.message))
});

server.delete('/ordenes/:id', (req, res) => {
    const { id } = req.params;
    destroy(Number(id))
        .then((orden) => res.status(200).send(orden))
        .catch((error) => res.status(400).send(error.message))
});

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
});