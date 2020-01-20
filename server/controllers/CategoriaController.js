const _ = require('underscore');

const Categoria = require('../models/categoria');

const ctrl = {};

//
// ─── MOSTRAR TODAS LAS CATEGORIAS ───────────────────────────────────────────────
//

ctrl.index = (req, res) => { 

    let desde = req.query.pagina || 1;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    let base = (desde - 1) * limite;

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .skip(base)
    .limit(limite)
    .exec((err, categorias) => {

        if(err) {
            
            return res.status(400).json({
                ok: false,
                err
            });
    
        }
    
        Categoria.countDocuments((err, conteo) => {

            res.json({
                ok: true,
                categorias,
                total: conteo 
            });

        });

    }); 

}

//
// ─── MOSTRAR UNA CATEGORIA POR ID ───────────────────────────────────────────────
//

ctrl.getCategoria = (req, res) => {
    
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if(err) {
            
            return res.status(500).json({
                ok: false,
                err
            });
    
        }

        if(!categoriaDB) {
            
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
    
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

}

//
// ─── CREAR NUEVA CATEGORIA ──────────────────────────────────────────────────────
//

ctrl.crear = (req, res) => {

    let categoria = new Categoria({
        usuario: req.usuario._id,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion
    });

    categoria.save( (err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

}

//
// ─── ACTUALIZAR CATEGORIA ───────────────────────────────────────────────────────
//

ctrl.actualizar = (req, res) => {

    //Actualizar descripcion de la categoria
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'La categoría no existe'
            });
        }

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    });

}

//
// ─── BORRAR CATEGORIA ───────────────────────────────────────────────────────────
//

ctrl.borrar = (req, res) => {

    //Solo un administrador puede borrar categorias
    let _id = req.params.id;

    Categoria.findOneAndRemove({ _id }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'La categoría no existe'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoría eliminada correctamente'
        });

    });

}

module.exports = ctrl;