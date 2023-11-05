import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
// Cors se utiliza por las politicas de seguridad implementadas por los navegadores web para controlar las solicitudes de recursos realizadas
// desde un origen (dominio, esquema y puerto) a otro origen.
// Axios se utiliza para realizar solicitudes de red, especialmente solicitudes HTTP, desde el navegador o desde un servidor.
// Axios proporciona una interfaz simple y consistente para enviar y recibir datos a través de solicitudes HTTP.
// Puede realizar solicitudes GET, POST, PUT, DELETE y otras utilizando métodos convenientes proporcionados por Axios.
import axios from "axios";
// Flujo de trabajo y comunicacion de frontend con la API
// Estando en el frontend se hace una peticion, eso manda al servidor index.js en donde detecta que el origen esta permitido, despues se ejecutan las rutas depende de lo que se mande.
// Despues entra al controlador ejecuta, ingresa los datos a la base de datos, limpia, verifica, valida, agrega el token, almacena el usuario, retorna una respuesta, se regresa al frontend
// Se asigna en data y lo muestra en pantalla.
import clienteAxios from "../config/clienteAxios";

// States para traer los datos ingresados
const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    // Para prevenir la accion por default...
    e.preventDefault();
    // campos obligatorios
    if ([nombre, email, password, repetirPassword].includes("")) {
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }
    if (password !== repetirPassword) {
      setAlerta({
        msg: "Las contraseñas no son iguales",
        error: true,
      });
      return;
    }

    if (password.length < 6) {
      setAlerta({
        msg: "El password es muy corto, agrega minimo 6 caracteres",
        error: true,
      });
      return;
    }
    //SI TODO ESTA BIEN -> SET ALETA objeto vacio
    setAlerta({});

    // Crear el usuario en la API
    try {
      const { data } = await clienteAxios.post(`/usuarios/registrar`,{ nombre, email, password }
      );
      // const { data } = await axios.post('http://localhost:4000/api/usuarios',
      //   { nombre, email, password });

      console.log(data);
      setAlerta({
        msg: data.msg,
        error: false,
      });
      // Esto resetea el formulario
      setNombre("");
      setEmail("");
      setPassword("");
      setRepetirPassword("");

      // Error cuando se manda usuario ya registrado
      // Si detecta un error manda al catch error
    } catch (error) {
      console.log(error.response.data.msg)
      // console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  // Aqui se mostrara la alerta antes del titulo y el formulario
  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Registrate y Administra tus {""}{" "}
        <span className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Proyectos
        </span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        className="my-10 bg-neutral-900 shadow rounded-lg px-10 py-5"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-zinc-50 block text-xl font-bold"
            htmlFor="nombre"
          >
            NOMBRE
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            // Lo que el usuario ponga se coloca en el state de nombre
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5 ">
          <label
            className="uppercase text-zinc-50 block text-xl font-bold "
            htmlFor="email"
          >
            CORREO ELECTRONICO
          </label>

          <input
            id="email"
            type="email"
            placeholder="Correo de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            autoComplete="username"
            // Lo que el usuario ponga se coloca en el state de nombre
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-zinc-50 block text-xl font-bold"
            htmlFor="password"
          >
            CONTRASEÑA
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            autoComplete="new-password"
            // Lo que el usuario ponga se coloca en el state de nombre
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-zinc-50 block text-xl font-bold"
            htmlFor="password2"
          >
            REPETIR CONTRASEÑA
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repetir contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            autoComplete="new-password"
            // Lo que el usuario ponga se coloca en el state de nombre
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
          />

          <Link type="submit"
            value="cancelar"
            className="mb-3 mt-7 w-full py-3 text-white uppercase font-bold rounded 
            outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
            hover:cursor-pointer bg-red-600 hover:bg-red-700 text-sm text-center
            "
            to="/">Cancelar</Link>
          <input
            type="submit"
            value="crear cuenta"
            className="bg-sky-700 mb-3 mt-3 w-full py-3 text-white uppercase font-bold rounded 
            outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
            hover:cursor-pointer hover:bg-sky-800 text-sm
            "
          />
        </div>
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link className="block text-center my-1 text-slate-500 text-sm" to="/">
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
        <Link
          className="block text-center my-1 text-slate-500 text-sm"
          to="/olvide-password"
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
