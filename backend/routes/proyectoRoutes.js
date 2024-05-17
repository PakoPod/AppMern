import express from 'express';
// Tod o lo que esta relacionado con proyectos el usuario debe estar autenticado
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();

import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
} from '../controllers/proyectoController.js';
// router.get('/', checkAuth, obtenerProyectos);
// router.post('/', checkAuth, nuevoProyecto);
router
    .route("/")
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);
router
    .route("/:id")
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto);

// router.get("/tareas/:id", checkAuth, obtenerTareas);
// router.get("/tareas/:id", checkAuth);

router.post("/colaboradores", checkAuth, buscarColaborador);
router.post("/colaboradores/:id", checkAuth, agregarColaborador);
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador);

export default router;