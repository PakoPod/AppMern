import useProyectos from "./useProyectos"
import useAuth from "./useAuth"

const useAdmin = () => {
    const { proyecto } = useProyectos()
    const { auth } = useAuth()
    // si es un administrador, si es diferente del autor no tiene los demas permisos
    return proyecto.creador === auth._id
}

export default useAdmin