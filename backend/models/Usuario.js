// MODEL Usuario
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definicion Schemma - estructura de una base de datos
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true, //esto hace obligatorio el campo
        trim: true      // No puedes almacenar otro tipo de dato que no sea String
        //trim elimina espacios en blanco al inicio y al final  -----    PAKO    ORTEGA  -----
    },
    password: {
        type: String,
        required: true, //esto hace obligatorio el campo
        trim: true      // No puedes almacenar otro tipo de dato que no sea String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,   //cuenta unica no puedes tener dos perfiles con un mismo email.
    },
    token: {    //Token 
        type: String,
    },
    confirmado: {   //enlace para confirmacion de cuenta
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,   // Esto para crear dos columnas mas una de creado y otra de actualizado.
});

// Este codigo se ejecuta antes de guardar el registro en la base de datos
usuarioSchema.pre("save", async function( next ){
    //comprobacion para revisar que el password no haya sido cambiado
    if(!this.isModified('password')){
        next(); // Te manda al siguiente middleware
    }
    // se ejecuta antes de almacenar el registro, va a hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    // comprobar un string con uno hasheado
    return await bcrypt.compare(passwordFormulario, this.password);
    // La funcion compare compara un string hasheado con uno que no
}

// MongoDB es del estilo no relacional como Mysql pero se puede hacer

const Usuario = mongoose.model("Usuario", usuarioSchema);   // Usuario con su Schema

export default Usuario; // Con esto la hacemos disponible en la aplicación.
