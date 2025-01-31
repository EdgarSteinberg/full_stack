import { createHash, isValidPassword } from "../utils/cryptoUtil.js";

class UserManager {
    constructor() {
        this.users = [];

    }

    async getAllUsers() {
        return this.users;
    }

    async getUserById(uid) {
        const userId = await this.users.find(u => u.id == parseInt(uid));
        if (!userId) throw new Error(`El usuario con ID: ${uid} no se encuentra`);

        return userId;
    }

    async register(user) {
        const { first_name, last_name, email, password } = user;

        if (!first_name || !last_name || !email || !password) throw new Error(`Debes completar todos los campos`);

        try {
            const newId = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
            const hashedPassword = await createHash(password);
            const newUser = {
                id: newId,
                first_name,
                last_name,
                email,
                password: hashedPassword
            }

            this.users.push(newUser);

            return newUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const user = this.users.find(u => u.email === email);
            if (!user) throw new Error("Usuario no encontrado");
    
            const passwordMatch = await isValidPassword(password, user.password);
            if (!passwordMatch) throw new Error("Contraseña incorrecta");
    
            return {
                message: "Usuario logueado exitosamente",
                user
            };
        } catch (error) {
            throw new Error(error.message); // Relanzar el error para que el controlador lo maneje
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
        const userId = this.users.find(u => u.id == parseInt(uid));
        if (!userId) throw new Error(`El usuario con ID: ${uid} no se encuentra`);

        try {
            this.users = this.users.filter(u => u.id !== parseInt(uid));
            return `Usuario con ID ${uid} eliminado correctamente`;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default UserManager;