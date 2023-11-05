import axios from "axios";
// Metodo create vive en axios, va a crear el cliente de axios
const clienteAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})

export default clienteAxios;