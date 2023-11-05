// Aqui puedo acceder a las funciones y al state y todo lo que ponga en el provider
import { useContext } from "react";
import ProyectosContext from "../src/context/ProyectosProvider";

const useProyectos = () => {
    // Retorna usecontext que permite acceder a las funciones 
    return useContext(ProyectosContext)
}

export default useProyectos