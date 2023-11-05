import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
    // console.log(req.body);
    const { proyecto } = req.body;
    // Await porque se consulta la base de datos con el modelo
    const existeProyecto = await Proyecto.findById(proyecto);

    // console.log(existeProyecto);
    // Comprobacion si existe el proyecto o no 
    if (!existeProyecto) {
        const error = new Error('El proyecto no existe!');
        return res.status(404).json({ msg: error.message });
    }
    // Segunda comprobacion para verificar que el creador de la tarea es el dueño del proyecto
    // Si existe el proyecto es diferente a usuario por ese id del autenticador del proyecto
    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para crear tareas!');
        return res.status(404).json({ msg: error.message });
    }
    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        // Almacenar el ID en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.error(error);
    }
};

const obtenerTarea = async (req, res) => {
    // Para obtener la tarea debemos obtener el id = 
    const { id } = req.params;
    console.log(id);

    // consulta tarea y proyecto juntas con populate:
    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada!');
        // Error 403 es cuando no tienes permisos
        return res.status(404).json({ msg: error.message });
    }

    // Si intento ver una tarea que no e creado sale error
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida!');
        // Error 403 es cuando no tienes permisos
        return res.status(403).json({ msg: error.message });
    }
    // const { proyecto } = tarea;
    // Consulta proyecto
    // const existeProyecto = await Proyecto.findById(proyecto);
    // console.log(tarea);
    // console.log(existeProyecto);
    res.json(tarea);
};

const actualizarTarea = async (req, res) => {
    // Para acceder al routing dinamico se usa esto, aqui leemos el id del proyecto
    const { id } = req.params;
    const tarea = await Tarea.findById(id).populate('proyecto');
    console.log(tarea);

    if (!tarea) {
        const error = new Error('Tarea no encontrada!');
        // Error 403 es cuando no tienes permisos
        return res.status(404).json({ msg: error.message });
    }
    // Con este if reestringimos cuando no pertenece ese id de tarea con su creador
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida!');
        // Error 403 es cuando no tienes permisos
        return res.status(403).json({ msg: error.message });
    }
    // Actualizamos campos que se cambian unicamente las demas se mantienen si no se cambiaron
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }

};

const eliminarTarea = async (req, res) => {
    // Para acceder al routing dinamico se usa esto, aqui leemos el id del proyecto
    const { id } = req.params;
    const tarea = await Tarea.findById(id).populate('proyecto');
    console.log(tarea);

    if (!tarea) {
        const error = new Error('Tarea no encontrada!');
        // Error 403 es cuando no tienes permisos
        return res.status(404).json({ msg: error.message });
    }
    // Con este if reestringimos cuando no pertenece ese id de tarea con su creador
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida!');
        // Error 403 es cuando no tienes permisos
        return res.status(403).json({ msg: error.message });
    }
    try {
        await tarea.deleteOne()
        res.json({ msg:'Tarea eliminada'});
    } catch (error) {
        console.log(error);

    }
};

const cambiarEstado = async (req, res) => {

};


export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
};