import { createHash, isValidPassword } from "../utils/cryptoUtil.js";
import UserDto from "../dao/dto/userDto.js";
import UserDAO from "../dao/userDao.js";

const userDao = new UserDAO();

class UserManager {
    async getAllUsers() {
        return await userDao.getAllUsersDao();
    }

    async getUserById(uid) {
        const user = await userDao.getUserByIdDao(uid);
        if (!user) throw new Error("Usuario no encontrado");
        return new UserDto(user);
    }

    async register(user) {
        const { first_name, last_name, email, password, age } = user;
        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error("Debes completar todos los campos");
        }

        try {
            const existingUser = await userDao.getUserByEmailDao(email);
            if (existingUser) throw new Error("El email ya está registrado");

            const hashedPassword = await createHash(password);
            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: hashedPassword
            };

            return await userDao.createUserDao(newUser);
        } catch (error) {
            throw new Error(`Error al registrar usuario: ${error.message}`);
        }
    }

    async loginUser(email, password) {
        if (!email || !password) throw new Error("Email o Password incorrectos!");

        try {
            const user = await userDao.getUserByEmailDao(email);
            if (!user) throw new Error("Usuario no encontrado");

            const passwordMatch = await isValidPassword(user, password);
            if (!passwordMatch) throw new Error("Contraseña incorrecta");

            return { message: "Inicio de sesión exitoso", user };
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error.message}`);
        }
    }

    async deleteUser(uid) {
        try {
            const result = await userDao.deleteUserDao(uid);
            return { message: "Usuario eliminado correctamente", result };
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

export default UserManager;
