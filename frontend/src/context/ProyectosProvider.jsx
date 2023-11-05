import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

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
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  // Editar tareas creamos un nuevo state
  const [tarea, setTarea] = useState ({})

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
  }, []);

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
      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
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
      console.log(data);
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
    } catch (error) {
      console.log(error);
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
  // Funcion para pasar a lo largos de los componentes
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

      const { data } = await clienteAxios.post(`/tareas`, tarea,config);
      // imprime tarea creada
      // console.log(data);
      // Agregar la tarea el state
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas = [...proyecto.tareas, data]
      setProyecto(proyectoActualizado)
      setAlerta({})
      setModalFormularioTarea(false)
    } catch (error) {
      console.log(error);
    }
  }

  const editarTarea = async tarea => {
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
      const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
      // console.log(data);
      // TODO: Actualizar el DOM
      
      // Limpiar en caso de alertas
      setAlerta({})
      // Ocultar formulario
      setModalFormularioTarea(false)

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
        tarea
      }}
    >
      {children}
      {/* componentes de la app children */}
    </ProyectosContext.Provider>
  );
};
export { ProyectosProvider };

export default ProyectosContext;
