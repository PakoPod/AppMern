import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// extraer proyecto via props
const PreviewProyecto = ({ proyecto }) => {
  const { auth } = useAuth();
  const { nombre, _id, cliente, creador } = proyecto;

  return (
    // mostrar nombre proyecto
    <div className="border-b p-5 flex flex-col md:flex-row justify-between">
      <div className="flex items-center gap-2">
        <p className="flex-1">
          {nombre}
          <span className="text-sm text-blue-700 uppercase "> {cliente}</span>
        </p>
        {/* condicion */}
        {auth._id !== creador && <p className="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">Colaborador</p>}
      </div>
      <Link
      // Se utiliza una plantilla de cadena de texto para inyectar el valor de la variable _id,
      // lo que indica que el enlace dirigirá al usuario a una ruta que incluye el ID de un proyecto específico.
        to={`${_id}`}
        className="text-green-500 hover:text-gray-800 uppercase font-bold text-sm">
        VER PROYECTO
      </Link>
    </div>
  );
};

export default PreviewProyecto;