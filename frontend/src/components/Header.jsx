import { Link } from "react-router-dom";

const Header = () => {
  return (
    //  border-b
    <header className="px-4 py-5 bg-neutral-900">
      <div className="md:flex md:justify-between">
        <h2 className="font-extrabold text-transparent text-4x1 bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Administra Tus {""} Proyectos
        </h2>

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

          <button type="button" className="text-white text-sm bg-sky-600 rounded-md uppercase font-bold px-5 py-3 w-full md:w-auto  text-center mt-5 flex gap-2 items-center justify-center mb-3  
      outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
      hover:cursor-pointer hover:bg-sky-800">Cerrar Sesión</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
