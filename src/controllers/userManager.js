import UserService from "../dao/services/userService.js";
const userService = new UserService();

import { createHash, isValidPassword } from "../utils/cryptoUtil.js";

class UserManager {

    async getAllUsers() {
        return await userService.getAllUserService();
    }

    async getUserById(uid) {
        return await userService.getUserByIdService(uid);
    }

    async register(user) {
        const { first_name, last_name, email, password, age } = user;

        if (!first_name || !last_name || !age || !email || !password) throw new Error(`Debes completar todos los campos`);

        try {

            const hashedPassword = await createHash(password);
            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: hashedPassword
            }

            const result = await userService.createUserService(newUser);

            return result;
        } catch (error) {
            throw new Error(`Error al registrar usuario: ${error.message}`);
        }
    }

    async loginUser(email, password) {
        if(!email || !password)  throw new Error(`Email o Password Incorrectos!`)
        try {
            const result = await userService.loginUserService(email,password);
            return result;
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error.message}`);
        }
    }

    async updateUser(uid, update) {
        const userId = this.users.find(u => u.id == parseInt(uid));
        if (!userId) throw new Error(`El usuario con ID: ${uid} no se encuentra`);

        try {
            for (const key in update) {
                userId[key] = update[key];
            }

            return userId;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteUser(uid) {
        try {
            const result = await userService.deleteUserService(uid)
            return {
                message: "Usuario eliminado correctamente",
                result
            }
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

export default UserManager;