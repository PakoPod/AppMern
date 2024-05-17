import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Sidebar = () => {
  // Consulta al perfil del usuario
  const { auth } = useAuth()
  // console.log(auth);

  return (
    // Barra lateral
    <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10 bg-black">
      <p className="text-xl font-bold text-white">Bienvenido : {auth.nombre}</p>
      
      <Link to="crear-proyecto" 
        className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-500 text-white text-center mt-5 flex gap-2 items-center justify-center mb-3  
        outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
        hover:cursor-pointer hover:bg-sky-800 ">
      Nuevo Proyecto
      </Link>
      
    </aside>
    
  )
}

export default Sidebar