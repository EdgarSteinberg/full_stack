import { createHash, isValidPassword } from "../utils/cryptoUtil.js";
import UserDto from "../dao/dto/userDto.js";
import UserDAO from "../dao/userDao.js";
import CartManager from "./cartManager.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const cartManager = new CartManager();
const userDao = new UserDAO();

const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const SECRET_KEY = process.env.SECRET_KEY;

class UserManager {
    // Obtiene todos los usuarios desde la base de datos.
    async getAllUsers() {
        return await userDao.getAllUsersDao();
    }

    // Obtiene un usuario por su ID y lo formatea usando UserDto.
    async getUserById(uid) {
        const user = await userDao.getUserByIdDao(uid);
        if (!user) throw new Error("Usuario no encontrado");
        return new UserDto(user);
    }


    async getUserByEmail(email) {
        if (!email) throw new Error("Email no proporcionado");

        try {
            const user = await userDao.getUserByEmailDao(email);
            if (!user) throw new Error("Usuario no encontrado");

            return user;
        } catch (error) {
            throw new Error("Error al obtener el usuario por email");
        }
    }
    // Registra un nuevo usuario:
    // - Valida que se envíen todos los campos requeridos.
    // - Verifica que el email no esté ya registrado.
    // - Crea un carrito para el usuario.
    // - Hashea la contraseña y crea el usuario en la base de datos.
    async register(user) {
        const { first_name, last_name, email, password, age } = user;
        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error("Debes completar todos los campos");
        }

        try {
            const existingUser = await userDao.getUserByEmailDao(email);
            if (existingUser) {
                return { status: "error", message: "El email ya está registrado" }; // Devolver error en lugar de lanzar una excepción
            }

            const cart = await cartManager.createCart(); // O bien (cartManager.createCart())._id si solo necesitas el _id
            const hashedPassword = await createHash(password);
            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: hashedPassword,
                cart
            };

            return await userDao.createUserDao(newUser);
        } catch (error) {
            throw new Error(`Error al registrar usuario: ${error.message}`);
        }
    }

    // Inicia sesión del usuario:
    // - Valida que se envíen email y password.
    // - Verifica que el usuario exista y que la contraseña sea correcta.
    // - Actualiza la fecha de última conexión.
    // - Retorna el usuario autenticado.
    async loginUser(email, password) {
        if (!email || !password) throw new Error("Email o Password incorrectos!");

        try {
            const user = await userDao.getUserByEmailDao(email);
            if (!user) return ({ status: "error", message: "Usuario no encontrado" });

            const passwordMatch = await isValidPassword(user, password);
            if (!passwordMatch) return ({ status: "error", message: "Contraseña incorrecta" });

            // Actualiza la última conexión del usuario con la fecha actual.
            await this.updatedLastConection(user._id, new Date());

            return { message: "Inicio de sesión exitoso", user };
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error.message}`);
        }
    }

    // Actualiza los datos del usuario:
    // - Valida que el usuario exista y que se envíen datos para actualizar.
    // - Llama al DAO para realizar la actualización y retorna el resultado.
    async updatedUser(uid, userData) {
        const usuario = await userDao.getUserByIdDao(uid);
        if (!usuario) {
            throw new Error(`Usuario con ID: ${uid} no encontrado!`);
        }

        if (!userData || Object.keys(userData).length === 0) {
            throw new Error(`Debes completar los campos`);
        }

        try {
            const result = await userDao.updatedDao(uid, userData);
            return {
                message: "Usuario actualizado correctamente",
                result
            };
        } catch (error) {
            throw new Error("Error al actualizar el usuario: " + error.message);
        }
    }

    // Sube documentos al usuario:
    // - Verifica que el usuario exista y que se envíe un arreglo con documentos.
    // - Llama al DAO para agregar los documentos al campo 'documents'.
    async uploaderDocsUser(uid, docs) {
        const user = await userDao.getUserByIdDao(uid);
        if (!user) {
            throw new Error(`Usuario con ID: ${uid} no encontrado`);
        }

        // Verifica que 'docs' sea un arreglo y contenga al menos un documento.
        if (!Array.isArray(docs) || docs.length === 0) {
            throw new Error(`Debes agregar al menos un documento`);
        }

        try {
            const result = await userDao.uploadDocsDao(uid, docs);
            return {
                message: "Documentos Cargados Correctamente",
                result
            };
        } catch (error) {
            throw new Error("Error al subir los documentos: " + error.message);
        }
    }

    // Actualiza la última conexión del usuario:
    // - Valida que el usuario exista.
    // - Valida que se envíe una instancia de Date.
    // - Llama al DAO para actualizar el campo 'last_connection'.
    async updatedLastConection(uid, connection) {
        const usuario = await userDao.getUserByIdDao(uid);
        if (!usuario) {
            throw new Error(`Usuario con ID: ${uid} no encontrado`);
        }

        if (!connection || !(connection instanceof Date)) {
            throw new Error(`Faltan campos que completar: uid || connection`);
        }

        try {
            const result = await userDao.updatedLastConectionDao(uid, connection);
            return {
                message: "Fecha actualizada correctamente",
                result
            };
        } catch (error) {
            throw new Error(`Error al actualizar la fecha de conexión: ${error.message}`);
        }
    }

    // Elimina un usuario de la base de datos.
    async deleteUser(uid) {
        try {
            const result = await userDao.deleteUserDao(uid);
            return { message: "Usuario eliminado correctamente", result };
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    async sendEmailPasswordReset(email) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: EMAIL,
                pass: PASS
            }
        });

        const user = await userDao.getUserByEmailDao(email);
        if (!user) {
            throw new Error('Correo electronico no encontrado')
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`Este el token desde el email`, token);

        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Recuperacion de contraseña',
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Solicitud de Recuperación de Contraseña</h1>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, por favor ignora este correo.</p>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="http://localhost:5173/reset-password?token=${token}">
            <button class="btnChat">Restablecer Contraseña</button>
            </a>
            <p>Este enlace es válido por 1 hora.</p>
            <p>Gracias,</p>
            <p>El equipo de soporte de TresEstrellasMovil</p>
          </div>`
        });

        return token;
    }

    async resetPassword(token, newPassword) {
        try {
            const data = jwt.verify(token, SECRET_KEY);
            const { email } = data;
            const user = await userDao.getUserByEmailDao(email);

            if (!email) {
                throw new Error('La nueva contraseña no puede ser la misma que la anterior');
            }

            const hashedPassword = await createHash(newPassword);
            await userDao.updatedDao(user._id, { password: hashedPassword })
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
            } else {
                throw error;
            }
        }
    }

    async deleteInactiveUsers() {

        try {
            const users = await this.getAllUsers();

            const fifteenDaysAgo = new Date();
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 7); // Restamos 15 días

            const usersFilterConecction = users.filter(user => {
                if (!user.last_connection) return true; // Si no tiene registro, lo consideramos inactivo
                const lastConnection = new Date(user.last_connection);
                return lastConnection < fifteenDaysAgo;
            });

            if (usersFilterConecction.length === 0) {
                console.log("No hay usuarios para eliminar ");
                return { status: 'success', message: 'No hay usuarios inactivos' };
            }

            // Configurar el transporte para el envío de correos electrónicos
            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: EMAIL,
                    pass: PASS
                }
            });

            // Enviar correos electrónicos informando la eliminación
            for (const user of usersFilterConecction) {
                await transport.sendMail({
                    from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
                    to: user.email,
                    subject: 'Eliminación de Cuenta por Inactividad',
                    html: `<div style="font-family: Arial, sans-serif; color: #333;">
                        <h1>Cuenta Eliminada</h1>
                        <p>Hola ${user.first_name},</p>
                        <p>Te informamos que tu cuenta ha sido eliminada debido a inactividad durante más de 2 días.</p>
                        <p>Si crees que esto es un error, por favor, contáctanos.</p>
                        <p>Gracias,</p>
                        <p>El equipo de soporte de Tres Estrellas</p>
                       </div>`,
                });

                await this.deleteUser(user._id);

            }


            return { status: "success", message: `Usuarios eliminados ${usersFilterConecction.length}` }
        } catch (error) {
            throw new Error("Error al eliminar el usuario");
        }

    }
}


export default UserManager;
