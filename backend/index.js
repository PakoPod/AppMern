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
const whitelist = [process.env.FRONTEND_URL];
// const whitelist = [process.env.FRONTEND_URL || 'http://localhost:5173'];

const corsOptions = {
    // OBJETO ORIGIN: origin es basicamente el origen del request, callback nos permite el acceso sino hay acceso se bloquea
    origin: function (origin, callback) {
        // El console imprime el origen o ruta de donde se manda
        // console.log(origin);
        // si el whithelist incluye al origen ejecuta el codigo para consulatr la API
        if (whitelist.includes(origin)) {
            //Puede consultar la API / null porque no hay mensaje de error y con true se le da acceso.
            callback(null, true);
        } else {
            // No esta permitido
            callback(new Error('Error de Cors'));
        }
    }
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
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// MERN = MongoDB Express React Node
// Un Stack es un conjunto de Herramientas para crear una app
// Full Stack quiere decir que puedes crear el Stack Completo de un App y MERN Stack te permite hacerlo
// React en el Front End y Node en el backend son una combinacion comun
//cosas que se instalan desde terminal npm i express : npm i mongoose es dependencia de produccion
// npm i -D nodemoon dependencias de desarrollo y produccion
// para correr desde terminal es: npm run dev / npm start