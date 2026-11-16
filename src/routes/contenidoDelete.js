const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerDelete.js');

// 1. Delete en la raíz con query o body: DELETE /contenido?titulo=... o body { "titulo": "..." }
router.delete('/', controller.eliminarContenido);

// 2. Delete por ruta específica de título: DELETE /contenido/titulo/:titulo
router.delete('/titulo/:titulo', controller.eliminarContenidoPorTitulo);

// 3. Delete por ruta específica de nombre: DELETE /contenido/nombre/:titulo
router.delete('/nombre/:titulo', controller.eliminarContenidoPorTitulo);

// 4. Delete por ID (o título si no es numérico): DELETE /contenido/:id
router.delete('/:id', controller.eliminarContenido);

module.exports = router;
