import { Link } from "react-router-dom";

// extraer proyecto via props
const PreviewProyecto = ({ proyecto }) => {
  const { nombre, _id, cliente } = proyecto;

  return (
    // mostrar nombre proyecto
    <div className="border-b flex p-5 ">
      <p className="flex-1">
        <span className="text-sm text-gray-500 uppercase ">
        {nombre}
        </span>
      </p>
      <Link
        to={`${_id}`}
        className="text-green-500 hover:text-gray-800 uppercase font-bold text-sm"
      >VER PROYECTO</Link>
    </div>
  );
};

export default PreviewProyecto;
