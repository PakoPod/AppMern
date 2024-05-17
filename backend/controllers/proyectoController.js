import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

// Obtener todos los proyectos del usuario autenticado
const obtenerProyectos = async (req, res) => {
  // Proyecto es el modelo y .find traera todos los proyectos almacenados en la base de datos
  // Pasamos un objeto en el find esto toma un arreglo de condiciones que quiero comprobar
  const proyectos = await Proyecto.find({
    '$or' :  [
      { 'colaboradores' : { $in : req.usuario } },
      { 'creador' : { $in : req.usuario } },
    ]
  })
    // .where("creador")
    // .equals(req.usuario)
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
  const proyecto = await Proyecto.findById(id)
  .populate({ path:  'tareas', populate: { path: 'completado', select: 'nombre'}})
  .populate("colaboradores", "nombre email");

  // console.log(proyecto);
  // Verificacion de que el proyecto existe
  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Con este if reestringimos cuando no pertenece ese id de proyecto con su creador
  // Tiene que no ser el creador del proyecto y tiene q no ser un colaborador para que no pueda acceder
  // .some acepta una implementacion o una funcion dentro a diferencia de includes que es un arreglo plano
  if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some( (colaborador) => colaborador._id.toString() === req.usuario._id.toString() ) ) {
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
  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto Eliminado!" });
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador = async (req, res) => {
  // console.log(req.body);
  // extraer email
  const {email} = req.body
  // findOne es buscar por un campo en la base de datos
  const usuario = await Usuario.findOne({email})
  .select('-confirmado -password -token -__v -createdAt -updatedAt');

  // Error si el usuario no existe
  // respuesta desde el servidor
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message })    
  }
  // importante mandar la respuesta sino no funciona
  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  // console.log(req.params.id);
  const proyecto = await Proyecto.findById(req.params.id)
  //Validacion de que el proyecto exista
  if (!proyecto) {
    const error = new Error('Proyecto No Encontrado')
    return res.status(404).json({ msg: error.message })
  }
  // Validación - Error al crear un colaborador cuando no eres dueño del proyecto
  // Validacion - Quien esta agregando al proyecto 
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(404).json({ msg: error.message })
  }

  const {email} = req.body
  // findOne es buscar por un campo en la base de datos
  const usuario = await Usuario.findOne({email}).select('-confirmado -password -token -__v -createdAt -updatedAt');
  // Error si el usuario no existe
  // respuesta desde el servidor
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message })    
  }
  // El colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error ("El Creador del Proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message })    
    
  }
  // Validacion que no este agregado ya al proyecto.
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error(
      "El Usuario ya pertenece al proyecto");
    return res.status(404).json({ msg: error.message })    
   }
  //  Si pasa todas las validaciones agregamos 
  proyecto.colaboradores.push(usuario._id);
  // se pasa al final del arreglo, esto lo deja en memoria por lo que ponemos await
  await proyecto.save()
  res.json({ msg: 'Colaborador Agregado Correctamente'})
};

const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id)
  //Validacion de que el proyecto exista
  if (!proyecto) {
    const error = new Error('Proyecto No Encontrado')
    return res.status(404).json({ msg: error.message })
  }
  // Validación - Error al crear un colaborador cuando no eres dueño del proyecto
  // Validacion - Quien esta agregando al proyecto 
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(404).json({ msg: error.message })
  }
  //  Si pasa todas las validaciones se puede eliminar 
  proyecto.colaboradores.pull(req.body.id);

  await proyecto.save()
  res.json({ msg: 'Colaborador Eliminado Correctamente'})
};


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
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  // obtenerTareas
};
