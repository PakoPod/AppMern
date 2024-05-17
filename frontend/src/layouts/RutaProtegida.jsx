import { Outlet, Navigate } from "react-router-dom";
// extraer informacion con el hook
import useAuth from "../../hooks/useAuth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const RutaProtegida = () => {
  // extraer lo que hay en el value -> auth y llamar la funcion
  const { auth, cargando } = useAuth();
  if (cargando) return 'Cargando...'
  //   console.log(auth);
  return (
    <>
      {/* Comprobacion si auth._id existe el usuario esta autenticado sino mandalo a iniciar sesion */}
      {/* Outlet significa el contenido de cada uno de los componentes  */}
      {auth._id ?
      (
        <div className="bg-gray-100">
            <Header />
            <div className="md:flex md:min-h-screen">
                <Sidebar />
                {/* flex 1 toma el resto del contenido */}
                <main className="p-10 flex-1 bg-black">
                    <Outlet />
                </main>
            </div>
        </div>
      ) : <Navigate to="/" />}
    </>
  );
};
export default RutaProtegida;