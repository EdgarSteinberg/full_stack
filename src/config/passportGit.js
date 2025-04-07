import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../dao/models/userModels.js';
import CartManager from '../controllers/cartManager.js';
import UserManager from '../controllers/userManager.js';

const userManager = new UserManager();
const cartManager = new CartManager();
dotenv.config();

const initializePassportGitHub = () => {
    const CLIENT_ID = process.env.CLIENT_ID;
    const SECRET_ID = process.env.SECRET_ID;
    const SECRET_KEY = process.env.SECRET_KEY;

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: 'https://full-stack-smf0.onrender.com/api/github/githubcallback',
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Perfil recibido de GitHub:", profile);

                const email = profile._json.email || `${profile._json.login}@github.com`;
                // console.log("Correo asignado:", email);

                let user = await userModel.findOne({ email: email });

                if (!user) {
                    console.log("Usuario no encontrado, creando nuevo usuario...");
                    // Creamos el carrito;
                    const cart = await cartManager.createCart();

                    let newUser = {
                        first_name: profile._json.login,
                        last_name: profile._json.name || '',
                        age: 0,
                        email: email,
                        password: 'defaultPassword',
                        cart: cart._id, // Guarda solo el ObjectId
                        role: "user"
                    };


                    let result = await userModel.create(newUser);
                    console.log("Usuario creado en la base de datos:", result);

                    //Funcion actualiza coneccion
                    await userManager.updatedLastConection({ _id: result._id }, new Date());

                    const token = jwt.sign(
                        { _id: result._id.toString(), email: result.email, username: result.first_name, role: result.role },
                        SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    // console.log("Token generado para nuevo usuario:", token);

                    done(null, { user: result, token });


                } else {
                    //  console.log("Usuario encontrado en la base de datos:", user);

                    await userManager.updatedLastConection({ _id: user._id }, new Date());

                    const token = jwt.sign(
                        { _id: user._id, email: user.email, role: user.role }, // ojo cambiaste _id por id
                        SECRET_KEY,
                        { expiresIn: '1h' }
                    );
                    //  console.log("Token generado para usuario existente:", token);

                    done(null, { user, token });
                }
            } catch (error) {
                console.error("Error en la autenticación con GitHub:", error);
                return done(error);
            }
        }));

    passport.serializeUser((user, done) => {
        console.log("Serializando usuario:", user);
        done(null, user._id ? user._id : user.user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            if (!id) throw new Error("ID de usuario no válido en deserialización.");
            console.log("Deserializando usuario con ID:", id);
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error en deserialización de usuario:", error);
            done(error, null);
        }
    });

};




export default initializePassportGitHub;
