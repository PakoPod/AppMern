// se asigna a la variable express el paquete de express
// const express = require("express")
import express from "express";
// Las dependencias no necesitan .js
// Cors es un paquete que permite las conecciones desde el dominio del frontend
import cors from 'cors';    // Los archivos externos necesitan extension js
// dotenv es para variables de entorno
// import dotenv from "dotenv";
import dotenv from 'dotenv'
// import prueba from "./prueba.js";
// Importar base de datos
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import mongoose from 'mongoose';
import { Server } from 'socket.io';

// El middleware ejecutara estas lineas una a una
const app = express();
// const cors = require('cors');
// recibir 
//  esto es para habilitar la informacion que viene de tipo json ya esta dentro de express la dependencia
//  bodyparser 

app.use(express.json());

// Configuracion que busca el archivo .env
dotenv.config();

conectarDB();

// Configurar Mongoose
mongoose.set('strictQuery', true);

// Configurar CORS
// Dominios permitidos
const whitelist = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log(`Origin received: ${origin}`); // Esto te mostrará el origen exacto que se está comprobando.
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`Blocked by CORS for origin: ${origin}`); // Esto te informará si un origen está siendo bloqueado.
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Algunos navegadores legacy no soportan el código 204.
};

app.use(cors(corsOptions));

// -----Routing-----
//exprees es muy poderoso para que los usuarios sean mas faciles de mantener
// Aqui se definen los endPoints y se van agrupando en rutas las cuales van agrupando controladores y los modelos.
// use responde a todos los verbos http://

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

//app.use('/', (req, res) => {    //(ruta, (request , response))
//res.send('Hola Mundo'); //send es un metodo permite ver informacion en pantalla
//res.json({ msg: "OK"});   //respuesta tipo json que permite acceder a los datos en React
//})

// console.log(process.env.HOLA);
// Variable de entorno para el puerto
const PORT = process.env.PORT || 4000;
// console.log("desde index.js")

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// socket-io
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on("connection", (socket) => {
    console.log("Conectado desde socket.io");
    // Definir los eventos de socket.io
    socket.on("abrir proyecto", (proyecto) => {
        socket.join(proyecto);
    });

    socket.on('nueva tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea agregada', tarea);
    });

    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea);
    });

    socket.on('actualizar tarea', (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea);
    });

    socket.on('cambiar estado', (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado', tarea);
    });
});
