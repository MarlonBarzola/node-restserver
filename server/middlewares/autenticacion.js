const jwt = require('jsonwebtoken');

//
// ─── VERIFICAR TOKEN ────────────────────────────────────────────────────────────
//

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err) {

            return res.status(401).json({ //no autorizado
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });

        }

        req.usuario = decoded.usuario
        next();

    });

};

//
// ─── VERIFICA ADMIN ROLE ────────────────────────────────────────────────────────
//

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE' ) {

        next();

    } else {

        return res.status(401).json({

            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }

        });

    }

}

//
// ─── VERIFICA TOKEN PARA IMAGEN ─────────────────────────────────────────────────
//

let verificaTokenImg = (req, res, next) => {

    let token = req.query.auth;

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err) {

            return res.status(401).json({ //no autorizado
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });

        }

        req.usuario = decoded.usuario
        next();

    });

}

module.exports = {

    verificaToken,
    verificaAdminRole,
    verificaTokenImg

}