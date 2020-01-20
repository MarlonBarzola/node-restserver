const express = require('express');
const router = express.Router();

let { verificaToken } = require('../middlewares/autenticacion');

let ProductoController = require('../controllers/ProductoController');

router.get('/producto', verificaToken, ProductoController.index);
router.get('/producto/:id', verificaToken ,ProductoController.getProducto);
router.get('/producto/buscar/:termino', verificaToken, ProductoController.buscar);
router.post('/producto', verificaToken ,ProductoController.crear);
router.put('/producto/:id', verificaToken, ProductoController.actualizar);
router.delete('/producto/:id', verificaToken, ProductoController.borrar);

module.exports = router;