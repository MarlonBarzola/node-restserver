const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const ctrl = {}

ctrl.index = async (req, res) => {

    let desde = req.query.pagina || 1;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    let base = (desde - 1) * limite

    await Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(base)
    .limit(limite)
    .exec((err, usuarios) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.countDocuments({ estado: true }, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                total: conteo 
            });

        });

    });

}

ctrl.crear = async (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    await usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

}

ctrl.actualizar = async (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

/*     delete body.password;
    delete body.google; */

    await Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

}

ctrl.borrar = async (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    
    //await Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    await Usuario.findByIdAndUpdate(id, { $set: cambiaEstado }, { new: true }, (err, usuarioBorrado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });

        }

        res.json({

            ok: true,
            usuario: usuarioBorrado

        });

    }); 

}

module.exports = ctrl