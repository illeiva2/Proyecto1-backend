const fs = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");


function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se pudo escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, contenido) => {
            if (error) reject(new Error("Error. No se pudo leer"));

            resolve(JSON.parse(contenido));
        });
    });

}

function generarId(ordenes) {
    let mayorId = 0;
    ordenes.forEach((orden) => {
        if (orden.id > mayorId) {
            mayorId = orden.id;
        }  
    });
    return mayorId + 1;
}

async function findAll() {
    const ordenes = await leer();
    return ordenes;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. Id no definido");

    const ordenes = await leer();
    const orden = ordenes.find((elemento) => elemento.id === id);

    if (!orden) throw new Error("Error. Id inexistente");

    return orden;
}

async function create(orden) {
    if (!orden.doe || !orden.ur || !orden.acta) throw new Error("Error, datos incompletos.");

    const ordenes = await leer();
    const ordenConId = { id: generarId(ordenes), ...orden };

    ordenes.push(ordenConId);

    await escribir(ordenes);

    return ordenConId;
}

async function update(orden) {
    if (!orden.id || !orden.doe || !orden.ur || !orden.acta) throw new Error("Error, datos incompletos.");

    const ordenes = await leer();
    const indice = ordenes.findIndex((elemento) => elemento.id === orden.id);

    if (!indice) throw new Error("Error. Id inexistente");

    ordenes[indice] = orden;
    await escribir(ordenes);

    return orden;
}

async function destroy(id) {
    if (!id) throw new Error("Error. Id no definido");

    const ordenes = await leer();
    const orden = ordenes.find((elemento) => elemento.id === id);
    const indice = ordenes.findIndex((elemento) => elemento.id === id);

    if (indice === -1) throw new Error("Error. Id inexistente");

    ordenes.splice(indice, 1);
    await escribir(ordenes);

    return orden;
}

module.exports = { findAll, findOneById, create, update, destroy };