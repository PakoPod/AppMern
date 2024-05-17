import { useEffect } from "react";
import FormularioColaborador from "../components/FormularioColaborador";
import useProyectos from "../../hooks/useProyectos";
import { useParams } from "react-router-dom";
import Alerta from "../components/Alerta";

const NuevoColaborador = () => {
  // Funcion para buscar mediante el id traer la info
  const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos();

  const params = useParams();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  // console.log(colaborador);
  // if (cargando) return "Cargando...";
if (!proyecto?._id) return <Alerta alerta= {alerta} />

  return (
    // <div className="text-white">NuevoColaborador</div>
    // Fragment retornar varios elementos
    <>
      <h1 className="text-4xl text-white">
        Añadir Colaborador(a) al Proyecto: {proyecto.nombre}{" "}
      </h1>

      <div className="mt-10 flex justify-center">
        {/* renderizar el componente del formulario */}
        <FormularioColaborador />
      </div>
      {cargando ? (
        <p className="text-center"> Cargando...</p>
      ) : (
        colaborador?._id && (
          <div className="flex justify-center mt-10">
            <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
              <h2 className="text-center mb-10 text-2xl font-bold">
                Resultado:{" "}
              </h2>
              <div className="flex justify-between items-center">
                <p>{colaborador.nombre}</p>
                <button 
                type="button" 
                className="text-white font-bold uppercase bg-green-500 px-5 py-2.5 shadow-lg rounded-lg text-sm text-center me-2 mb-2 "
                onClick={() => agregarColaborador({
                  email: colaborador.email
                })}
                >Agregar al Proyecto</button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default NuevoColaborador;
