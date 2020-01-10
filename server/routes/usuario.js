const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');

router.get('/usuario', UsuarioController.index);
router.post('/usuario', UsuarioController.crear);
router.put('/usuario/:id', UsuarioController.actualizar);
router.delete('/usuario/:id', UsuarioController.borrar);

module.exports = router;