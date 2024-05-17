// Importar hook
import { useEffect } from "react";
import useProyectos from "../../hooks/useProyectos";
import PreviewProyecto from "../components/PreviewProyecto";

const Proyectos = () => {
  // Utilizar el hook useProyectos.jsx
  const { proyectos, alerta } = useProyectos();

  // useEffect(() => {
  //   // io toma la URL hacia donde nos conectamos en este caso hacia el backend
  //   socket = io(import.meta.env.VITE_BACKEND_URL)
  //   // emit es para emitir el evento con un string
  //     socket.emit('prueba', proyectos)
  //     socket.on('respuesta', (persona) => {
  //     console.log('Desde el frontend', persona);
  //     },)
  //   }, )

  const { msg } = alerta
  // console.log(proyectos);
  return (
    <>
      <main>
        <h1 className="text-4x1 text-white font-bold">Proyectos</h1>

        { msg && <Alerta alerta = {alerta} /> }

        <div className="bg-white shadow mt-8 rounded-lg">
          {proyectos.length ? 
            proyectos.map(proyecto => (
              <PreviewProyecto 
                    key={proyecto._id}
                    proyecto={proyecto}
              />
            ))
            : <p className="text-center text-gray-600 uppercase p-5">
              No existen proyectos
            </p>
          }
        </div>
      </main>
    </>
  );
};

export default Proyectos;
