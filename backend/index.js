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

// Configurar CORS
// Dominios permitidos
// Se cambia a una variable de entorno
// const whitelist = ['http://127.0.0.1:5173'];
// Regla en la que se asignan las variables de entorno en NodeJS usando process.env

// const whitelist = ['http://localhost:5173'];
const whitelist = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];

// const whitelist = [process.env.FRONTEND_URL || 'http://localhost:5173'];

// const corsOptions = {
//     // OBJETO ORIGIN: origin es basicamente el origen del request, callback nos permite el acceso sino hay acceso se bloquea
//     origin: function (origin, callback) {
//         // El console imprime el origen o ruta de donde se manda
//         // console.log(origin);
//         // si el whithelist incluye al origen ejecuta el codigo para consulatr la API
//         // if (whitelist.includes(origin)) {
//         if (!origin || whitelist.includes(origin)) {
//             //Puede consultar la API / null porque no hay mensaje de error y con true se le da acceso.
//             callback(null, true);
//         } else {
//             // No esta permitido
//             callback(new Error('Error de Cors'));
//         }
//     }
// };
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

// app.listen(4000, () => {
// console.log("Servidor corriendo en el puerto 4000");
// });

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// MERN = MongoDB Express React Node
// Un Stack es un conjunto de Herramientas para crear una app
// Full Stack quiere decir que puedes crear el Stack Completo de un App y MERN Stack te permite hacerlo
// React en el Front End y Node en el backend son una combinacion comun
//cosas que se instalan desde terminal npm i express : npm i mongoose es dependencia de produccion
// npm i -D nodemoon dependencias de desarrollo y produccion
// para correr desde terminal es: npm run dev / npm start

// socket-io
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
})

io.on("connection", (socket) => {
    console.log("Conectado desde socket.io");
    // Definir los eventos de socket.io
    // on => que hacer cuando el evento declarado ocurra
    // socket.on('prueba', (proyectos) => {
    //     console.log("Prueba desde socket-io", proyectos );
    //     // enviar ahora del back al frontend
    //     socket.emit("respuesta", { nombre: "Pako"})

    socket.on("abrir proyecto", (proyecto) => {
        // console.log("Desde el proyecto ", proyecto);
        socket.join(proyecto);
        // socket.to("64f7d4b22350cdbaf7f708fb").emit("respuesta", { nombre: "Pako"});
        // socket.emit("respuesta", { nombre: "Pako"});
    });

    // tarea que vamos a obtener de socket-io
    socket.on('nueva tarea', (tarea) => {
        // console.log(tarea);
        // extraer el proyecto de la tarea
        // const proyecto  = tarea.proyecto;
        // nuevo emit viene del provider lo leo y lo emito para consumirlo en el frontend
        socket.to(tarea.proyecto).emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('actualizar tarea', (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea)
    });
    socket.on('cambiar estado', (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    })
})