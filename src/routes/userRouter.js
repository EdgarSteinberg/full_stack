import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authorization from '../middlewares/authorization.js';
import { uploader } from '../utils/multer.js';
import UserManager from '../controllers/userManager.js';
import dotenv from 'dotenv';

const userServices = new UserManager();
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await userServices.getAllUsers();
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/reset-password", async (req, res) => {
    const { token } = req.query;
    console.log('Token recibido:', token);

    if (!token) {
        return res.status(400).send({ status: 'error', message: 'Token no proporcionado' });
    }

    try {
        res.status(200).send({ status: 'success', message: 'Token válido, muestra la página de restablecimiento de contraseña.' });
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al verificar el token.' });
    }
});


router.post('/recover-password', async (req, res) => {
    const { email } = req.body
    console.log("Email recibido:", email); // ✅ Verifica que el email llega correctamente
    if (!email) {
        return res.status(400).send({ status: 'error', message: 'Email no proporcionado' });
    }
    try {
        await userServices.sendEmailPasswordReset(email);
        res.status(200).send({ status: 'success', message: 'Correo de recuperación enviado correctamente.' });
    } catch (error) {
        console.error('Error al enviar correo de recuperación:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al enviar el correo de recuperación.' });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('Token recibido en el formulario', token, newPassword);

    if (!token || !newPassword) {
        return res.status(400).send({ status: "error", message: "Token o nueva contraseña no proporcionada" });
    }

    try {
        await userServices.resetPassword(token, newPassword);
        res.status(200).send({ status: "success", message: "Contraseñana restablecida correctamente!" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message })
    }
})

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age, role } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
        req.logger.warning('Intento de registro fallido: faltan campos', {
            ip: req.ip,
            email: email, // Si es relevante
            message: 'Faltan campos en el registro'
        });
        return res.status(500).send({ status: "error", error: "faltan campos que completar!" });
    }

    try {
        const result = await userServices.register({ first_name, last_name, email, password, age, role });
        if (result.status === "error") {
            return res.status(400).send(result); // Devolver error 400 si el email ya está registrado
        }
        //res.redirect('http://localhost:5173/login');
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error('Error en el proceso de registro', {
            ip: req.ip,
            email: email,
            error: error.message
        });
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.logger.warning('Intento de login fallido: faltan campos', {
            ip: req.ip,
            email: email || "No proporcionado",
            message: 'Faltan email o contraseña'
        });
        return res.status(400).send({ status: "error", error: "Email y contraseña son requeridos" });
    }

    try {
        const result = await userServices.loginUser(email, password);

        if (!result || !result.user) {
            req.logger.warning('Intento de login fallido: usuario no encontrado', {
                ip: req.ip,
                email: email,
                message: 'El usuario no existe o credenciales incorrectas'
            });
            return res.status(401).send({ status: "error", error: "Credenciales incorrectas" });
        }

        const user = result.user;

        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name, age: user.age },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000,  // 1 hora
            httpOnly: true,  // Evita que el token sea accesible desde el frontend
            secure: process.env.NODE_ENV === 'production',  // Solo en producción
            sameSite: 'None',
        });

        if (result.status === "error") {
            return res.status(400).send(result); // Devolver error 400 si el email ya está registrado
        }

        //return res.status(200).send({ status: "success", payload: user });
        return res.status(200).send({ status: "success", payload: user, token });
    } catch (error) {
        req.logger.error('Error en el proceso de login', {
            ip: req.ip,
            email: email,
            message: error.message
        });


        return res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('coderCookieToken', { httpOnly: true, sameSite: 'Strict' });
    res.status(200).send({ message: 'Logout exitoso' });
});


router.get('/profile/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log("Solicitud recibida en /profile/profile");

    console.log("Usuario autenticado:", req.user);
    if (!req.user) {
        return res.status(401).send({ error: "No autorizado" });
    }

    try {
        const userId = req.user.id || req.user._id;
        console.log("Buscando usuario con ID:", userId);

        const user = await userServices.getUserById(userId);

        if (!user) {
            console.log("Usuario no encontrado en la base de datos.");
            return res.status(404).send({ error: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", user);
        // res.status(200).send(user);
        res.status(200).send({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            role: user.role,
            cart: user.cart, // Si deseas incluir los datos del carrito
            documents: user.documents // Si deseas incluir los documentos
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userServices.getUserById(uid);
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put("/:uid", async (req, res) => {
    const { uid } = req.params;
    const updated = req.body
    try {
        const result = await userServices.updatedUser(uid, updated);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put("/premium/:uid", passport.authenticate('jwt', { session: false }), authorization(['admin']),
    async (req, res) => {
        try {
            const { uid } = req.params;
            const { role } = req.body;

            // Validar que el role sea uno de los dos posibles y que sea un cambio válido
            if (role !== 'user' && role !== 'premium') {
                return res.status(400).send({ error: 'El rol especificado no es válido' });
            }

            // Buscar el usuario en la base de datos
            const user = await userServices.getUserById(uid);
            if (!user) {
                throw new Error(`Usuario con ID ${uid} no encontrado!`);
            }

            // Verificar si el usuario tiene documentos cargados
            if (!user.documents || user.documents.length === 0) {
                return res.status(400).send({ error: "Faltan documentos para cambiar el rol" });
            }

            // Verificar si el cambio de rol es válido
            if (user.role === role) {
                return res.status(400).send({ error: `El usuario ya tiene el rol ${role}` });
            }

            // Actualizar el rol del usuario
            const result = await userServices.updatedUser(uid, { role });

            res.status(200).send({ status: "success", payload: result });
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }
    }
);


router.post("/:uid/documents",
    passport.authenticate('jwt', { session: false }),  // Autenticación con JWT
    uploader.array('docs', 2),  // Limitar la carga a 2 archivos
    async (req, res) => {
        const { uid } = req.params;

        // Verifica que los archivos se hayan cargado
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ status: "error", error: "No se han cargado archivos" });
        }

        // Crear el objeto 'documents' a partir de los archivos cargados
        const documents = req.files.map(file => ({
            name: file.fieldname,
            reference: file.filename
        }));

        try {
            const result = await userServices.uploaderDocsUser(uid, documents);
            res.status(200).send({ status: "success", payload: result });
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }
    }
);


router.delete('/', async (req, res) => {
    try {
        const result = await userServices.deleteInactiveUsers();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userServices.deleteUser(uid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});



export default router;