// Modelo Tareas
import mongoose from "mongoose";

const tareasSchema = mongoose.Schema( {
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
    estado: {
        type: Boolean,
        default: false,
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now()
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now()
    },
    responsable: {
        type: String,
        trim: true,
        required: true
    },
    // responsable: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Usuario',
    // },
    prioridad: {
        type: String,
        required: true,
        enum: ["Baja", "Media", "Alta"],    //permitir unicamente valores que esten en el arreglo.
        ref: 'Usuario',
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    completado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    }
}, {
    timestamps: true,   //columnas update de las tareas
});

const Tarea = mongoose.model('Tarea', tareasSchema);
export default Tarea;