import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import useProyectos from "../../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioProyecto = () => {
  // State local
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [cliente, setCliente] = useState("");

  const params = useParams();
  // extraer mostrar alerta  y submitProyecto  
  const { mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos();

  useEffect(() => {
    if ( params.id ) {
      setId(proyecto._id)
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
      setCliente(proyecto.cliente)
    }
    console.log(fechaEntrega);
    // else {
    //   console.log('Nuevo Proyecto');
    // }
    // dependencia
  }, [params])
  
  const handleSubmit = async e => {
    e.preventDefault();
    // En caso de que esten vacios
    if ([nombre, descripcion, fechaEntrega, cliente].includes('')){
        mostrarAlerta({
            msg:'Todos los campos son obligatorios',
            error: true,
        })
        // return para que no ejecute las siguientes lineas
        return
    }
    // Pasar los datos hacia el provider como objeto
    // se usa el await si finaliza correctamente podemos resetear el formulario
    await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente});
    // Reseteamos los campos
    setId(null)
    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')
  }
//   Extraer
  const { msg } = alerta

  return (
    <form 
        className="bg-neutral-900 py-10 px-5 md:w-1/2 rounded-lg shadow"
        onSubmit={handleSubmit}
    >
        {/* Mostrar alerta */}
        {msg && <Alerta alerta= {alerta} />}

      <div className="mb-5">
        <label
          className="text-white uppercase font-bold text-sm"
          htmlFor="nombre"
        >
          Nombre del proyecto o actividad
        </label>
        <input
          id="nombre"
          type="text"
          className="border w-full p-2 mt2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del proyecto o actividad"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          className="text-white uppercase font-bold text-sm"
          htmlFor="descripcion"
        >
          Descripcion
        </label>
        <textarea
          id="descripcion"
          className="border w-full p-2 mt2 placeholder-gray-400 rounded-md"
          placeholder="Descripcion del proyecto o la actividad"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          className="text-white uppercase font-bold text-sm"
          htmlFor="fecha-entrega"
        >
          Fecha Entrega
        </label>
        <input
          id="fecha-entrega"
          type="date"
          className="border w-full p-2 mt2 placeholder-gray-400 rounded-md"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          className="text-white uppercase font-bold text-sm"
          htmlFor="cliente"
        >
          Nombre del Cliente
        </label>
        <input
          id="cliente"
          type="text"
          className="border w-full p-2 mt2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>
      <input 
        type="submit" 
        // condicional actualizar o crear --> boton cambia depende si es crear o actualiza proyecto
        value={id ? 'Actualizar Proyecto': 'Crear Proyecto'}
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  );
};

export default FormularioProyecto;
