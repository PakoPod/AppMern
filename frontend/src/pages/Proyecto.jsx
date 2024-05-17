import { useEffect } from "react";
// useparams leer parametros de la url
import { useParams, Link } from "react-router-dom";
// importar el hook
import useProyectos from "../../hooks/useProyectos";
import useAdmin from "../../hooks/useAdmin";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Tarea from "../components/Tarea";
import Colaborador from "./Colaborador";
import io from 'socket.io-client'
// para que este socket se asigne conforme se vaya ejecutando el codigo
let socket;
  const Proyecto = () => {
  const params = useParams();
  // impresion de el parametro de la url
  // console.log(params);
  const {
    obtenerProyecto, proyecto, cargando, handleModalTarea,
    alerta, submitTareasProyecto, eliminarTareaProyecto,
    actualizarTareaProyecto, cambiarEstadoTarea
  } = useProyectos();
  // utilizar el custom hook nos dira booleano si es el admin o no en consola
  const admin = useAdmin();
  // console.log(admin);
  // const [modal, setModal] = useState(false);
  // cuando carga este componente obtenemos los proyectos
  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);
  //Para que se ejecute solo una vez el paquete de dependencias va vacio
  // este se ejecuta una vez para abrir el proyecto y entrar a un room 
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);  //abro conexion
    // invocar un evento
    socket.emit('abrir proyecto', params.id)  //le digo en que proyecto estoy
  }, []);
  // este se ejecuta todo el tiempo
  // useEffect(() => {
  //   socket.on('respuesta', (persona) => {
  //     // console.log(persona);
  //   })
  // })
  useEffect(() => {
    socket.on('tarea agregada', tareaNueva => {
      // Identificar cual state a actualizar
      console.log(tareaNueva);
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva);
      }
    })
    socket.on('tarea eliminada', tareaEliminada => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada)
      }
    })
    socket.on('tarea actualizada', tareaActualizada => {
      if (tareaActualizada.proyecto._id === proyecto._id) {
        actualizarTareaProyecto(tareaActualizada)
      }
    })
    socket.on('nuevo estado', nuevoEstadoTarea => {
      if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
        cambiarEstadoTarea(nuevoEstadoTarea)
      }
    })
  })
  // Aplicar distruccion
  const { nombre } = proyecto;
  // Consulta que esta obteniendo esta API
  // console.log(proyecto)
  if (cargando) return "Cargando...";
  // si hay un mensaje en alerta entonces quiero mostrarlo
  const { msg } = alerta;
  // console.log(proyecto);
  // console.log(auth);
  return (
    // Si hay una alerta ejecuta esto sino ejecuta todo lo demas:
    // msg && alerta.error ? ( <Alerta alerta={alerta} />) : (
    <>
      <div className="flex justify-between">
        <h1 className="text-white text-4xl">{nombre}</h1>

        {admin && (
          <div className="flex items-center gap-1 text-gray-400 hover:text-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6  fill-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            <Link
              to={`/proyectos/editar/${params.id}`}
              className="uppercase font-bold">
              Editar
            </Link>
          </div>
        )}
      </div>
      {admin && (
        <button
          onClick={handleModalTarea}
          type="button"
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold
          bg-sky-500 text-white text-center mt-5 flex gap-2 items-center justify-center mb-3  
            outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
            hover:cursor-pointer hover:bg-sky-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Nueva tarea
        </button>
      )}
      <button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="light"
        className="inline-block rounded "
      >
        Click me
      </button>
      <p className="font-bold text-xl text-white rounded-lg mt-10">
        Tareas del Proyecto
      </p>

      <div className="bg-white mt-2 shadow rounded-lg">
        {proyecto.tareas?.length ? (
          // 'Si hay tareas' :
          proyecto.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <p className="text-center my-5 p-10">
            No hay tareas en este proyecto
          </p>
        )}
      </div>
      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl text-white rounded-lg mt-10">
              Colaboradores
            </p>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className="text-gray-400 hover:text-gray-50 uppercase font-bold"
            >
              Añadir
            </Link>
          </div>
          <div className="bg-white mt-2 shadow rounded-lg">
            {proyecto.colaboradores?.length ? (
              // 'Si hay colaboradores' :
              proyecto.colaboradores?.map((colaborador) => (
                <Colaborador
                  key={colaborador._id}
                  colaborador={colaborador}
                />
              ))
            ) : (
              <p className="text-center my-5 p-10">
                No hay colaboradores en este proyecto
              </p>
            )}
          </div>
        </>
      )}
      <ModalFormularioTarea
      // modal={modal}
      // setModal={setModal}
      />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
};

export default Proyecto;
