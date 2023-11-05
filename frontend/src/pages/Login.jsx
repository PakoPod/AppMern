import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
// importar Hook
import useAuth from '../../hooks/useAuth'
 
const login = () => {
  // States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})
  // LLamada funcion Hook
  const { setAuth } = useAuth()
 
  // Navigate hook
  const navigate = useNavigate()
 
  const handleSubmit = async (e) => {
    // Llamar a preventDefault en cualquier momento durante la ejecución,
    // cancela el evento, lo que significa que cualquier acción por defecto
    // que deba producirse como resultado de este evento, no ocurrirá.
    e.preventDefault()
 
    if ([email, password].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }
    // Si todo esta bien entra al try catch
    // Consultar la API para autenticar al usuario
    try {
      const { data } = await clienteAxios.post('/usuarios/login', { email, password })
      // console.log(data);
      setAlerta({})
      // Setear o Almacenar el token en localStorage
      localStorage.setItem('token', data.token)
      // poner informacion de data en setAuth
      setAuth(data)
      // Redireccionar
      navigate('/proyectos')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }
  // Todo el objeto se debe colocar en context para tener la informacion de forma global en la aplicacion
  // Meter ContextAPI
 
  const { msg } = alerta
 
  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Administra tus {''}{' '}
        <span className='font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          Proyectos
        </span>
      </h1>
 
      {msg && <Alerta alerta={alerta} />}
 
      <form className='my-10 bg-neutral-900 shadow rounded-lg px-10 py-5' onSubmit={handleSubmit}>
        <div className='my-5'>
          <label className='uppercase text-zinc-50 block text-xl font-bold' htmlFor='email'>
            CORREO ELECTRONICO
          </label>
          <input
            id='email'
            type='email'
            placeholder='Correo de registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            // Value para el useState
            value={email}
            // El evento onChange en React es una de las funciones
            // predeterminadas en React que nos permiten definir una acción
            // a ejecutar cuando una situación ocurre
            // Este evento se utiliza comúnmente para tratar los datos
            // introducidos por el usuario en un formulario.
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
 
        <div className='my-5'>
          <label className='uppercase text-zinc-50 block text-xl font-bold' htmlFor='password'>
            CONTRASEÑA
          </label>
          <input
            id='password'
            type='password'
            placeholder='Contraseña de registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            // Value para el useState
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type='submit'
            value='Iniciar Sesión'
            className='bg-sky-700 mb-3 mt-7 w-full py-3 text-white uppercase font-bold rounded 
            outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform
            hover:cursor-pointer hover:bg-sky-800 text-sm
            '
            // bg-gradient-to-r from-purple-600 to-indigo-600
          />
        </div>
      </form>
 
      <nav className='lg:flex lg:justify-between'>
        <Link className='block text-center my-2 text-slate-500 text-sm' to='/registrar'>
          ¿No tienes una cuenta? Registrate aquí
        </Link>
        <Link className='block text-center my-2 text-slate-500 text-sm' to='olvide-password'>
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  )
}
 
export default login