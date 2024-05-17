import useProyectos from "../../hooks/useProyectos"

const Colaborador = ({colaborador}) => {
    // extraer
    const { handleModalEliminarColaborador } = useProyectos()
    // distruction
    const { nombre, email } = colaborador
  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p className="text-black">{nombre}</p>
            <p className="text-gray-700 text-sm">{email}</p>
        </div>
        <div>
            <button
            type="button"
            className="bg-red-600 px-4 py-3 text-white uppercase 
            font-bold text-sm rounded-lg"
            onClick={() => handleModalEliminarColaborador(colaborador)}
            >Eliminar</button>
        </div>
    </div>
  )
}

export default Colaborador