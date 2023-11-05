import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import axios from "axios";
import clienteAxios from "../config/clienteAxios";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Expresion regular correo
    if (email === "" || email.length < 6) {
      setAlerta({
        msg: "El email es obligatorio",
        error: true,k
      });
      return;
    }

    try {
      const { data } = await clienteAxios.post(
        `/usuarios/olvide-password`,
        { email }
      );
      // console.log(data);
      setAlerta({
        msg: data.msg,
        error: false,
      });
    } catch (error) {
      // console.log(error.response);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  // Extraer el mensaje
  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera tu acceso y administra tus {""}
        <span
          className="font-extrabold text-transparent text-6xl 
        bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Proyectos
        </span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        className="my-10 bg-neutral-900 shadow rounded-lg px-10 py-5"
        // Es necesario poner el handleSubmit
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            CORREO ELECTRONICO
          </label>
          <input
            id="email"
            type="email"
            placeholder="Correo de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            // conforme escribe el usuario se va seteando en el state
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="submit"
            value="enviar instrucciones"
            className="bg-sky-700 mb-3 mt-7 w-full py-3 text-white uppercase font-bold rounded 
            outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
            hover:cursor-pointer hover:bg-sky-800 text-sm"
          />
        </div>
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-2 text-slate-500 text-sm"
          to="/registrar"
        >
          ¿No tienes una cuenta? Registrate aquí
        </Link>
        <Link className="block text-center my-2 text-slate-500 text-sm" to="/">
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </nav>
    </>
  );
};

export default OlvidePassword;
