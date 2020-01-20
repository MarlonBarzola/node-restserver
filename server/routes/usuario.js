const express = require('express');
const router = express.Router();

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const UsuarioController = require('../controllers/UsuarioController');


router.get('/usuario', verificaToken, UsuarioController.index);
router.post('/usuario', [verificaToken, verificaAdminRole ], UsuarioController.crear);
router.put('/usuario/:id', [verificaToken, verificaAdminRole ], UsuarioController.actualizar);
router.delete('/usuario/:id', [verificaToken, verificaAdminRole ], UsuarioController.borrar);

module.exports = router;