const express = require('express');
const router = express.Router();

const { verificaTokenImg } = require('../middlewares/autenticacion');

const UploadController = require('../controllers/UploadController');

router.put('/upload/:tipo/:id', UploadController.upload);
router.get('/upload/:tipo/:img', verificaTokenImg, UploadController.getImagen);

module.exports = router;
