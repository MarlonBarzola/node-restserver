const _ = require('underscore');

const Producto = require('../models/producto');

const ctrl = {};

//
// ─── MOSTRAR PRODUCTOS ──────────────────────────────────────────────────────────
//

ctrl.index = (req, res) => {

    //populate: usuario, categoria
    let pagina = req.query.pagina || 1;
    let limite = req.query.limite || 5;

    pagina = Number(pagina);
    limite = Number(limite);

    let base = ( pagina - 1 ) * limite;

    Producto.find({disponible: true})
            .populate('categoria', 'categoria')
            .populate('usuario', 'nombre email')
            .skip(base)
            .limit(limite)
            .exec((err, productos) => {

                if(err) {
            
                    return res.status(500).json({
                        ok: false,
                        err
                    });
        
                }

                Producto.countDocuments({disponible: true}, (err, total) => {

                    if(err) {
            
                        return res.status(500).json({
                            ok: false,
                            err
                        });
            
                    }
            
                    res.json({
                        ok: true,
                        productos,
                        total
                    });

                });

            });

}

//
// ─── MOSTRAR UN PRODUCTO POR ID ─────────────────────────────────────────────────
//

ctrl.getProducto = (req, res) => {

    //populate: usuario, categoria

    let id = req.params.id;

    Producto.findById(id)
            .populate('categoria', 'categoria')
            .populate('usuario', 'nombre email')
            .exec((err, productoDB) => {

                if(err) {
        
                    return res.status(500).json({
                        ok: false,
                        err
                    });
        
                }

                if(!productoDB) {

                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No existe el producto'
                        }
                    });

                }
        
                res.json({
                    ok: true,
                    productoDB,
                });

            });

}

//
// ─── BUSCAR PRODUCTOS ───────────────────────────────────────────────────────────
//

ctrl.buscar = (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //insensible a mayus y minus

    Producto.find({ nombre: regex })
            .populate('categoria', 'categoria')
            .exec((err, productos) => {

                if(err) {
        
                    return res.status(500).json({
                        ok: false,
                        err
                    });
        
                }

                if(!productos) {

                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No existe el producto'
                        }
                    });

                }

                res.json({
                    ok: true,
                    productos,
                });

            });

}

//
// ─── CREAR UN PRODUCTO ──────────────────────────────────────────────────────────
//

ctrl.crear = (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    producto.save((err, productoDB) => {

        if(err) {
            
            return res.status(500).json({
                ok: false,
                err
            });

        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

}

//
// ─── ACTUALIZAR UN PRODUCTO ─────────────────────────────────────────────────────
//

ctrl.actualizar = (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if(err) {
            
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if(!productoDB) {
            
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        }

        res.json({
            ok: true,
            productoDB
        });

    });

}

//
// ─── BORRAR UN PRODUCTO ─────────────────────────────────────────────────────────
//

ctrl.borrar = (req, res) => {

    //disponible: false
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { $set: { disponible: false } }, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if(err) {
            
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if(!productoDB) {
            
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        }

        res.json({
            ok: true,
            productoDB,
            message: 'Producto borrado correctamente'
        });

    });

}

module.exports = ctrl;