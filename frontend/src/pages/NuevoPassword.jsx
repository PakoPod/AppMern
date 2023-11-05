import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const NuevoPassword = () => {
  const [password, setPassword] = useState("");
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  // console.log(params); este nos muestra el url que tiene el token que estamos mandando
  // transformamos de params a token
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        const { data } = await clienteAxios(
          `/usuarios/olvide-password/${token}`
        );
        setTokenValido(true);
      } catch (error) {
        // console.log(error.response);
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    comprobarToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setAlerta({
        msg: "El password debe tener minimo 6 caracteres",
        error: true,
      });
      return;
    }

    try {
      const url = `/usuarios/olvide-password/${token}`;

      const { data } = await clienteAxios.post(url, { password });
      setAlerta({
        // msg: error.response.data.msg,
        msg: data.msg,
        error: false,
      });
      // Mostrar
      setPasswordModificado(true);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  // extraer el mensaje de la alerta
  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Reestablece tu contraseña y Administra tus {""}{" "}
        <span className="ffont-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Proyectos
        </span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form
          className="my-10 bg-neutral-900 shadow rounded-lg px-10 py-5"
          // HandleSubmit validar si todo esta bien mandar la  peticion a la API
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold text-white"
              htmlFor="password"
            >
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu nueva contraseña de registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-5 flex flex-col items-center">
            <input
              type="submit"
              value="cuardar nueva contraseña"
              className="bg-sky-700 mb-5 mt-7 w-full py-3 text-white uppercase font-bold rounded 
          hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />
          </div>
        </form>
      )}
      {passwordModificado && (
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

export default NuevoPassword;
