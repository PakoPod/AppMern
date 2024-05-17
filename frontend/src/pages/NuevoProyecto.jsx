import FormularioProyecto from '../components/FormularioProyecto'

const NuevoProyecto = () => {
    return (
      <>
      {/* text-white */}
        <h1 className="text-4xl font-black text-white uppercase">Crear Proyecto</h1>
        <div className="mt-10 flex justify-center">
          <FormularioProyecto />
        </div>
      </>
    );
  };
  
  export default NuevoProyecto;