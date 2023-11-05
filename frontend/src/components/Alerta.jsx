// rafce
// Alerta que toma un objeto que va a tener un mensaje, y que tipo de alerta es
const Alerta = ({ alerta }) => {
    return (
        // ${alerta.error ? ``from-red-400 to-red-600` : 'from-sky-400'}   `
        <div className={` ${alerta.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'} bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
            {alerta.msg}
        </div>
    )
}
export default Alerta

