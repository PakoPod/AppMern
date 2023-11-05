// UseEffect funciones que corren cuando cargan este componente
import { useState, useEffect, createContext } from 'react'
// Evitar que el usuario se edentifique todo el tiempo
import { useNavigate } from 'react-router-dom'
// LLamado API
import clienteAxios from '../config/clienteAxios'
// Aqui se crea o inicializa
const AuthContext = createContext();
// Provider va a ser el que rodee toda la aplicacion
// childen van a ser todos los componentes para que este disponible toda la info
// en los demas componentes
const AuthProvider = ({ children }) => {
  // Todo fuera del return son dunciones que se pueden definir
  // Lo que este dentro del return  dentro del value sera lo disponible
  // si no estan dentro del return no puedes acceder a ellas
  // HOOK
  const [auth, setAuth] = useState({});

  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate()

  // Probar si hay un token
  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false)
        return;
      }
      // autorizacion de configuracion bearer token
      const config = {
        headers: {
          "Context-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // Esto va a la ruta y le pasa el token lo revisa y valida
      // Si todo esta bien lo asigna a req.usuario del archivo checkAuth.js

      try {
        const { data } = await clienteAxios("/usuarios/perfil", config);
        // La respuesta se pone en setAuth
        setAuth(data);
        // navigate('/proyectos')
        // console.log(data);
      } catch (error) {
        // Expira el token lo regresa
        setAuth({})
      }
      setCargando(false);

    }
    autenticarUsuario();
  }, []);

  return (
    <AuthContext.Provider
      // aqui retornamos un objeto
      value={{
        auth,
        setAuth,
        cargando
      }}
    >
      {/* componentes de la app children */}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
// Uso de contextAPI
