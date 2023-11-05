import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

// Obtener todos los proyectos del usuario autenticado
const obtenerProyectos = async (req, res) => {
  // Proyecto es el modelo y .find traera todos los proyectos almacenados en la base de datos
  const proyectos = await Proyecto.find()
    .where("creador")
    .equals(req.usuario)
    .select("-tareas");
  // Equals es una funcion perteneciente a mongoose para consultas mas avanzadas
  // Operaciones de autenticacion se hacen con ese req.usuario,
  res.json(proyectos);
};
// Crear nuevos proyectos
const nuevoProyecto = async (req, res) => {
  // console.log(req.body);
  // console.log(req.usuario);
  // Instanciar proyecto con la informacion obtenida
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  // Try catch para almacenarlo y catch si hay error
  try {
    // Guardar proyecto con .save();
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};
// Esta va a listar un proyecto y las tareas asociadas a el proyecto almacenado
const obtenerProyecto = async (req, res) => {
  // Para acceder al routing dinamico se usa esto, aqui leemos el id del proyecto
  const { id } = req.params;
  // console.log(id);
  const proyecto = await Proyecto.findById(id).populate("tareas");
  // console.log(proyecto);
  // Verificacion de que el proyecto existe
  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Con este if reestringimos cuando no pertenece ese id de proyecto con su creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion lo valida!");
    return res.status(401).json({ msg: error.message });
  }
  // console.log(proyecto.creador.toString() === req.usuario._id.toString());
  // console.log(typeof proyecto.creador);
  // console.log(typeof req.usuario._id);

  // Esto me traera el proyecto y las tareas pertenecientes al proyecto

  // const tareas = await Tarea.find().where('proyecto').equals(id)
  res.json(proyecto);
};

// Eliminar un proyecto
const editarProyecto = async (req, res) => {
  // Para acceder al routing dinamico se usa esto, aqui leemos el id del proyecto
  const { id } = req.params;
  // console.log(id);
  const proyecto = await Proyecto.findById(id);
  console.log(proyecto);
  // Verificacion de que el proyecto existe
  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Con este if reestringimos cuando no pertenece ese id de proyecto con su creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion lo valida!");
    return res.status(401).json({ msg: error.message });
  }
  // Actualizamos campos que se cambian unicamente las demas se mantienen si no se cambiaron
  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;
  try {
    //
    const proyectoAlmacenado = await proyecto.save();
    // retorna proyecto almacenado en la base de datos no la que esta en memoria ni state
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  // Para acceder al routing dinamico se usa esto, aqui leemos el id del proyecto
  const { id } = req.params;
  // console.log(id);
  const proyecto = await Proyecto.findById(id);
  console.log(proyecto);
  // Verificacion de que el proyecto existe
  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Con este if reestringimos cuando no pertenece ese id de proyecto con su creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion lo valida!");
    return res.status(401).json({ msg: error.message });
  }
  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto Eliminado!" });
  } catch (error) {
    console.log(error);
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};

//
const obtenerTareas = async (req, res) => {
  // const { id } = req.params;
  // Comprobar que existe el proyecto con una consulta
  // const existeProyecto = await Proyecto.findById(id);
  // if (!existeProyecto) {
  //     const error = new Error('No encontrado');
  //     return res.status(404).json({ msg: error.message });
  // }
  // Tienes que ser el creador del proyecto o colaborardor
  // res.json(tareas);
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  // obtenerTareas
};
