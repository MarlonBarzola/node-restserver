const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const ctrl = {};

//
// ─── SUBIR ARCHIVOS ─────────────────────────────────────────────────────────────
//

ctrl.upload = (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //VALIDAR TIPO
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '), 
            }
        });

    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado.pop();

    //EXTENSIONES PERMITIDAS
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf( extension ) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension  
            }
        });

    }

    // CAMBIAR NOMBRE DEL ARCHIVO
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            
            });

        }
    
    });

    //AQUI, IMAGEN CARGADA

    if(tipo === 'usuarios') 
        imagenUsuario(id, res, nombreArchivo);
    else
        imagenProducto(id, res, nombreArchivo);

}

imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if(!usuarioDB) {

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });

        }

        //VERIFICAR QUE LA RUTA EXISTE
        borrarArchivo(usuarioDB.img, 'usuarios');

        //GUARDAR NUEVA IMAGEN EN LA BD

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });

        });

    });

}

imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if(!productoDB) {

            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        }

        //VERIFICAR QUE LA RUTA EXISTE
        borrarArchivo(productoDB.img, 'productos');

        //GUARDAR NUEVA IMAGEN EN LA BD

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoDB) => {

            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });

        });

    });

}

borrarArchivo = (nombreImagen, tipo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if(fs.existsSync(pathImagen)) {

        fs.unlinkSync(pathImagen);

    }

}

//
// ─── OBTENER UNA IMAGEN ─────────────────────────────────────────────────────────
//

ctrl.getImagen = (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if(fs.existsSync(pathImagen)) {
        
        res.sendFile(pathImagen);

    } else {

        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noImagePath);

    }

}

module.exports = ctrl;