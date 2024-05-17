import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import io from 'socket.io-client'
// variable global para tener acceso a la conexion y a los metodos
let socket;
const ProyectosContext = createContext();
// children se utiliza para usar los componentes como hijos
const ProyectosProvider = ({ children }) => {
  // HOOK arreglo
  const [proyectos, setProyectos] = useState([]);
  // objetos
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  // eliminar flash de ver proyecto anterior
  const [cargando, setCargando] = useState(false);
  const [ modalFormularioTarea, setModalFormularioTarea] = useState(false);
  // Editar tareas creamos un nuevo state
  const [ tarea, setTarea] = useState ({})
  const [ modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [ colaborador, setColaborador] = useState({})
  const [ modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
  const [ buscador, setBuscador ] = useState(false)
  
  const { auth } = useAuth()

  const navigate = useNavigate();

  // Funcion obtener proyectos
  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await clienteAxios.get("/proyectos", config);
        // console.log(data);
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProyectos();
  }, [auth]);

  // abrir conexion socket-io
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);  //abrir conexion
  }, [])

  // funcion a compartir
  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 4000);
  };
  
  // async porque interactua con la API
  const submitProyecto = async (proyecto) => {
    // console.log(proyecto);
    // no es _id porque se tsetea en el state
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };

  const editarProyecto = async (proyecto) => {
    // console.log('editando...');
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`,
        proyecto,
        config
      );
      // console.log(data);
      // TODO Sincronizar el state
      // iterar sobre el state de proyectos
      //  proyectoState es el que esta en memoria
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );
      // console.log(proyectosActualizados);
      // con esta linea se sincroniza el state
      setProyectos(proyectosActualizados);

      // Mostrar alerta
      setAlerta({
        msg: "Proyecto Actualizado Correctamente",
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 2500);
    } catch (error) {
      console.log(error);
    }

    // Redireccionar
  };

  const nuevoProyecto = async (proyecto) => {
    // console.log('creando..');
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      // obteniendo proyecto que se manda a la base de datos.
      // console.log(data);
      // evitar consultar la api y base de datos
      //  ... copia proyectos actuales y el data el nuevo proyecto creado..

      setProyectos([...proyectos, data]);
      
      setAlerta({
        msg: "Proyecto Creado Correctamente",
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 2500);
    } catch (error) {
      console.log(error);
    }
  };
  // Funcion que interactua con la base de datos por eso usamos async
  const obtenerProyecto = async (id) => {
    // esto hara que consulte la api en lo que asigna el state
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.get(`/proyectos/${id}`, config);
      // cpn esto ya estara en el state
      setProyecto(data);
      // console.log(data);
      setAlerta({})
    } catch (error) {
      // si un usuario no tiene permisos de un proyecto lo lleva a proyectos
      navigate('/proyectos')
      // console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 2500);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProyecto = async (id) => {
    // console.log('Eliminado.. ', id);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
      // console.log(data);
      // Sincronizar state, filter accede a los proyectos del state
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      // console.log(proyectosActualizados);
      setProyectos(proyectosActualizados);
      // mensaje del servidor proyectocontroler.js
      setAlerta({
        msg: data.msg,
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  // Funcion para pasar a lo largo de los componentes
  // Para cambiar el state

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    // al crear nueva tarea reiniciar ese objeto para que no salga nada
    setTarea({})
  };
  // async para que interactue con la base de datos
  const submitTarea = async (tarea) => {

    if (tarea ?.id) {
      editarTarea(tarea)
    } else {
      await crearTarea(tarea)
    }
    // console.log(tarea);
    // return
  };

  const crearTarea = async tarea => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await clienteAxios.post(`/tareas`, tarea, config);
      // imprime tarea creada
      // console.log(data);

      // const proyectoActualizado = {...proyecto}
      // proyectoActualizado.tareas = [...proyecto.tareas, data]
      // setProyecto(proyectoActualizado)

      setAlerta({})
      setModalFormularioTarea(false)
      // SOCKET-IO
      socket.emit('nueva tarea', data)
    } catch (error) {
      console.log(error);
    }
  }

  const editarTarea = async tarea => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      // Regresar registro de la base de datos actualizado 
      const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
      console.log(data);
      // TODO: Actualizar el DOM
      // tomar una copia del proyecto que esta en el state
      // const proyectoActualizado = {...proyecto}
      // // iterar y escribir sobre las tareas 
      // // tareaState = tarea temporal del state
      // // si tareastate es igual a data que es la respuesta de la api
      // //  o el registro actualizado de la base de datos
      // // si es asi reescribe el tarea state con data en caso contrario retorna con tareaState
      // proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState =>
      // tareaState._id === data._id ? data : tareaState )
      // setProyecto(proyectoActualizado)
      // Limpiar en caso de alertas
      setAlerta({})
      // Ocultar formulario
      setModalFormularioTarea(false)

      // SOCKET
      socket.emit('actualizar tarea', data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleModalEditarTarea = tarea => {
    // Setear tarea al state
    setTarea(tarea)
    // mostrar ventana modal que vive dentro de Projecto.jsx
    setModalFormularioTarea(true)
    // console.log(tarea);
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    // setModalEliminarTarea(true)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminartarea = async () => {
    // console.log(tarea);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      // Regresar registro de la base de datos actualizado 
      // en este caso esta tarea viene de la base de datos se pone _id
      const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
      setAlerta({ 
        msg:data.msg,
        error: false
      })
      // const proyectoActualizado = {...proyecto}
      // // parte q actualiza el state
      // proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
      // setProyecto(proyectoActualizado)

      setModalEliminarTarea(false)
      // llenamos un obbjeto de tarea resetearlo y dejarlo vacio
      
      // SOCKET 
      socket.emit('eliminar tarea', tarea)

      setTarea({})
        setTimeout(() => {
          setAlerta({})
        }, 3000);
    } catch (error) {
      console.log(error);
    }
  }

  const submitColaborador = async email => {
    // console.log(email);
    setCargando(true)
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
      const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
      // console.log(data);
      setColaborador(data)
      setAlerta({})

    } catch (error) {
      console.log(error.response);
      setAlerta({ 
        msg: error.response.data.msg,
        error: true
      })
    } finally {
      setCargando(false)
    }
  }

  const agregarColaborador = async email => {
    // proyecto viva la variable de proyecto cuando carga el componente  
    // console.log(proyecto);    
    // return 
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`,
      email, config)
      // console.log(data);
      setAlerta({ 
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setTimeout(() => {
        setAlerta({})
        // navigate("/proyectos");
      }, 2700);
      
    } catch (error) {
      // console.log(error.response);
      setAlerta({ 
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador)

    setColaborador(colaborador);
  }

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
      const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,
      {id: colaborador._id}, config)

      const proyectoActualizado = {...proyecto}
      // copia para actualizar el state
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id )

      setProyecto(proyectoActualizado)

      setAlerta({ 
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setModalEliminarColaborador(false)
      setTimeout(() => {
        setAlerta({})
      }, 2700);

    } catch (error) {
      // console.log(error.response);
      setAlerta({ 
        msg: error.response.data.msg,
        error: true
      })
    }
}

  const completarTarea = async id => {
    // console.log(id)
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
      // peticion de tareaRoutes -> router.post("/estado/:id", checkAuth, cambiarEstado)
      const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

      // console.log(data);
      // const proyectoActualizado = {...proyecto}
      // // comparar tarea que esta en el state con la tarea actualizada
      // proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)

      // setProyecto(proyectoActualizado)
      setTarea({})
      setAlerta({})

      // SOCKET
      socket.emit('cambiar estado', data)
    } catch (error) {
      console.log(error.response);
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }

  const submitTareasProyecto = (tarea) => {
    // Agregar la tarea el state
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
    setProyecto(proyectoActualizado)
  }

  const eliminarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto}
    // parte q actualiza el state
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
    setProyecto(proyectoActualizado)
  }
  const actualizarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto}
    // iterar y escribir sobre las tareas 
    // tareaState = tarea temporal del state
    // si tareastate es igual a data que es la respuesta de la api
    //  o el registro actualizado de la base de datos
    // si es asi reescribe el tarea state con data en caso contrario retorna con tareaState
    proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState =>
    tareaState._id === tarea._id ? tarea : tareaState )
    setProyecto(proyectoActualizado)
  }
  const cambiarEstadoTarea = tarea => {
    const proyectoActualizado = {...proyecto}
      // comparar tarea que esta en el state con la tarea actualizada
      proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
        tareaState._id === tarea._id ? tarea : tareaState)
      setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = ( ) => {
    setProyectos({})
    setProyecto([])
    setAlerta({})
  }
  
  return (
    <ProyectosContext.Provider
      // aqui retornamos un objeto
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminartarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        cerrarSesionProyectos,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};
export { ProyectosProvider };

export default ProyectosContext;