import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'os';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import __dirname from './utils/constants.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


import addLogger from './logger.js';
import productRouter from './routes/productRouter.js';
import categoriesRouter from './routes/categoriesRouter.js'
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import ticketRouter from './routes/ticketRouter.js';
import messageRouter from './routes/messageRouter.js'
import gitHubRouter from './routes/gitHubRouter.js'
import notFoundRouter from './routes/notFound.js'

import initializatePassport from './config/passport.js';
import initializePassportGitHub from './config/passportGit.js';

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

    // Inicializa Express dentro del worker
    
    const app = express();

    // Configuración de CORS
    const corsOptions = {
        origin: 'http://localhost:5173', // Asegúrate de que este sea el dominio de tu frontend
        credentials: true,  // Permite el envío de cookies (como el token JWT)
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']  // Permite encabezados específicos
    };

    app.use(cors(corsOptions));


    //Express
    app.use(addLogger)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //app.use(express.static(`${__dirname}/../../frontend`)); // Sirve archivos HTML
    app.use(express.static(`${__dirname}/../../public`));  // Sirve otros archivos estáticos (CSS, JS, imágenes, etc.
    app.use('/products', express.static(`${__dirname}/../../public/products`));

    app.use(cookieParser());


    //MongoDB connect
    //const uri = process.env.MONGO_URI;
    
    const MONGO_URI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
    mongoose.connect(MONGO_URI);

    initializatePassport();
    initializePassportGitHub();
    app.use(passport.initialize());

    // Documentación Swagger
    const swaggerOptions = {
        definition: {
            openapi: '3.0.1',
            info: {
                title: 'API tienda online celulares',
                description: 'Documentación de mi API con Swagger.'
            },
        },
        apis: [`${__dirname}/../docs/**/*.yaml`],  // Definir las rutas de la documentación Swagger
    };
    const specs = swaggerJsDoc(swaggerOptions);
    app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


    //Rutas
    app.use("/api/products", productRouter);
    app.use("/api/categories", categoriesRouter)
    app.use("/api/carts", cartRouter);
    app.use("/api/users", userRouter);
    app.use("/api/tickets", ticketRouter);
    app.use("/api/messages", messageRouter);
    app.use("/api/notFound", notFoundRouter);
    app.use("/api/github", gitHubRouter);

    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} escuchando en http://localhost:${PORT}`);
    });
}

