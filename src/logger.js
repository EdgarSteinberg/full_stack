import winston from "winston";
import __dirname from "./utils/constants.js";
 

// Niveles de errores del más severo [fatal] al menos importante [debug]
const CustomErrLevels = {
    levels: { debug: 5, http: 4, info: 3, warning: 2, error: 1, fatal: 0 },
    colors: { debug: 'blue', http: 'magenta', info: 'green', warning: 'yellow', error: 'red', fatal: 'red' }
};

// Crea el logger con los niveles personalizados
const devLogger = winston.createLogger({
    levels: CustomErrLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: CustomErrLevels.colors }), // Aplicar colores a los niveles
        winston.format.simple()
    ),
    transports: [
        // Consola: Muestra todos los logs desde nivel 'debug'
        new winston.transports.Console({
            level: 'info', // Cambia el nivel según lo que quieras registrar
            format: winston.format.combine(
                winston.format.colorize(),  // Solo colores en consola
                winston.format.simple()
            )
        }),
        // Archivo: Guarda solo los logs de tipo 'error' o más graves (sin colores)
        new winston.transports.File({
            level: 'error', // Guardar desde nivel 'error'
            filename: `${__dirname}/../logs/errors.log`,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()  // Formato sin colores en el archivo
            )
        }),
        // Guardar todos los logs (incluyendo warning y error) en un archivo (sin colores)
        new winston.transports.File({
            level: 'warning',  // Guardar desde 'warn' hacia arriba
            filename: `${__dirname}/../logs/security.log`, // Archivo específico de seguridad
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()  // Formato limpio para el archivo
            )
        }),
    ]
});

// Middleware que inyecta el logger en las solicitudes HTTP
const addLogger = (req, res, next) => {
    req.logger = devLogger; // Asignamos el logger a la solicitud
    req.logger.debug(`${new Date().toDateString()} ${req.method} en ${req.url}`); // Ejemplo de log de solicitud
    next(); // Llamamos al siguiente middleware
};

export default addLogger;
