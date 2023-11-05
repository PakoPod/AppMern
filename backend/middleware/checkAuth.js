import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
    // Next se usa para ir al siguiente middleware definido
    // Tambien es ideal patra proteger las rutas de la api
    // console.log("Desde checkauth.js");
    // En los headers se mandan los JWT Json web token con postman se manda como Bearer token
    // console.log(req.headers.authorization);
    let token;
    // Bearer es solo para verificar que se manda de este tipo
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log(token);
            // esta función se encarga si es que ya caduco o expiro el token
            // Decoded es para decrifrarlo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v");
            // console.log(req.usuario);
        } catch (error) {
            return res.status(404).json({ msg: 'Hubo un error: ' });
        }
    }

    if (!token) {
        const error = new Error('Invalid token')
        return res.status(500).json({ msg: error.message });
    }
    next()
};

export default checkAuth;