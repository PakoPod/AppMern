import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();

import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
} from "../controllers/tareaController.js";

router.post('/', checkAuth, agregarTarea);

router
    .route("/:id")
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, actualizarTarea)
    .delete(checkAuth, eliminarTarea);
// cambiarEstado se debe comprobar que el usuario sea colaborador del proyecto
router.post("/estado/:id", checkAuth, cambiarEstado)

export default router;