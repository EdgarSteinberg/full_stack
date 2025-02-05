// Importa Passport para la autenticación
import passport from 'passport';
// Importa el paquete 'passport-jwt' que proporciona una estrategia de autenticación JWT para Passport
import jwt, { ExtractJwt } from 'passport-jwt';

// Se extrae la estrategia de JWT desde el objeto 'jwt'
const JWTStrategy = jwt.Strategy;

// Función que inicializa y configura Passport con la estrategia de JWT
const initializatePassport = () => {
    passport.use(
        'jwt',  // Se usa el nombre de la estrategia 'jwt'
        new JWTStrategy(
            {
                // Define cómo obtener el token JWT de la solicitud. En este caso, se extrae desde las cookies usando 'cookieExtractor'.
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

                // Clave secreta utilizada para verificar la firma del JWT. Debe coincidir con la que se usa para firmar los tokens en tu aplicación.
                secretOrKey: 'coderSecret'
            },
            async (jwt_payload, done) => {  // Función de verificación llamada con el 'jwt_payload' decodificado
                try{
                    // Si el JWT es válido, devuelve el 'jwt_payload' (el objeto que contiene los datos del usuario) y lo asocia con 'req.user'
                    return done(null, jwt_payload);
                }catch(error){
                    // Si ocurre un error, pasa el error a la siguiente función de manejo de errores
                    return done(error);
                }
            }
        )
    );
}

// Función que extrae el token JWT de las cookies de la solicitud HTTP
const cookieExtractor = (req) => {
    let token = null;
    // Muestra las cookies en la consola para fines de depuración
    console.log(req.cookies);

    // Si la solicitud tiene cookies, intenta obtener el valor del token desde 'coderCookieToken'
    if(req && req.cookies) {
        token = req.cookies.coderCookieToken ?? null;  // Si existe, asigna el valor del token, si no, asigna null
    }

    // Retorna el token encontrado (o null si no existe)
    return token;
}

export default initializatePassport;


// objeto req.user se genera gracias a la utenticacion de jwt
//const user = req.user;  // El usuario autenticado está disponible en req.user

// Verifica si el usuario tiene el rol adecuado
//if (user && (user.role === "admin" || user.role === "premium")) {
// Lógica para crear un producto
//  res.status(200).send({ status: "success", message: "Producto creado exitosamente." });
//  } else {
//      res.status(403).send({ status: "error", message: "No tienes permisos para crear un producto." });
//  }