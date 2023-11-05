import jwt from "jsonwebtoken";

// Creacion del token / sing permite firmar el token con .sing y permite verificar (verify)
const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,
        {
            expiresIn: '30d',
        });
};

export default generarJWT;