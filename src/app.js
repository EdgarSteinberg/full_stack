import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'os';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import __dirname from './utils/constants.js';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import ticketRouter from './routes/ticketRouter.js';
import notFoundRouter from './routes/notFound.js'

import initializatePassport from './config/passport.js';

if (cluster.isPrimary) {
    const numeroDeProcesadores = cpus().length;
    console.log(`Proceso principal ${process.pid} generando ${numeroDeProcesadores} procesos trabajadores`);
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork();
    }
    // Si un worker falla, se reemplaza automáticamente
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} ha finalizado, creando uno nuevo...`);
        cluster.fork();
    });

} else {
    dotenv.config();


    //Express
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(`${__dirname}/../../frontend`)); // Sirve archivos HTML
    app.use(express.static(`${__dirname}/../../public`));  // Sirve otros archivos estáticos (CSS, JS, imágenes, etc.
    app.use(cookieParser());

    app.use(cors({
        origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true // Permitir cookies si es necesario
    }));

    //MongoDB connect
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri);

    initializatePassport();
    app.use(passport.initialize());

    //Rutas
    app.use("/api/products", productRouter);
    app.use("/api/carts", cartRouter);
    app.use("/api/users", userRouter);
    app.use("/api/tickets", ticketRouter);
    app.use("/api/notFound", notFoundRouter);

    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} escuchando en http://localhost:${PORT}`);
    });
}

