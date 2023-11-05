// Importar hook
import useProyectos from "../../hooks/useProyectos";
import PreviewProyecto from "../components/PreviewProyecto";

const Proyectos = () => {
  // Utilizar el hook useProyectos.jsx
  const { proyectos } = useProyectos();

  // console.log(proyectos);
  return (
    <>
      <main>
        <h1 className="text-4x1 text-white font-bold">Proyectos</h1>
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
