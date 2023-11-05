import { useEffect } from "react";
// useparams leer parametros de la url
import { useParams, Link } from "react-router-dom";
// importar el hook
import useProyectos from "../../hooks/useProyectos";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import Tarea from "../components/Tarea";

const Proyecto = () => {
  const params = useParams();
  // impresion de el parametro de la url
  // console.log(params);

  const { obtenerProyecto, proyecto, cargando, handleModalTarea} = useProyectos();
  // const [modal, setModal] = useState(false);
  // cuando carga este componente obtenemos los proyectos
  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  // Aplicar distruccion
  const { nombre } = proyecto;
  // console.log(proyecto);
  if (cargando) return "Cargando...";
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-white text-4xl">{nombre}</h1>
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
            className="uppercase font-bold"
          >
            Editar
          </Link>
        </div>
      </div>
      <button
        onClick={ handleModalTarea }
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
      <button
  type="button"
  data-te-ripple-init
  data-te-ripple-color="light"
  className="inline-block rounded ">
  Click me
</button>
      <p className="font-bold text-xl text-white rounded-lg mt-10">Tareas del Proyecto</p>
      <div className="bg-white mt-2 shadow rounded-lg">
        {proyecto.tareas?.length ?
        // 'Si hay tareas' : 
        proyecto.tareas?.map( tarea => (
          <Tarea
            key={tarea._id}
            tarea={tarea}
          />
        )) : 
        <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>}
      </div>
      <ModalFormularioTarea 
        // modal={modal}
        // setModal={setModal}
      />
    </>
  );
};

export default Proyecto;
