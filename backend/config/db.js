// dependencia que no necesita extension
import mongoose from "mongoose";

// Funcion para conectar base de datos
const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI2,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB Conectado en: ${url}`);
        
    } catch (error) {
    // $ {} sirve para concatenar
        console.log("error: ${error.message}");
        process.exit(1);
        // forzar que el proceso termine de forma sincrona
    }
};

export default conectarDB;