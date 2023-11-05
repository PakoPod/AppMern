import { Link } from "react-router-dom";
// Importar useEffect y usseState para leer la URL de la parte de superior
// necesitamos ejecutar una vez el codigo para leer ese ID y mandar una pecition
import { useEffect, useState } from "react";
// UseParams es para leer los parametros de la URL
import { useParams } from "react-router-dom";
import axios from "axios";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

// Lo primero es identificar el token del usuario

const ConfirmarCuenta = () => {
  // const [alerta, setAlerta] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const params = useParams();
  // console.log(params);
  // Usando distruction extraemos el id de params
  const { id } = params;

  // Enviar al backend
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        // const url = `http://localhost:4000/api/usuarios/confirmar/${id}`;
        const url = `/usuarios/confirmar/${id}`;
        // const { data } = await axios(url);
        const { data } = await clienteAxios(url);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    confirmarCuenta();
  }, []);

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma tu cuenta y crea tus {""}{" "}
        <span className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Proyectos
        </span>
      </h1>
      {/* mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white */}
      <div className="my-10 bg-neutral-900 shadow rounded-lg px-10 py-5 text-center">
        {" "}
        {/* Add 'text-center' class */}
        {msg && <Alerta alerta={alerta} />}
      </div>
      {cuentaConfirmada && (
        <Link
          value="Iniciar Sesión"
          className="flex flex-col items-center from-sky-400 to-sky-600 bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10 inline-block"
          to="/"
        >
          Inicia Sesión
        </Link>
      )}
    </>
  );
};

export default ConfirmarCuenta;
