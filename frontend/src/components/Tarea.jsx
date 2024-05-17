import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../../hooks/useProyectos";
import useAdmin from "../../hooks/useAdmin";

const Tarea = ({ tarea }) => {
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } =
    useProyectos();

  const {
    nombre,
    descripcion,
    fechaInicio,
    fechaEntrega,
    responsable,
    prioridad,
    estado,
    _id,
  } = tarea;

  // importar hook
  const admin = useAdmin();

  return (
    // <div>Tarea</div>
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-1 text-sm text-violet-600 ">Fecha inicio: {formatearFecha(fechaInicio)}</p>
        <p className="mb-1 text-sm text-violet-600">Fecha entrega: {formatearFecha(fechaEntrega)}</p>
        <p className="mb-1 text-sm text-gray-700">Responsable: {responsable}</p>
        <p className="mb-1 text-sky-400 uppercase">Prioridad: {prioridad}</p>
        { estado && <p className="bg-green-600 text-xs uppercase p-1 rounded-lg text-white ">Completada por: {tarea.completado.nombre}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (
          <button
            // className="bg-indigo-600 px-4 py-3 text-white uppercase
            // font-bold text-sm rounded-md"
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            // tarea dentro del state
            onClick={() => handleModalEditarTarea(tarea)}
          >
            Editar
          </button>
        )}

        <button
          className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} text-sm rounded-md px-4 py-3 text-white uppercase font-bold " ` }
          onClick={() => completarTarea(_id)}
        >
          {estado ? "Completa" : "Incompleta"}
        </button>

        {admin && (
          <button
            className="bg-red-600 px-4 py-3 text-white uppercase 
                font-bold text-sm rounded-md"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
