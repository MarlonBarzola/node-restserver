const express = require('express');
const router = express.Router();

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let CategoriaController = require('../controllers/CategoriaController');

router.get('/categoria', verificaToken, CategoriaController.index);
router.get('/categoria/:id', verificaToken ,CategoriaController.getCategoria);
router.post('/categoria', verificaToken ,CategoriaController.crear);
router.put('/categoria/:id', verificaToken, CategoriaController.actualizar);
router.delete('/categoria/:id', [ verificaToken, verificaAdminRole ], CategoriaController.borrar);

module.exports = router;