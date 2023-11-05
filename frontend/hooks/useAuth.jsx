import { useContext } from "react";
import AuthContext from "../src/context/AuthProvider";
// Aqui utilizamos const AuthContext = createContext();

const useAuth = () => {
    // Identifica que es un contexto por lo que extraemos los valores
    return useContext(AuthContext)
}

export default useAuth;