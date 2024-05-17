// Archivo para soportar post gets delete etc.
import express from "express";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();    //Definición points routers

import {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} from '../controllers/usuarioController.js';

// Autenticacion, Registro y confirmacion de usuarios
router.post('/registrar', registrar); //crea un nuevo usuario
router.post('/login', autenticar);
//:token es un routing dinamico
router.get('/confirmar/:token', confirmar);
//tipo post porque le usuario manda su email
router.post('/olvide-password', olvidePassword);
//otro router dinamico para olvide password 
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
// End point para pasarle el JSON WEb token y va a retornar el perfil del usuario
// CheckAuth es para comprobar el json web token que no este expirado etc
// Tambien checa que sea valido, exista y sea enviado 
router.get('/perfil', checkAuth, perfil);

//routing dinamico con express
// endpoint
router.get("/", (req, res) => { //get es visitar una url
    res.send("DESDE API/USUARIOS");
});

// Así se separan las funciones en los controladores
// router.get("/", usuarios);
// router.post("/", crearUsuario);
export default router;