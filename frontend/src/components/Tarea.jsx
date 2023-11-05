import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../../hooks/useProyectos";

const Tarea = ({ tarea }) => {

  const { handleModalEditarTarea } = useProyectos()

  const { nombre, descripcion, fechaInicio, fechaEntrega, responsable, prioridad, _id, estado } = tarea;

  return (
    // <div>Tarea</div>
    <div className="border-b p-5 flex justify-between items-center indent-5 ">
      <div>
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-1 text-sm text-violet-600 overline">Fecha inicio: {formatearFecha(fechaInicio)}</p>
        <p className="mb-1 text-sm text-violet-600">Fecha entrega: {formatearFecha(fechaEntrega)}</p>
        <p className="mb-1 text-sm text-gray-700">Responsable: {responsable}</p>
        <p className="mb-1 text-sky-400 uppercase">Prioridad: {prioridad}</p>
      </div>

      <div className="flex gap-2">
        <button
        //   className="bg-indigo-600 px-4 py-3 text-white uppercase 
        //     font-bold text-sm rounded-md"
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                // tarea dentro del state
                onClick={() => handleModalEditarTarea(tarea)}
        >
          Editar
        </button>

        {estado ? (
          <button
            className="bg-sky-600 px-4 py-3 text-white uppercase 
                    font-bold text-sm rounded-md"
          >
            Completa
          </button>
        ) : (
          <button
            className="bg-gray-600 px-4 py-3 text-white uppercase 
                font-bold text-sm rounded-md"
          >
            Incompleta
          </button>
        )}

        <button
          className="bg-red-600 px-4 py-3 text-white uppercase 
                font-bold text-sm rounded-md"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Tarea;
