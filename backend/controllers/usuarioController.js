import Usuario from "../models/Usuario.js";
import generarTokenConfirmacion from "../helpers/generarTokenConfirmacion.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

//el modelo interactua con la base de datos
const registrar = async (req, res) => {
    // console.log(req);
    // console.log(req.body);
    // app.use(express.json());
    // Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email: email });
    // console.log(existeUsuario);
    if (existeUsuario) {
        // Creacion de un objeto con la informacion del modelo
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }
    
    try {
        //esto crea un objeto de tipo usuario con la informacion del modelo
        const usuario = new Usuario(req.body)
        usuario.token = generarTokenConfirmacion();
        // const usuarioAlmacenado = await usuario.save()
        await usuario.save()

        // Enviar email confirmacion
        // console.log(usuario);
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        // res.json(usuarioAlmacenado);
        // await usuario.save()
        // Se manda desde el servidor este mensaje hacia el frontend
        res.json({
            msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta"
        });
        // console.log(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error al registrar el usuario" });
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message })
    }
    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message })
    }

    // Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({ msg: error.message })
    }
};

const confirmar = async (req, res) => {
    // Leer desde la URL
    const { token } = req.params;
    // Buscar usuario con ese token ya que cualquier usuario puede poner cualquier cosa en la URL
    const usuarioConfirmar = await Usuario.findOne(({ token }));
    if (!usuarioConfirmar) { //Sino existe token no valido
        const error = new Error("Token no valido");
        return res.status(403).json({ msg: error.message })
    }
    try {
        //cambia a true el token
        usuarioConfirmar.confirmado = true; //Confirmamos el usuario
        // Eliminamos el token ya que es de un solo uso
        usuarioConfirmar.token = "";
        // Esto lo almacena en la base de datos con estos cambios
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" })
        // console.log(usuarioConfirmar);
    } catch (error) {
        console.log(error)
    }
    console.log(usuarioConfirmar);
    // console.log(req.params.token);
}

const olvidePassword = async (req, res) => {
    // extraer email
    const { email } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message })
    }
    // Si el usuario existe
    try {
        //asignar el token al usuario, llamando a la funcion generarTokenConfirmacion
        usuario.token = generarTokenConfirmacion()
        // Guardar en la base de datos
        await usuario.save();
        //Enviar el email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: "Hemos enviado un email con las instrucciones" });
        console.log(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error al enviar el email" });
    }
}

const comprobarToken = async (req, res) => {
    // Extraer token de la URL
    // params sirve para extraerlos de la URL
    // Cuando quieres extraer valores de un formulario es con un req.body
    const { token } = req.params;
    const tokenValido = await Usuario.findOne(({ token }));

    if (tokenValido) {
        res.json({ msg: "Token valido y el Usuario existe" })
    } else {
        const error = new Error("Token no valido!");
        return res.status(404).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body

    const usuario = await Usuario.findOne(({ token }));

    if (usuario) {
        usuario.password = password;
        usuario.token = '';

        try {
            await usuario.save();
            res.json({ msg: "Password Modificado Correctamente" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: "Hubo un error al guardar el nuevo password" });
        }


    } else {
        // console.log("Token No valido");
        const error = new Error("Token no valido!");
        return res.status(404).json({ msg: error.message });
    }

    console.log(token);
    console.log(password);
}
// Aqui se obtienen los datos del request del servidor
const perfil = async (req, res) => {
    // console.log('desde perfil...')
    const { usuario } = req;
    res.json(usuario);
}
// const usuarios = (req, res) => { //get es visitar una url
//     res.json( { msg: "Desde API/USUARIOS" });
// }
// const crearUsuario = (req, res) => {
//     res.json( { msg: "Creando Usuario"});
// };

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
};
// FRONTEND - NETTLIFY
// BACKEND - EROKO Y DIGITAL OCEAN