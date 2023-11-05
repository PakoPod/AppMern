// Modelo proyecto
import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    // No se usan corchetes porque sera solo un creador por proyecto
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tarea",
        },
    ],
    // entre corchetes significa que existira mas de 1 colaborador
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        },
    ],
}, {
    timestamps: true,   //columnas update de las tareas
});

const Proyecto = mongoose.model('Proyecto', proyectosSchema);

export default Proyecto;