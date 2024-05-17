import { Link } from "react-router-dom";
import useProyectos from "../../hooks/useProyectos";
import Busqueda from "./Busqueda";
import useAuth from "../../hooks/useAuth";

const Header = () => {

  const { handleBuscador, cerrarSesionProyectos} = useProyectos()
  const { cerrarSesionAuth } = useAuth()

  // llamado para usar las funciones
  const handleCerrarSesion = () => {
    cerrarSesionAuth()
    cerrarSesionProyectos()
    localStorage.removeItem('token')
  }
  
  return (
    //  border-b
    <header className="px-4 py-5  bg-neutral-900">
      <div className="md:flex md:justify-between">
        {/* <h2 className="text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-5 md:mb-0"> */}
        <h2 className="text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600  mb-5 md:mb-0">
          Administra Tus {""} Proyectos
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <button 
          type="button"
          className=" text-white font-bold uppercase"
          onClick={handleBuscador}>
            Buscar Proyecto</button>
        </div>
        {/* <input
          type="search"
          placeholder="Buscar..."
          className="rounded-lg lg:w-96 block p-2 border"
        /> */}
        <div className="flex items-center gap-4">
          {/* Link para llevar a los proyectos */}
          <Link to="/proyectos" className="text-white text-sm bg-sky-600 rounded-md uppercase font-bold px-5 py-3 w-full md:w-auto  text-center mt-5 flex gap-2 items-center justify-center mb-3  
          outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
          hover:cursor-pointer hover:bg-sky-800">
            Ver Proyectos
          </Link>
          <button 
            type="button" 
            className="text-white text-sm bg-sky-600 rounded-md uppercase font-bold px-5 py-3 w-full md:w-auto  text-center mt-5 flex gap-2 items-center justify-center mb-3  
            outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
            hover:cursor-pointer hover:bg-sky-800"
          onClick={ handleCerrarSesion }
          >Cerrar Sesión</button>
          {/* Componente Busqueda */}
        <Busqueda />
        </div>
      </div>
    </header>
  );
};

export default Header;